(function(Phaser) {
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
var Rat = function(game, x, y, gender, age) {
	// Inherit from Phaser.Sprite
	GameObject.call(this, game, x, y, "atlasRats");

	// Set base properties
	this.stats = {
		age: age,
		gender: gender
	};

	// Gender specific initialization
	switch (this.stats.gender) {
		case Rat.GENDER_FEMALE:
			// Set female sprites
			this.addAnim("north", ["female_n.png"]);
			this.addAnim("south", ["female_s.png"]);
			this.addAnim("west", ["female_w.png"]);
			this.addAnim("east", ["female_e.png"]);
			this.playAnim("south");
			// Set female stats
			this.stats.pregnancy = {
				pregnant: false,
				pregnantTime: 0
			};
			break;
		case Rat.GENDER_MALE:
			// Set male sprites
			this.addAnim("north", ["male_n.png"]);
			this.addAnim("south", ["male_s.png"]);
			this.addAnim("west", ["male_w.png"]);
			this.addAnim("east", ["male_e.png"]);
			this.playAnim("south");
	}
};

Rat.prototype = Object.create(GameObject.prototype);
Rat.prototype.constructor = Rat;

Rat.GENDER_MALE = 0;
Rat.GENDER_FEMALE = 1;
Rat.AGE_OF_CONSENT = 1200;
var bootState = {
	/*
	method: preload
	--------------------------------------------
	Loads in the main asset list
	*/
	preload: function() {
		game.load.json("assets_main", "assets/list_main.json");
	},

	/*
	method: create
	--------------------------------------------
	Will load all the main assets
	*/
	create: function() {
		// Initialize load event
		game.load.onFileComplete.add(function(progress, key, success, totalLoadedFiles, totalFiles) {
			game.state.start("game");
		}, this);

		// Prepare list
		var list = game.cache.getJSON("assets_main"),
			a = 0,
			b = 0,
			assetList = null,
			curAsset = null,
			assetTypes = [
				"images",
				"atlases"
			];

		// Load images
		for (b = 0; b < assetTypes.length; b++) {
			assetList = list[assetTypes[b]];
			for (a = 0; a < assetList.length; a++) {
				curAsset = assetList[a];
				switch (assetTypes[b]) {
					case "images":
						game.load.image(curAsset.key, curAsset.url);
						break;
					case "atlases":
						game.load.atlasJSONArray(curAsset.key, curAsset.url, curAsset.cfg_url);
						break;
				}
			}
		}
		game.load.start();
	}
};
var gameState = {
	/*
		method: preload
		Preloads the level stuff
	*/
	preload: function() {
		// Initialize level groups
		this.initGroups();

		// Rat test
		var rat = new Rat(game, 40, 40, Rat.GENDER_MALE, Rat.AGE_OF_CONSENT);
		this.levelGroup.add(rat);
		rat = new Rat(game, 80, 40, Rat.GENDER_FEMALE, Rat.AGE_OF_CONSENT);
		this.levelGroup.add(rat);
	},

	/*
		method: initGroups
		Initializes this state's groups (for game objects)
	*/
	initGroups: function() {
		this.levelGroup = new Phaser.Group(game);
	}
};
var game = new Phaser.Game(800, 600, Phaser.AUTO, "content", null);

game.state.add("boot", bootState);
game.state.add("game", gameState);

game.state.start("boot");
})(Phaser);