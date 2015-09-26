var Camera = function(level) {
	this.level = level;
	this.baseCamera = game.camera;

	// Set basic data
	this.zoom = 1;

	// Define properties
	Object.defineProperties(this, {
		"top": {
			get() {
				return this.baseCamera.x / this.zoom;
			}
		},
		"left": {
			get() {
				return this.baseCamera.y / this.zoom;
			}
		},
		"width": {
			get() {
				return this.baseCamera.width / this.zoom;
			}
		},
		"height": {
			get() {
				return this.baseCamera.height / this.zoom;
			}
		},
		"right": {
			get() {
				return this.left + this.width;
			}
		},
		"bottom": {
			get() {
				return this.top + this.height;
			}
		}
	})
};
Camera.prototype.constructor = Camera;

/*
	method: zoom(factor)
	Zooms the camera to the specified factor
*/
Camera.prototype.zoomTo = function(factor) {
	this.zoom = factor;
	this.level.scale.set(this.zoom);
	this.baseCamera.bounds = new Phaser.Rectangle(0, 0, (this.level.width * GameData.tile.width) * this.zoom, (this.level.height * GameData.tile.height) * this.zoom);
};

/*
	method: move(moveObj)
	Moves the camera
	moveObj is an object containing the following values:
	x: (Number)
	y: (Number)
	relative: (Boolean)
*/
Camera.prototype.move = function(moveObj) {
	if(moveObj === undefined) {
		return false;
	}
	// Predetermine values
	if(moveObj.x === null) {
		moveObj.x = 0;
	}
	if(moveObj.y === null) {
		moveObj.y = 0;
	}
	if(moveObj.relative === null) {
		moveObj.relative = true;
	}

	// Move camera
	if(moveObj.relative) {
		this.baseCamera.x += (moveObj.x * this.zoom);
		this.baseCamera.y += (moveObj.y * this.zoom);
	}
	else {
		this.baseCamera.x = (moveObj.x * this.zoom);
		this.baseCamera.y = (moveObj.y * this.zoom);
	}
};