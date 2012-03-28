window.onload = function(){
    BLOCKSIZE = 14;
    WIDTH = 50 * BLOCKSIZE;
    HEIGHT = 50 * BLOCKSIZE;
  //init Crafty
    Crafty.init(WIDTH, HEIGHT).canvas.init();
  
  //generate a random color  
    var randColor = function(){
      return 'rgb(' + Crafty.math.randomInt(10, 255) + ',' + Crafty.math.randomInt(100, 255) + ',' + Crafty.math.randomInt(10, 255) + ')';
   }
    //move the snake
      var move = function(snake){
        var head = snake.blocks[0];
        head.moveTo();
        for (var i = 1; i < snake.blocks.length; i++){
          snake.blocks[i].moveTo();
          snake.blocks[i].next_dir = snake.blocks[i-1].current_dir;
        };
        return snake;
      }

    //Initialize Timer
      var Timer = Crafty.e("Timer").resume(); 


    //init start or restart scene
      var load = function(text){
     //define start scene
        Crafty.scene("start", function(){
          //loading text
          Crafty.background("black");
          //middlepoint
          var m = {x: WIDTH/2 - 50, y: HEIGHT/2 - 10};
          //set text
          Crafty.e("2D, DOM, Text, Tween").attr({ w: 100, h: 20, x: m.x, y: m.y, fadeOut: "false"})
              .text(text)
              .css({ "text-align": "center", "color": "white"})
              .bind("timerTick", function(){
                if(this.fadeOut){
                  this.tween({alpha: 1.0}, 5);
                  this.fadeOut = false;
                } else {
                  this.tween({alpha: 0.0}, 5);
                  this.fadeOut = true;
                };

              });

          //trigger main scene
          Crafty.e("2D, DOM, Mouse").attr({w: WIDTH, h: HEIGHT, x: 0, y: 0})
              .bind("Click", function(e){
                Crafty.scene("main");
              });

          //background
          var wind = 0;
          var snake = Crafty.e("2D,Canvas")
                            .attr({blocks: [Crafty.e("block").makeBlock(0,BLOCKSIZE,"e","e",randColor())]})
                            .bind('EnterFrame', function(e){
                              var head = this.blocks[0];
                              var last = this.blocks[this.blocks.length - 1];
                              var max = {x: WIDTH, y: HEIGHT};
                              //set direction
                              var setDir = function(){
                                var dirs = ["e", "s", "w", "n"];
                                if (head.next_dir == "e" && head.x == max.x - ((3 + wind) * BLOCKSIZE)){ return head.next_dir = "s";};
                                if (head.next_dir == "s" && head.y == max.y - ((3 + wind) * BLOCKSIZE)){ return head.next_dir = "w";};
                                if (head.next_dir == 'w' && head.x == (2 + wind) * BLOCKSIZE ){wind++;return head.next_dir = "n";};
                                if (head.next_dir == 'n' && head.y == (2 + wind) * BLOCKSIZE ){;return  head.next_dir = "e";};
                              };
                              move(this);
                              setDir();
                              if (this.blocks.length < 80) { //(max.x/BLOCKSIZE) * 2 + (max.y/BLOCKSIZE) * 2) {
                                this.blocks.push(Crafty.e("block").makeBlock(last.x, last.y, "", last.current_dir, randColor()))
                              }; 
                             
                              //reset position
                              if (!last.within(0,0,max.x,max.y)){
                                this.blocks.map(function(b){b.destroy()});
                                this.blocks = [Crafty.e("block").makeBlock(0,BLOCKSIZE,"e","e",randColor())]; 
                                wind = 0;
                              }
                                
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
        var x = Crafty.math.randomInt(BLOCKSIZE * 3, WIDTH - BLOCKSIZE * 2);
        var y = Crafty.math.randomInt(BLOCKSIZE * 3, HEIGHT -BLOCKSIZE * 2);
        var color = randColor();
        return Crafty.e("2D,Canvas,Color,Tween")
                     .attr({x: x, y: y, w: BLOCKSIZE, h: BLOCKSIZE, feedColor: color})
                     .color(color);  
      };
      var feed = makeFeed();
      //Info banner
      var banner = Crafty.e("2D, Canvas, Color")
                         .attr({w:WIDTH + BLOCKSIZE, h:20, x: -10, y: 0})
                         .color('rgb(75,74,74)');
      //Score && lives
      var info = Crafty.e("2D, DOM, Text")
                        .attr({w: WIDTH, h: 10, x: 5, y: 0})
                        .css({"color": "white"});
      //create a snake
      var t1 = Crafty.e("block").makeBlock(100, 100, "e", "e", randColor());
      var t2 = Crafty.e("block").makeBlock(90, 100, "e", "e", randColor());
      var t3 = Crafty.e("block").makeBlock(80, 100, "e", "e", randColor());
      var t4 = Crafty.e("block").makeBlock(70, 100, "e", "e", randColor());

      var achievements = {};
      var snake = Crafty.e("2D,Canvas")
                  .attr({blocks:[t1,t2,t3,t4], lives: 3, score: 0})
                  .bind('timerTick', function(e){
                    var head = this.blocks[0];
                    info.text("SCORE:" + this.score + "  LIVES:" + this.lives).textFont({weight: 'normal', size: '15px'});
              
                    //is the snake within the boundary(WIDTH, HEIGHT - banner.h)
                    var minBoundary = {x: BLOCKSIZE * -1, y: banner.h + BLOCKSIZE};
                    var maxBoundary = {x: WIDTH, y: HEIGHT};
                    var isWithin = this.blocks.reduce(function(res, e){

                                      return res && e.within(minBoundary.x, minBoundary.y, maxBoundary.x, maxBoundary.y)
                                    });

                    // Trigger Achievement
                    if(!achievements['10points'] && this.score == 10){
                      achievements['10points'] = true;
                      Crafty.e('Achievement').text('Looooong Snake!');
                    }
                    //restart the game
                     
                    var that = this;
                    var restart = function(){
                      that.blocks.map(function(t){
                        t.tween({alpha: 0.0}, 20);
                        t.destroy();
                      });
                      that.destroy();
                      feed.destroy();
                      load("YOUR SCORE:" + this.score +"\nRESTART");
                    };                
                    //does the snake bite itself
                    var bite = this.blocks.slice(1).reduce(function(res, t){
                      return res || t.intersect(head.x, head.y, BLOCKSIZE, BLOCKSIZE);  
                    }, false);
                    //does the snake eat a feed
                    var eatFeed = head.intersect(feed.x, feed.y, BLOCKSIZE, BLOCKSIZE);

                    if (isWithin) { 
                      move(this);
                  
                      if (bite) { this.lives -= 1};
                      if (eatFeed) {
                        this.score += 1;
                        var last = this.blocks[this.blocks.length - 1];
                        this.blocks.push(Crafty.e("block").makeBlock(last.x, last.y, "", last.current_dir, feed.feedColor));
                        feed.tween({alpha: 0.0}, 10);
                        feed.destroy();
                        feed = makeFeed();
                        return this;
                      };
                    } else {
                      //create a snake
                      var t1 = Crafty.e("block").makeBlock(100, 100, "e", "e", randColor());
                      var t2 = Crafty.e("block").makeBlock(90, 100, "e", "e", randColor());
                      var t3 = Crafty.e("block").makeBlock(80, 100, "e", "e", randColor());
                      var t4 = Crafty.e("block").makeBlock(70, 100, "e", "e", randColor());
                      this.lives -= 1;
                      this.blocks.map(function(b){b.destroy()});
                      this.blocks = [t1,t2,t3,t4];
                    }
                    if (this.lives <= 0) {restart();}
                  })
                  .bind('KeyDown', function(e){
                    switch(e.keyCode){
                      case Crafty.keys.RIGHT_ARROW:
                        if (this.blocks[0].current_dir != "w"){
                          return this.blocks[0].next_dir = "e";
                        }
                      break;
                      case Crafty.keys.LEFT_ARROW:
                        if (this.blocks[0].current_dir != "e"){
                          return this.blocks[0].next_dir = "w";
                        }
                      break;
                      case Crafty.keys.UP_ARROW:
                        if (this.blocks[0].current_dir != "s"){
                          return this.blocks[0].next_dir = "n";
                        }
                      break;
                      case Crafty.keys.DOWN_ARROW:
                        if (this.blocks[0].current_dir != "n"){
                          return this.blocks[0].next_dir = "s";
                        }
                      break;
                      case Crafty.keys.SPACE:
                          if (!Timer.STOP) {
                            Timer.stop();
                          } else {
                            Timer.resume();
                          }
                      break;
                      default:
                        return;
                      break;
                    } 
                  });
    };

    Crafty.load(['images/achievement.png'],
        function() {
          Crafty.scene("main");
        });
}
