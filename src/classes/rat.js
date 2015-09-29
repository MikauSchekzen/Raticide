var Rat = function(game, x, y, gender, age) {

	// Inherit from Phaser.Sprite
	GameObject.call(this, game, x, y, "atlasRats");
	game.add.existing(this);
	game.physics.enable(this, Phaser.Physics.ARCADE);

	// Set base properties
	this.stats = {
		age: age,
		gender: gender,
		speed: 40,
		pregnant: false,
		fertile: true
	};

	this.paused = false;

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

Rat.prototype.pause = function(timeout) {
	this.paused = true;
	this.game.time.events.add(timeout, this.unpause.bind(this));
}

Rat.prototype.unpause = function() {
	this.paused = false;
}

/**
 * Runs the rat's logic.
 */
Rat.prototype.update = function() {
	var delta = game.time.physicsElapsed;

	if (!this.paused) {
		this.setDirection();
		this.setAnimation();
		this.move(delta);
	}
};

Rat.prototype.setAnimation = function() {
	switch (this.direction) {
		case GameData.directions.NORTH:
			this.playAnim("north");
			break;
		case GameData.directions.EAST:
			this.playAnim("east");
			break;
		case GameData.directions.SOUTH:
			this.playAnim("south");
			break;
		case GameData.directions.WEST:
			this.playAnim("west");
			break;
	}
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

/**
 * Decides what direction the rat will be moving in.
 */
Rat.prototype.setDirection = function() {
	var posIdx, choices;

	// If we already have a target, don't do stuff.
	if (this.targetPos) return;

	choices = [-2, -1, 1, 2];
	posIdx = this.level.coordsToTile(this.x, this.y);

	// This makes sure the rat doesn't turn 180 degrees.
	// This also means that if we make levels with dead ends, this must
	// be implemented in some other way.
	if (this.direction) {
		choices.splice(choices.indexOf(this.direction * -1), 1);
	}

	choices = choices.filter(function(direction) {
		var _tile = this.level.getRelativeTile(posIdx, direction);
		return _tile && _tile.type === GameData.tile.type.PATH;
	}, this);

	if (choices.length === 1) {
		this.direction = choices[0];
	}
	else {
		this.direction = choices[game.rnd.integerInRange(0, choices.length - 1)];
	}

	switch (this.direction) {
		case GameData.directions.NORTH:
			this.targetPos = {
				x: this.x,
				y: this.y - GameData.tile.height
			};
			break;
		case GameData.directions.EAST:
			this.targetPos = {
				x: this.x + GameData.tile.width,
				y: this.y
			};
			break;
		case GameData.directions.SOUTH:
			this.targetPos = {
				x: this.x,
				y: this.y + GameData.tile.height
			};
			break;
		case GameData.directions.WEST:
			this.targetPos = {
				x: this.x - GameData.tile.width,
				y: this.y
			};
			break;
	}
}

Rat.prototype.makeLove = function(otherRat) {
	if (this.stats.gender === Rat.GENDER_MALE &&        // This rat must be male.
			otherRat.stats.gender === Rat.GENDER_FEMALE &&	// The other rat must be female.
			!otherRat.stats.pregnant &&										  // The female mustn't be pregnant.
			otherRat.stats.fertile) {											  // The female must be fertile.
		this.pause(2000);
		otherRat.pause(2000);
		otherRat.stats.pregnant = true;
		this.game.time.events.add(Rat.GESTATION_PERIOD, otherRat.giveBirth.bind(otherRat));
	}
}

/**
 * Spawns a baby rat.
 *
 * @parameter {integer} gender - The gender for the baby (0 = male, 1 = female).
 */
Rat.prototype.giveBirth = function(gender) {
	// Default value for the baby's gender.
	if (!gender) gender = Math.random() > 0.5 ? "male" : "female";

	this.level.spawnRat(this.level.coordsToTile(this.x, this.y, gender, 0));
	this.stats.pregnant = false;
}

Rat.GENDER_MALE = 0;
Rat.GENDER_FEMALE = 1;
Rat.AGE_OF_CONSENT = 1200;
Rat.GESTATION_PERIOD = 5000;
