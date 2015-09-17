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