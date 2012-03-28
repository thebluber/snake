
  //generate a random color
  var randColor = function(){
    return 'rgb(' + Crafty.math.randomInt(10, 255) + ',' + Crafty.math.randomInt(100, 255) + ',' + Crafty.math.randomInt(10, 255) + ')';
  };

  //make a snake
  var startSnake = function(){
    Crafty.e('block').makeBlock(150, 150, 'e', 'e', randColor()).addComponent('snakeHead');  
    Crafty.e('block').makeBlock(150 - (BLOCKSIZE + SPACE), 150, 'e', 'e', randColor());
    Crafty.e('block').makeBlock(150 - (BLOCKSIZE + SPACE) * 2, 150, 'e', 'e', randColor());
    Crafty.e('block').makeBlock(150 - (BLOCKSIZE + SPACE) * 3, 150, 'e', 'e', randColor());
    Crafty.e('block').makeBlock(150 - (BLOCKSIZE + SPACE) * 4, 150, 'e', 'e', randColor());
  }

  //move the snake
  var moveSnake = function(){
      var blocks = Crafty('block');
      var head = Crafty(blocks[0]);
      head.moveTo();
    
      for (var i = 1; i < blocks.length; i++){
        Crafty(blocks[i]).moveTo().eating();
        Crafty(blocks[i]).next_dir = Crafty(blocks[i - 1]).current_dir;
        Crafty(blocks[i]).feed = Crafty(blocks[i - 1]).feed;
      }
  };

  //set border
  var setBorder = function(){
    Crafty.e('2D, Canvas, Color, Border')
          .attr({x: -15, y: 0, w: 15, h: Crafty.viewport.height})
          .color('white');
    Crafty.e('2D, Canvas, Color, Border')
          .attr({x: 0, y: -15, w: Crafty.viewport.width, h: 15})
          .color('white');
    Crafty.e('2D, Canvas, Color, Border')
          .attr({x: Crafty.viewport.width, y: 0, w: 15, h: Crafty.viewport.height})
          .color('white');
    Crafty.e('2D, Canvas, Color, Border')
          .attr({x: 0, y: Crafty.viewport.height, w: Crafty.viewport.width, h: 15})
          .color('white');
  }

//generate feed
  var generateFeed = function(){
    var randX = Crafty.math.randomInt(1, 50 - (BLOCKSIZE + SPACE)) * (BLOCKSIZE + SPACE);
    var randY = Crafty.math.randomInt(1, 50 - (BLOCKSIZE + SPACE)) * (BLOCKSIZE + SPACE);
    var feed = Crafty.e('feed').makeFeed(randX, randY, randColor());

    if (feed.hit('block') || feed.hit('feed')) {
      feed.destroy();
      generateFeed();
    } else {
      return feed;
    }

  };

//collision snake && feed
  var collide = function(feed){
    var last = Crafty(Crafty('block')[Crafty('block').length - 1]);
    var head = Crafty(Crafty('block')[0]);
    if (feed.hit('snakeHead')) {
      head.feed = true;
      feed.fadeOut();
    } else {
      head.feed = false;
    }
    if (last.feed){
      Crafty.e('block').makeBlock(last.x, last.y, "", last.current_dir, feed.COLOR);
    }; 
  }

//main scene
Crafty.scene('main', function(){
  Crafty.background("black");
  //Initialize Timer
  _stepFrames = 80;
  var Timer = Crafty.e("Timer").resume(_stepFrames); 
 
  //set Border
  setBorder(); 

  //create a snake
  startSnake();

  //create feed
  generateFeed();

  //create a world
  var world = Crafty.e('2D, Canvas')
                    .attr({score: 0, lives: 3})
                    .bind('timerTick', function(e){
                      //move Snake
                      moveSnake();
                      if (Crafty('feed').length == 0) {
                        generateFeed();
                      } 
                      var blocks = Crafty('block');
                      var feeds = Crafty('feed');
                      for (var i = 0; i < feeds.length; i++){
                        collide(Crafty(feeds[i]));
                      }
                     /* 
                      var biteSelf = false;
                      var within = true;
                      
                      for (var i = 0; i < blocks.length; i++){
                        within = Crafty(blocks[i]).within(0, 0, Crafty.viewport.width, Crafty.viewport.height) && within;
                        biteSelf = Crafty(blocks[i]).hit('block') || biteSelf;
                      }
                      if (Crafty(blocks[0]).hit('Border')) {
                        for (var i = 0; i < blocks.length; i++){
                          Crafty(blocks[i]).x = Crafty(blocks[i]).old_x;
                          Crafty(blocks[i]).y = Crafty(blocks[i]).old_y;
                        }
                      } */
                    })  
                    .bind('KeyDown', function(e){
                      var head = Crafty(Crafty('block')[0]);
                      switch(e.keyCode){
                        case Crafty.keys.RIGHT_ARROW:
                          if (head.current_dir != "w"){
                            //head.current_dir = "e";
                            return head.next_dir = "e";
                          }
                        break;
     
                        case Crafty.keys.LEFT_ARROW:
                          if (head.current_dir != "e"){
                            //head.current_dir = "w";
                            return head.next_dir = "w";
                          }
                        break;
        
                        case Crafty.keys.UP_ARROW:
                          if (head.current_dir != "s"){
                            //head.current_dir = "n";
                            return head.next_dir = "n";
                          }
                        break;

                        case Crafty.keys.DOWN_ARROW:
                          if (head.current_dir != "n"){
                            //head.current_dir = "s";
                            return head.next_dir = "s";
                          }
                        break;

                        case Crafty.keys.SPACE:
                          if (!Timer.STOP) {
                            Timer.stop();
                          } else {
                            Timer.resume(_stepFrames);
                          }
                        break;

                        default:
                          return;
                        break;
                      } 
 
                    })
                    

})
