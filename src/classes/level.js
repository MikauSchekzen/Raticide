var Level = function(levelObj) {
	Phaser.Group.call(this, game);
	game.add.existing(this);

	this.rawData = levelObj;

	// Set up layer data
	this.layers = {
		tiles: null,
		overlay: null
	};

	// Define properties
	Object.defineProperties(this, {
		"width": {
			get() {
				return this.rawData.width;
			}
		},
		"height": {
			get() {
				return this.rawData.height;
			}
		}
	})

	// Set up game object groups
	this.gameObjects = {
		rats: []
	};
};
Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

/*
	method: loadLevelFiles
	Loads all the required level files (tilesets and audio, mostly)
*/
Level.prototype.loadLevelFiles = function() {
	var a, ts, tsObj;
	// Get data from tilesets
	for(a = 0;a < this.rawData.tilesets.length;a++) {
		tsObj = this.rawData.tilesets[a];
		if(tsObj.image) {
			ts = new dbTileset(tsObj);
			ts.loadFiles();
		}
	}
};

/*
	method: initLevel
	Creates this level's layers etc
*/
Level.prototype.initLevel = function() {
	var a, layer;
	// Create layers
	for(a = 0;a < this.rawData.layers.length;a++) {
		layer = this.rawData.layers[a];
		if(layer.type === "tilelayer") {
			switch(layer.name) {
				case "tiles":
					this.layers.tiles = new TileLayer(layer, this);
					break;
				case "overlay":
					this.layers.overlay = new TileLayer(layer, this);
					break;
			}
		}
	}

	// Initialize layers
	for(a in this.layers) {
		layer = this.layers[a];
		if(layer) {
			this.add(layer);
			layer.placeTiles();
		}
	}

	// TEST -- REMOVE LATER
	this.spawnRat(5, 5);
	this.spawnRat(7, 5);
	this.spawnRat(5, 6);
};

/*
	method: spawnRat(x, y[, gender[, age]])
	Spawns a rat at the specified coordinates (in tile space)
*/
Level.prototype.spawnRat = function(x, y, gender, age) {
	if(gender === undefined) {
		gender = Rat.GENDER_FEMALE;
		if(Math.random() < 0.5) {
			gender = Rat.GENDER_MALE;
		}
	}
	if(age === undefined) {
		age = Rat.AGE_OF_CONSENT;
	}

	var rat = new Rat(game, (x * GameData.tile.width) + (GameData.tile.width * 0.5), (y * GameData.tile.height) + (GameData.tile.height * 0.5), gender, age);
	this.add(rat);
	this.gameObjects.rats.push(rat);
};

/**
 * Translates in-world x, y coördinates to a tile index.
 *
 * @param {number} x - The x position.
 * @param {number} y - The y position.
 * @returns {number} - The index of the Tile containing the x, y coördinate.
 */
Level.prototype.coordsToTile = function(x, y) {
	var width, tileSize, tileX, tileY;

	width = this.width;
	tileSize = GameData.tile.width;
	tileX = Math.floor(x / tileSize);
	tileY = Math.floor(y / tileSize);

	return tileX + (tileY * width);
}

/**
 * Returns a tile relative to the tile at tileIdx. Which tile is returned
 * depends on the direction passed in.
 *
 * @param {string} direction: either "north", "east", "south", or "west".
 * @returns {Tile}
 */
Level.prototype.getRelativeTile = function(tileIdx, direction) {
	var delta, tile;

	switch (direction) {
		case "north" || "n":
			delta = -this.width;
			break;
		case "east" || "e":
			delta = 1;
			break;
		case "south" || "s":
			delta = this.width;
			break;
		case "west" || "w":
			delta = -1;
			break;
	}

	tile = tileIdx + delta;

	try {
		return this.layers.tiles[tile];
	}
	catch(e) {
		return undefined;
	}
}
