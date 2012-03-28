window.onload = function(){
  BLOCKSIZE = 13;
  SPACE = 2;
  WIDTH = 50 * (BLOCKSIZE + SPACE);
  HEIGHT = 50 * (BLOCKSIZE + SPACE);
  //init Crafty
  Crafty.init(WIDTH, HEIGHT).canvas.init();

  //loading scene
  Crafty.scene('loading', function(){
    Crafty.load(["images/achievement.png"], function() {
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
