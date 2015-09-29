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
		},
		"totalWidth": {
			get() {
				return this.width * GameData.tile.width;
			}
		},
		"totalHeight": {
			get() {
				return this.height * GameData.tile.height;
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
	this.spawnRat(9, 9);
	this.spawnRat(15, 9);
};

/*
	method: spawnRat(x, y[, gender[, age]])
	Spawns a rat at the specified coordinates (in tile space)
*/
Level.prototype.spawnRat = function(x, y, gender, age) {
	var rat;

	gender = gender || Math.random() < 0.5 ? Rat.GENDER_MALE : Rat.GENDER_FEMALE;
	age = age || Rat.AGE_OF_CONSENT;

	rat = new Rat(game, (x * GameData.tile.width) + (GameData.tile.width * 0.5), (y * GameData.tile.height) + (GameData.tile.height * 0.5), gender, age);

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
 * Translates a tile index to in-world x, y coördinates.
 *
 * @param {number} idx - The tile index.
 * @param {bool} center - Make this true if you want the center coordinates.
 * @returns {object}
 */
Level.prototype.tileToCoords = function(idx, center) {
	var x, y;

	center = center || false;

	x = (idx % this.width) * GameData.tile.width;
	y = Math.floor(idx / this.width) * GameData.tile.height;

	return {x: x, y: y};
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
		case GameData.directions.NORTH:
			delta = -this.width;
			break;
		case GameData.directions.EAST:
			delta = 1;
			break;
		case GameData.directions.SOUTH:
			delta = this.width;
			break;
		case GameData.directions.WEST:
			delta = -1;
			break;
	}

	tile = tileIdx + delta;

	if (tile < 0 || tile > this.layers.tiles.children.length - 1) {
		return undefined;
	}
	else {
		return this.layers.tiles.children[tile];
	}
}
