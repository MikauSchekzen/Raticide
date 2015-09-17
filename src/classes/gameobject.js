var GameObject = function(game, x, y, imageKey) {
	// Inherit Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, imageKey);

	// Add self to game objects
	this.game.add.existing(this);

	// Set base properties
	this.game = game;
	Object.defineProperty(this, "state", {
		get() {
			return this.game.state.getCurrentState();
		}
	});
};

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

/*
	method: addAnim
	An override method for adding an animation to a game object
	Params: (key) A string containing the key to call the animation by
	        (frameList)
*/
GameObject.prototype.addAnim = function(key, frameList, frameRate, loop) {
	// Set default values for parameters
	if (typeof frameRate === "undefined") {
		frameRate = 60;
	}
	if (typeof loop === "undefined") {
		loop = true;
	}

	// Add animation
	this.animations.add(key, frameList, frameRate, false);
};

/*
	method: playAnim
	An override method for playing an animation for a game object
*/
GameObject.prototype.playAnim = function(key, frameRate) {
	// Set default values for parameters
	if(typeof frameRate === "undefined") {
		frameRate = 60;
	}

	// Play animation
	this.animations.play(key, frameRate);
};