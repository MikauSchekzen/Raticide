var GUI_Base = function() {
	game.add.existing(this);
	game.stage.add(this);

	// Define properties
	Object.defineProperties(this, {
		"state": {
			get() {
				return game.state.getCurrentState();
			}
		}
	});
};
GUI_Base.prototype = Object.create(Phaser.Image.prototype);
GUI_Base.prototype.constructor = GUI_Base;
