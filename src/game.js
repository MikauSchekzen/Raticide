var game = new Phaser.Game(800, 600, Phaser.AUTO, "content", null, false, false);

game.state.add("boot", bootState);
game.state.add("game", gameState);
game.state.add("loadingscreen", loadingScreenState);

game.state.start("boot");