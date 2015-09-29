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
	this.camera = new Camera(this.level);
	this.camera.zoomTo(2);
	
	// Initialize controls
	this.initControls();

	// Initialize GUI
	this.initGUI();
};

/*
	method: initControls
	Initializes the controls for this state
*/
gameState.initControls = function() {
	this.keyboard = {
		w: game.input.keyboard.addKey(Phaser.Keyboard.W),
		s: game.input.keyboard.addKey(Phaser.Keyboard.S),
		a: game.input.keyboard.addKey(Phaser.Keyboard.A),
		d: game.input.keyboard.addKey(Phaser.Keyboard.D)
	};
};

/*
	method: update
*/
gameState.update = function() {
	this.cameraControls();
};

/*
	method: cameraControls
	Update function for camera controls
*/
gameState.cameraControls = function() {
	var moveRel = {
		x: 0,
		y: 0,
		relative: true
	};
	if(this.keyboard.w.isDown) {
		moveRel.y--;
	}
	if(this.keyboard.s.isDown) {
		moveRel.y++;
	}
	if(this.keyboard.a.isDown) {
		moveRel.x--;
	}
	if(this.keyboard.d.isDown) {
		moveRel.x++;
	}

	moveRel.x *= GameData.camera.keyboardSpeedMod;
	moveRel.y *= GameData.camera.keyboardSpeedMod;

	this.camera.move(moveRel);
};

/*
	method: initGUI
	Initializes GUI group
*/
gameState.initGUI = function() {
	this.guiGroup = game.add.group(game.stage);

	// Create test frame
	var frame = new GUI_Frame(game.camera.width - 200, 0, 200, 300);
};
