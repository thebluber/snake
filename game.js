window.onload = function(){
    BLOCKSIZE = 10;
    WIDTH = 64 * BLOCKSIZE;
    HEIGHT = 48 * BLOCKSIZE;
  //init Crafty
    Crafty.init(WIDTH, HEIGHT);
  
  //generate a random color  
    var randColor = function(){
      return 'rgb(' + Crafty.math.randomInt(10, 255) + ',' + Crafty.math.randomInt(100, 255) + ',' + Crafty.math.randomInt(10, 255) + ')';
   }

    Crafty.c('Achievement',{
      init: function(){
        this._image = Crafty.e('2D, DOM, Image, Tween').image('images/achievement.png').attr({x: 30, y: 30});
        this._text = "Set the Text";
        this._center = WIDTH / 2 - ((this._text.length * 15) / 2);
        this._textElement = Crafty.e('2D, DOM, Text, Tween').text(this._text).textColor('#dacfca').attr({x: this._center, y: 110, w:400}).textFont({weight: 'bold', size: '20px', family: 'Arial'});

        this._image.tween({alpha: 0.0}, 200);
        this._textElement.tween({alpha: 0.0}, 200);
      },

      text: function(newText) {
        this._text = newText;
        this._center = WIDTH / 2 - ((this._text.length * 12) / 2) ;
        this._textElement.attr({x: this._center}).text(this._text);
      }
     
    });
/**
 *Timer component to trigger timerTick event every 200 ms
 *
 *
 *
 * */

    var EVERY_SECONDS = 70;
    Crafty.c('Timer', { 
        f            : EVERY_SECONDS
      , STOP         : true
      , name         : ''
   
      , init: function(name){
          if (typeof name === 'undefined'){
            this.name =  'timer_'+ new Date();
          }else{
            this.name = name;
          }
          return this;
        }  
      , updateClock: function(){
          Crafty.trigger("timerTick",this);
          if (!this.STOP){
            var self = this;
            Crafty.e("Delay").delay(function(){self.updateClock();},this.f);
          } 
        }  
      , setFrequency: function(f){
          if ( typeof f !== 'undefined'){
            this.f = f;
          }
          return this;
        }
      , stop: function(){
          this.STOP = true;
          return this;
        }
      , resume: function(){
          this.STOP = false;
          this.updateClock();
          return this;
        }  
  
   });

/******
 *
 *
 *
*/


    //component block
      Crafty.c("block", {
          init: function(){
            this.addComponent("2D,Canvas,Color,Tween");
            this.attr({w: BLOCKSIZE, h: BLOCKSIZE});  
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
            this.move(this.current_dir, BLOCKSIZE);
            this.current_dir = this.next_dir; 
          }
      });
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
        var x = Crafty.math.randomInt(BLOCKSIZE, WIDTH - BLOCKSIZE);
        var y = Crafty.math.randomInt(BLOCKSIZE * 2, HEIGHT -BLOCKSIZE );
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
                  .attr({blocks:[t1,t2,t3,t4], lives: 3})
                  .bind('timerTick', function(e){
                    var head = this.blocks[0];
                    //update info
                    var snakeScore = this.blocks.length - 4 
                    info.text("SCORE:" + snakeScore + "  LIVES:" + this.lives).textFont({weight: 'normal', size: '15px'});
              
                    //is the snake within the boundary(WIDTH, HEIGHT - banner.h)
                    var minBoundary = {x: BLOCKSIZE * -1, y: banner.h + BLOCKSIZE};
                    var maxBoundary = {x: WIDTH - BLOCKSIZE, y: HEIGHT -BLOCKSIZE};
                    var isWithin = this.blocks.reduce(function(res, e){

                                      return res && e.within(minBoundary.x, minBoundary.y, maxBoundary.x, maxBoundary.y)
                                    });

                    // Trigger Achievement
                    if(!achievements['10points'] && snakeScore == 10){
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
                      load("YOUR SCORE:" + snakeScore +"\nRESTART");
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
          load("START");
        });
}
