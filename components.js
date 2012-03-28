

    //component block
      Crafty.c("block", {
          init: function(){
            this.addComponent("2D,Canvas,Color,Tween, Collision")
                .attr({w: BLOCKSIZE, h: BLOCKSIZE});  
          },
          makeBlock: function(x, y, current_dir, next_dir, color){
            this.attr({x: x, y: y, current_dir: current_dir, next_dir: next_dir, COLOR: color, feed: false})
                .color(color);
            return this;
          },
          moveTo: function(){
            if (this.hit('Border')) {
              this.x = this.old_x;
              this.y = this.old_y;
              return this;
            } else {
              this.attr({old_x: this.x, old_y: this.y})
                  .move(this.current_dir, BLOCKSIZE + SPACE);
              this.current_dir = this.next_dir; 
              return this;
            }
          },
          eating: function(){
            if (this.feed){
              var big = Crafty.e('2D, Canvas, Color, Tween')
                              .attr({w: this.w + 6, h: this.h + 6, x: this.x - 3, y: this.y - 3})
                              .color(this.COLOR)
                              .tween({alpha: 0.0}, 20);
              window.setTimeout(function(){big.destroy(); this.feed = false}, 4000);
            };
              return this;
          }
      });
    //snake head
      Crafty.c('snakeHead', {
        init: function(){
           this.requires('block')
               .addComponent('Collision')
        },
/*
        makeHead: function(x, y, current_dir, next_dir, color){
          this.attr({x: x, y: y, current_dir: current_dir, next_dir: next_dir, COLOR: color})
              .color(color);
          return this;
        },
*/
      });

 //feed
    Crafty.c('feed', {
      init: function(){
        this.addComponent('2D, Canvas, Color, Tween, Collision')
            .attr({w: BLOCKSIZE + SPACE, h: BLOCKSIZE + SPACE});
      },

      makeFeed: function(x, y, color){
        this.attr({x: x, y: y, COLOR: color})
            .color(color);
        return this;
      },

      fadeOut: function(){
        this.tween({alpha: 0.0}, 20);
        var that = this;
        window.setTimeout(function(){that.destroy();}, 1000);
      }
    
    });
 //achievements
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
