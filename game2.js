window.onload = function(){
  BLOCKSIZE = 15;
  WIDTH = 50 * BLOCKSIZE;
  HEIGHT = 40 * BLOCKSIZE;
  //init Crafty
  Crafty.init(WIDTH, HEIGHT).canvas.init();

  //loading scene
  Crafty.scene('loading', function(){
    Crafty.load(["images/achievement.png", 'images/heart.svg', 'images/snake.svg', 'images/big.svg'], function() {
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
