var GUI_Base = function() {
	Phaser.Group.call(this, game);
	game.state.getCurrentState().guiGroup.add(this);

	// Define properties
	Object.defineProperties(this, {
		"state": {
			get() {
				return game.state.getCurrentState();
			}
		}
	});
};
GUI_Base.prototype = Object.create(Phaser.Group.prototype);
GUI_Base.prototype.constructor = GUI_Base;

/*
	method: resize(width, height)
	Resizes this GUI element
*/
GUI_Base.prototype.resize = function(width, height) {
	this.width = width;
	this.height = height;
	this.updateClickBox();
};

/*
	method: updateClickBox
	Updates this GUI element's mouse-over hitbox
*/
GUI_Base.prototype.updateClickBox = function() {
	this.hitArea = new Phaser.Rectangle(0, 0, this.width, this.height);
};

/*
	method: mouseOver
	Returns true if the mouse is currently over this GUI element
*/
GUI_Base.prototype.mouseOver = function() {
	if(!this.hitArea) {
		return false;
	}
	var cursor = game.input.activePointer;
	return (cursor.x >= this.hitArea.x && cursor.x <= this.hitArea.right &&
					cursor.y >= this.hitArea.y && cursor.y <= this.hitArea.bottom);
};
