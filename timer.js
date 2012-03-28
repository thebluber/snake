
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
      , resume: function(stepFrames){
          this.f = stepFrames;
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

