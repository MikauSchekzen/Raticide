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

Rat.prototype.isAdult = function() {
  return this.age >= Rat.AGE_OF_CONSENT;
}

Rat.GENDER_MALE = 0;
Rat.GENDER_FEMALE = 1;
Rat.AGE_OF_CONSENT = 1200;
