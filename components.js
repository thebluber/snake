

    //component block
      Crafty.c("block", {
          init: function(){
            this.addComponent("2D,Canvas,Color,Tween, Collision, snake")
                .attr({w: BLOCKSIZE, h: BLOCKSIZE});  
          },
          makeBlock: function(x, y, current_dir, next_dir, color){
            this.attr({x: x, y: y, current_dir: current_dir, next_dir: next_dir, COLOR: color, current_feedColor: false, next_feedColor: false})
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
                  .move(this.current_dir, BLOCKSIZE);
              this.current_dir = this.next_dir; 
              return this;
            }
          },
          eating: function(){
            if (this.current_feedColor){
              var big = Crafty.e('2D, Canvas, Color, Tween, big')
                              .attr({w: this.w + 8, h: this.h + 8, x: this.x - 4, y: this.y - 4})
                              .color(this.COLOR)
                              .tween({alpha: 0.0}, 20);
              window.setTimeout(function(){big.destroy(); }, 200);
              if (this.has('tail')){
                Crafty.e('block, tail').makeBlock(this.x, this.y, "", this.current_dir, this.current_feedColor);
                this.removeComponent('tail');
              }
            };
              this.current_feedColor = this.next_feedColor;
              return this;
          },
      });
    //snake head
      Crafty.c('snakeHead', {
        init: function(){
           this.requires('block')
               .addComponent('Collision')
               .removeComponent('snake')
        },

        addPic: function(pic) {
           this.attr({pic: pic})
               .addComponent(pic);
        return this;
        }
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
        this.addComponent('2D, Canvas, Color, Tween, Collision, egg')
            .attr({w: BLOCKSIZE, h: BLOCKSIZE});
      },

      makeFeed: function(x, y, color, timeOut){
        this.attr({x: x, y: y, COLOR: color, timeOut: timeOut, eaten: false, timeOuted: false})
            .color(color);
        return this;
      },
      
      fadeOut: function(){
            this.removeComponent('Collision')
                .tween({alpha: 0.0}, 20);
            return this;
      },

      setTimeOut: function(){
            if (this.timeOut == 0 && !this.timeOuted) {
              this.fadeOut();
              this.timeOuted = true;
              Crafty.e('2D, Canvas, Color, Tween, Gravity, Collision, Border')
                    .attr({w: this.w, h: this.h, x: this.x, y: this.y})
                    .color(this.COLOR)
                    .gravity('2D')
                    .color('white');
              this.destroy();
              generateFeed();
            };
      },


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
