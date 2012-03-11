window.onload = function(){
    blockSize = 10;
    gameWidth = 44 * blockSize;
    gameHeight = 28 * blockSize;
  //init Crafty
    Crafty.init(gameWidth, gameHeight);
  
  //generate a random color  
    var randColor = function(){
      return 'rgb(' + Crafty.math.randomInt(10, 255) + ',' + Crafty.math.randomInt(100, 255) + ',' + Crafty.math.randomInt(10, 255) + ')';
    }
  //component block
    Crafty.c("block", {
        init: function(){
          this.addComponent("2D,Canvas,Color,Tween");
          this.attr({w: blockSize, h: blockSize});  
        },
        makeBlock: function(x, y, current_dir, next_dir, color){
          this.attr("x", x);
          this.attr("y", y);
          this.attr("current_dir", current_dir);
          this.attr("next_dir", next_dir);
          this.color(color);
          return this;
        },
        moveTo: function(){
          this.move(this.current_dir, blockSize);
          this.current_dir = this.next_dir; 
        }
    });

  //init start or restart scene
    var load = function(text){
      //define start scene
      Crafty.scene("start", function(){
        //loading text
        Crafty.background("black");
        var sceneText = Crafty.e("2D, DOM, Text, Tween").attr({ w: 100, h: 20, x: (gameWidth / 2) - 50, y: (gameHeight / 2) - 20, fadeOut: "false"})
            .text(text)
            .css({ "text-align": "center", "color": "white"})
            .bind("EnterFrame", function(){
              if(Crafty.frame() % 10 === 0){
              if(this.fadeOut){
                this.tween({alpha: 1.0}, 10);
                this.fadeOut = false;
              } else {
                this.tween({alpha: 0.0}, 10);
                this.fadeOut = true;
              };
            }})
        Crafty.e("2D, DOM, Mouse").attr({w: sceneText.w, h: sceneText.h, x: sceneText.x, y: sceneText.y})
            .bind("Click", function(e){
              Crafty.scene("main");
            });
        //background snake
        var snake = Crafty.e("2D,Canvas")
                        .attr({blocks: [Crafty.e("block").makeBlock(-10,0,"e","e",randColor())]})
                        .bind('EnterFrame', function(e){
                          var head = this.blocks[0];
                          var last = this.blocks[this.blocks.length - 1];
                          var max = {x: gameWidth, y: gameHeight};
                          var min = {x: 0, y: 0};
                          head.moveTo();
                          for(var i = 1; i < this.blocks.length; i++){
                            this.blocks[i].moveTo();
                            this.blocks[i].next_dir = this.blocks[i-1].current_dir;
                          };
                          if (this.blocks.length >= ((max.x / blockSize) * 2) + ((max.y / blockSize) * 2)) {
                            this.blocks = [Crafty.e("block").makeBlock(-10,0,"e","e",randColor())]
                          } else {
                            this.blocks.push(Crafty.e("block").makeBlock(last.x, last.y, "", last.current_dir, randColor()));
                          };
                          if (head.x + 20 >= max.x) {head.next_dir = "s"};
                          if (head.y + 20 >= max.y) {
                            if (head.x - 10 <= min.x){
                              head.next_dir = "n";
                            } else{ head.next_dir = "w"};
                          };

                          
                        })
      
      });
      Crafty.scene("start");
    };

  //main scene
    Crafty.scene("main", function(){
      Crafty.background("black");
      start();
    });

  //start game
    var start = function(){
      //create feed
      var makeFeed = function(){
        var x = Crafty.math.randomInt(blockSize, Crafty.viewport.width - blockSize);
        var y = Crafty.math.randomInt(blockSize, Crafty.viewport.height - blockSize);
        var color = randColor();
        return Crafty.e("2D,Canvas,Color,Tween")
                     .attr({x: x, y: y, w: blockSize, h: blockSize, feedColor: color})
                     .color(color);  
      };
      var feed = makeFeed();
      //Score
      var score = Crafty.e("2D, DOM, Text")
                        .attr({w: 100, h: 20, x: 5, y: 5})
                        .css({"color": "white"});
      //create a snake
      var t1 = Crafty.e("block").makeBlock(100, 100, "e", "e", randColor());
      var t2 = Crafty.e("block").makeBlock(90, 100, "e", "e", randColor());
      var t3 = Crafty.e("block").makeBlock(80, 100, "e", "e", randColor());
      var t4 = Crafty.e("block").makeBlock(70, 100, "e", "e", randColor());
      var snake = Crafty.e("2D,Canvas")
                  .attr({blocks:[t1,t2,t3,t4]})
                  .bind('EnterFrame', function(e){
                    var head = this.blocks[0];
                    //update score
                    var snakeScore = this.blocks.length - 4 
                    score.text("SCORE:" + snakeScore);
                    //is the snake within the boundary
                    var isWithin = this.blocks.reduce(function(res, e){return res && e.within(0, 0, Crafty.viewport.width, Crafty.viewport.height)});
                    //restart the game
                    var that = this;
                    var restart = function(){
                      that.blocks.map(function(t){
                        t.tween({alpha: 0.0}, 20);
                        t.destroy();
                      });
                      that.destroy();
                      feed.destroy();
                      that.delay(load("YOUR SCORE:" + snakeScore +"\nRESTART"), 2000);
                    };                
                    //does the snake bite itself
                    var bite = this.blocks.slice(1).reduce(function(res, t){
                      return res || t.intersect(head.x, head.y, blockSize, blockSize);  
                    }, false);
                    //does the snake eat a feed
                    var eatFeed = head.intersect(feed.x, feed.y, blockSize, blockSize);

                    if (isWithin) {
                      if (Crafty.frame() % 5 === 0){ 
                        head.moveTo();
                        for(var i = 1; i < this.blocks.length; i++){
                          this.blocks[i].moveTo();
                          this.blocks[i].next_dir = this.blocks[i-1].current_dir; 
                        }
                      };
                  
                      if (bite) { restart()};
                      if (eatFeed) {
                        var last = this.blocks[this.blocks.length - 1];
                        this.blocks.push(Crafty.e("block").makeBlock(last.x, last.y, "", last.current_dir, feed.feedColor));
                        feed.tween({alpha: 0.0}, 10);
                        feed.destroy();
                        feed = makeFeed();
                        return this;
                      };
                    } else {
                      restart();
                    };
                  })
                  .bind('KeyDown', function(e){
                    switch(e.keyCode){
                      case Crafty.keys.RIGHT_ARROW:
                        this.blocks[0].next_dir = "e"
                      break;
                      case Crafty.keys.LEFT_ARROW:
                        this.blocks[0].next_dir = "w"
                      break;
                      case Crafty.keys.UP_ARROW:
                        this.blocks[0].next_dir = "n"
                      break;
                      case Crafty.keys.DOWN_ARROW:
                        this.blocks[0].next_dir = "s"
                      break;
                      case Crafty.keys.SPACE:
                          Crafty.pause();
                      break;
                      default:
                        return;
                      break;
                    } 
                  });
    };
    load("START");
}
