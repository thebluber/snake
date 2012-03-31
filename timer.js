
/**
 *Timer component to trigger timerTick event every 200 ms
 *
 *
 *
 * */
    Crafty.c('Timer', {
        _f           : 90  
      , _start       : 90
      , f            : this._start
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
            Crafty.e("Delay").delay(function(){
              self.updateClock();
            },this.f);
          } 
        }  
      , setFrequency: function(f){
          if ( typeof f !== 'undefined'){
            this._f = f;
            this.f = this._f;
          }
          return this;
        }
      , stop: function(){
          this.STOP = true;
          return this;
        }
      , resume: function(){
          this.f = this._f;
          this.STOP = false;
          this.updateClock();
          return this;
        }
      , reset: function(){
          this.f = this._start;
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
