var Rat = function(game, x, y, gender, age) {
	// Inherit from Phaser.Sprite
	GameObject.call(this, game, x, y, "atlasRats");
	game.add.existing(this);

	// Set base properties
	this.stats = {
		age: age,
		gender: gender,
		speed: 40
	};

	this.direction = 'east';

	// Set sprite anchor
	this.anchor.set(0.5);

	Object.defineProperties(this, {
		"adult": {
			get() {
				return this.age >= Rat.AGE_OF_CONSENT;
			}
		},
		"pregnant": {
			get() {
				return this.stats.gender == Rat.GENDER_FEMALE && this.stats.pregnancy.pregnant;
			}
		},
		"level": {
			get() {
				return this.game.state.getCurrentState().level;
			}
		}
	});

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

Rat.prototype.update = function() {
	var delta = game.time.physicsElapsed;

	this.setDirection();
	this.setAnimation();
	this.move(delta);
};

Rat.prototype.setAnimation = function() {
	this.playAnim(this.direction);
}

/**
 * Moves the rat.
 * @param {number} delta - The time delta since the last update.
 */
Rat.prototype.move = function(delta) {
	if (this.targetPos.x > this.x) {
		this.x = Math.min(this.x + (delta * this.stats.speed), this.targetPos.x);
	}
	else if (this.targetPos.x < this.x) {
		this.x = Math.max(this.x - (delta * this.stats.speed), this.targetPos.x);
	}
	if (this.targetPos.y > this.y) {
		this.y = Math.min(this.y + (delta * this.stats.speed), this.targetPos.y);
	}
	else if (this.targetPos.y < this.y) {
		this.y = Math.max(this.y - (delta * this.stats.speed), this.targetPos.y);
	}

	// If the target is reached, unset it.
	if (this.x === this.targetPos.x && this.y === this.targetPos.y) this.targetPos = false;
}

Rat.prototype.setDirection = function() {
	var currentDirection, level, nextTile, posIdx, surroundingTiles, choices;

	// If we already have a target, don't do stuff.
	if (this.targetPos) return;

	choices = ["north", "east", "south", "west"];
	level = this.level;
	currentDirection = this.direction;
	posIdx = level.coordsToTile(this.x, this.y);

	choices.forEach(function(choice, idx) {
		var _tile = this.level.getRelativeTile(posIdx, choice);
		if (!_tile || _tile.type === GameData.tile.type.WALL) choices.splice(idx, 1);
	}.bind(this));

	this.direction = choices[game.rnd.integerInRange(0, choices.length - 1)];

	switch (this.direction) {
		case "north":
			this.targetPos = {
				x: this.x,
				y: this.y - GameData.tile.height
			};
			break;
		case "east":
			this.targetPos = {
				x: this.x + GameData.tile.width,
				y: this.y
			};
			break;
		case "south":
			this.targetPos = {
				x: this.x,
				y: this.y + GameData.tile.height
			};
			break;
		case "west":
			this.targetPos = {
				x: this.x - GameData.tile.width,
				y: this.y
			};
			break;
	}
}

Rat.GENDER_MALE = 0;
Rat.GENDER_FEMALE = 1;
Rat.AGE_OF_CONSENT = 1200;
