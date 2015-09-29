var GUI_Base = function() {
	Phaser.Sprite.call(this, game, 0, 0);
	game.add.existing(this);
	game.state.getCurrentState().guiGroup.add(this);

	// Set base GUI properties
	this.width = 0;
	this.height = 0;
	this.x = 0;
	this.y = 0;

	// Define properties
	Object.defineProperties(this, {
		"state": {
			get() {
				return game.state.getCurrentState();
			}
		},
		"right": {
			get() {
				return this.x + this.width;
			}
		},
		"bottom": {
			get() {
				return this.y + this.height;
			}
		},
		"left": {
			get() {
				return this.x;
			}
		},
		"top": {
			get() {
				return this.y;
			}
		}
	});
};
GUI_Base.prototype = Object.create(Phaser.Sprite.prototype);
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
