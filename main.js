  //sprites
  Crafty.sprite(15, 'images/snake.svg', {
    snake: [0, 0]  
 
  }); 
  Crafty.sprite(15, 'images/snakehead.svg', {
    head1: [0, 0],  
    head2: [1, 0],  
    head3: [2, 0],  
    head4: [3, 0],  
 
  }); 
  Crafty.sprite(15, 'images/heart.svg', {
    heart: [0, 0]  
 
  }); 
  Crafty.sprite(23, 'images/big.svg', {
    big: [0, 0]  
 
  }); 
  Crafty.sprite(15, 'images/egg.svg', {
    egg: [0, 0]  
 
  }); 



  COLORS = [
    'rgb(255, 0, 0)',
    'rgb(255, 0, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 0, 255)',
    'rgb(255, 255, 0)',
    'rgb(0, 255, 255)',
    'rgb(0, 255, 255)',
    'rgb(0, 255, 255)',
    'rgb(255, 0, 255)',
    'rgb(100, 100, 100)',

  
  ];
  
  //generate a random color
  var randColor = function(){
    return 'rgb(' + Crafty.math.randomInt(10, 255) + ',' + Crafty.math.randomInt(100, 255) + ',' + Crafty.math.randomInt(10, 255) + ')';
  };

  var randFeedColor = function(){
    var rand = Crafty.math.randomInt(0, COLORS.length - 1);
    return COLORS[rand];
  };
  //make a snake
  var startSnake = function(){
    Crafty.e('snakeHead').makeBlock(150, 150, 'e', 'e', randColor()).addPic('head1');  
    Crafty.e('block').makeBlock(150 - BLOCKSIZE, 150, 'e', 'e', randColor());
    Crafty.e('block').makeBlock(150 - BLOCKSIZE * 2, 150, 'e', 'e', randColor());
    Crafty.e('block').makeBlock(150 - BLOCKSIZE * 3, 150, 'e', 'e', randColor());
    Crafty.e('block').makeBlock(150 - BLOCKSIZE * 4, 150, 'e', 'e', randColor());
  }

  //move the snake
  var moveSnake = function(){
      var blocks = Crafty('block');
      var head = Crafty(blocks[0]);
      if (blocks.length != 0) {
        head.moveTo();
    
        for (var i = 1; i < blocks.length; i++){
          Crafty(blocks[i]).moveTo().eating();
          Crafty(blocks[i]).next_dir = Crafty(blocks[i - 1]).current_dir;
          Crafty(blocks[i]).x = Crafty(blocks[i - 1]).old_x;
          Crafty(blocks[i]).y = Crafty(blocks[i - 1]).old_y;
          Crafty(blocks[i]).next_feed = Crafty(blocks[i - 1]).current_feed;
        }
      };
  };
  //crop snake via color
  var crop = function(){
    var blocks = Crafty('block');
    var b1 = Crafty(blocks[blocks.length - 1]);
    var b2 = Crafty(blocks[blocks.length - 2]);
    var b3 = Crafty(blocks[blocks.length - 3]);
    var b4 = Crafty(blocks[blocks.length - 4]);
    if (b1.COLOR == b2.COLOR && b2.COLOR == b3.COLOR) {
       Crafty.e('2D, Canvas, Color, Tween, big')
             .attr({w: b2.w + 4, h: b2.h + 4, x: b2.x - 2, y: b2.y - 2})
             .color(b1.COLOR)
             .tween({alpha: 0.0}, 30);
      b1.destroy();
       Crafty.e('2D, Canvas, Color, Tween, big')
             .attr({w: b3.w + 4, h: b3.h + 4, x: b3.x - 2, y: b3.y - 2})
             .color(b1.COLOR)
             .tween({alpha: 0.0}, 30);
      b2.destroy();
       Crafty.e('2D, Canvas, Color, Tween, big')
             .attr({w: b3.w + 4, h: b3.h + 4, x: b4.x - 2, y: b4.y - 2})
             .color(b1.COLOR)
             .tween({alpha: 0.0}, 30);
      b3.destroy();
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
    var randX = Crafty.math.randomInt(1, 50 - BLOCKSIZE) * BLOCKSIZE;
    var randY = Crafty.math.randomInt(1, 50 - BLOCKSIZE) * BLOCKSIZE;
    var randTime = Crafty.math.randomInt(3, 15) * 10;
    var feed = Crafty.e('feed').makeFeed(randX, randY, randFeedColor(), randTime);

    if (feed.hit('block') || feed.hit('feed')) {
      feed.destroy();
      generateFeed();
    };
     

  };
//feed timeout
  var timeOutFeed = function(feed){
    feed.timeOut -= 1;
    if ( feed.timeOut == 0) {
      feed.setTimeOut();
      generateFeed();
    };
  };

//collision snake && feed
  var collide = function(feed){
    var last = Crafty(Crafty('block')[Crafty('block').length - 1]);
    var head = Crafty(Crafty('block')[0]);
    if (!feed.eaten && feed.hit('snakeHead')) {
      console.log(feed);
      head.next_feed = true;
      last.attr({feed_COLOR: feed.COLOR})
      feed.eaten = true;
      feed.destroy();
      generateFeed();
    } else {
      head.next_feed = false;
    };
    if (last.current_feed){
      Crafty.e('block').makeBlock(last.x, last.y, "", last.current_dir, last.feed_COLOR);
      last = Crafty(Crafty('block')[Crafty('block').length - 1]);
      Crafty('big').destroy();
    }; 
  }

//timer manipulation
  var manipulate = function(Timer, freq){
    var blocks = Crafty('block');
    if (blocks.length < 10 && !freq['start']) {
      Timer.setFrequency(70);
      freq['start'] = true;
    } else {
      freq['start'] = false;
    };

    if (blocks.length == 10 && !freq['10']) {
      Timer.setFrequency(40);
      freq['10'] = true;
    } else {
      freq['10'] = false;
    };
  };

/*
//gameover
  var gameOver = function(){
    var blocks = Crafty('block');
    for (var i = 0; i < blocks.length; i++){
      var b = Crafty(blocks[i]);
      var randTime = Crafty.math.randomInt(5, 10) * 100
      window.setTimeout(function(){
       var n_b = Crafty.e('2D, Canvas, Gravity, Color, Tween, Collision, snake')
                  .attr({w: b.w, h: b.h, x: b.x, y: b.y})
                  .color(b.COLOR)
                  .gravity('Border')
         b.destroy();
         if (n_b.hit('Border')) {n_b.addComponent('Border')};
      }, randTime)

    };

 }
*/

//main scene
Crafty.scene('main', function(){
  Crafty.background("black");
  //Initialize Timer
  var Timer = Crafty.e("Timer").reset(); 
  var GAMEOVER = false;
  /*
  //snake sizes for frequency setting
  var manipulationOn = true;
  var FREQ = {};*/

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
                      /*
                      //timer manipulation
                      if (manipulationOn) {
                        manipulate(Timer, FREQ);
                      }; */
                      if (!GAMEOVER) {
                        //move Snake
                        moveSnake();

                        var blocks = Crafty('block');
                        var feeds = Crafty('feed');

                        for (var i = 0; i < feeds.length; i++){
                          collide(Crafty(feeds[i]));
                          timeOutFeed(Crafty(feeds[i]));
                          if (Crafty(feeds[i])._alpha < 0.1) {
                            Crafty(feeds[i]).destroy();
                          };
                        };
                        crop();
                        var biteSelf = Crafty(blocks[0]).hit('block');
                      
                      }
                     /* 
                      if (Crafty(blocks[0]).hit('Border')) {
                        for (var i = 0; i < blocks.length; i++){
                          Crafty(blocks[i]).x = Crafty(blocks[i]).old_x;
                          Crafty(blocks[i]).y = Crafty(blocks[i]).old_y;
                        }
                      } */
                    })  
                    .bind('KeyDown', function(e){
                      var blocks = Crafty('block');
                      var head = Crafty(blocks[0]);
                      var _changeDir = function(dir){
                         head.removeComponent(head.pic);
                         head.current_dir = dir;
                         head.next_dir = dir;
                         for (var i = 1; i < blocks.length; i++){
                           Crafty(blocks[i]).next_dir = Crafty(blocks[i-1]).current_dir;
                         };
                      }
                      if (!Timer.STOP) {
                        switch(e.keyCode){
                          case Crafty.keys.RIGHT_ARROW:
                            if (head.current_dir != "w"){
                              _changeDir('e');
                              head.addComponent('head1');
                            }
                          break;
     
                          case Crafty.keys.LEFT_ARROW:
                            if (head.current_dir != "e"){
                              _changeDir('w');
                              head.addComponent('head3');
                            }
                          break;
        
                          case Crafty.keys.UP_ARROW:
                            if (head.current_dir != "s"){
                              _changeDir('n');
                              head.addComponent('head4');
                            }
                          break;

                          case Crafty.keys.DOWN_ARROW:
                            if (head.current_dir != "n"){
                              _changeDir('s');
                              head.addComponent('head2');
                            }
                          break;

                          case Crafty.keys.SPACE:
                              Timer.stop();
                          break;

                          default:
                            return;
                          break;
                        }

                      } else {
                          if (e.keyCode == Crafty.keys.SPACE) {Timer.resume();};
                      }
                    })
                    

})
