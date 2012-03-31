window.onload = function(){
  //anti scrolling
  document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40};
  GRIDWIDTH = 40;
  GRIDHEIGHT = 30;
  BLOCKSIZE = 15;
  WIDTH = GRIDWIDTH * BLOCKSIZE;
  HEIGHT = GRIDHEIGHT * BLOCKSIZE;
  //init Crafty
  Crafty.init(WIDTH, HEIGHT).canvas.init();

  //loading scene
  Crafty.scene('loading', function(){
    Crafty.load(["images/achievement.png", 'images/heart.svg', 'images/egg.svg','images/snakehead.svg','images/snake.svg', 'images/big.svg'], function() {
        Crafty.scene("main");
    });
    
    Crafty.background("#000");
    Crafty.e("2D, DOM, Text")
          .attr({ w: 150, h: 20, x: Crafty.viewport.width / 2 - 70, y: Crafty.viewport.height / 2 - 10})
          .text("LOADING...")
          .css({ "text-align": "center", "color": "white", "font-size": "300%", "font-style": "bold", "font-family": "Impact"});
  });
  
  Crafty.scene('loading');

}
