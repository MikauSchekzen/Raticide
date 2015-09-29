var GUI_Base = function() {
	game.add.existing(this);
	game.stage.add(this);

	// Set base GUI properties
	this._width = 0;
	this._height = 0;
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
		},
		"width": {
			get() {
				return this._width;
			},
			set(val) {
				this._width = val;
				this.postResize();
			}
		},
		"height": {
			get() {
				return this._height;
			},
			set(val) {
				this._height = val;
				this.postResize();
			}
		}
	});
};
GUI_Base.prototype = Object.create(Phaser.Image.prototype);
GUI_Base.prototype.constructor = GUI_Base;

/*
	method: postResize
	Automatically called after the width or height is adjusted
*/
GUI_Base.prototype.postResize = function() {
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
	var cursor = game.input.activePointer;
	return (cursor.x >= this.hitArea.x && cursor.x <= this.hitArea.right &&
					cursor.y >= this.hitArea.y && cursor.y <= this.hitArea.bottom);
};
