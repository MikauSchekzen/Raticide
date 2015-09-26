var gameState = new Phaser.State();

/*
	method: init(level)
	Initializes the level's data
*/
gameState.init = function(level) {
	this.level = level;
};

/*
	method: create
	Starts the level
*/
gameState.create = function() {
	// Initialize the level group (for zooming)
	this.level.initLevel();
	this.level.scale.set(2);
};