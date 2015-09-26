(function(Phaser) {
"use strict";

var GameData = {
	db: {
		tilesets: {
			data: [],
			resrefs: {}
		}
	},
	tile: {
		width: 24,
		height: 24,
		type: {
			PATH: 0,
			WALL: 1
		}
	},
	dir: {
		base: {
			tilesets: "assets/gfx/tilesets/"
		}
	}
};
var dbTileset = function(tilesetObj) {
	// Set raw data
	this.rawData = tilesetObj;

	// Define object properties
	Object.defineProperties(this, {
		"key": {
			get() {
				return this.rawData.name;
			}
		},
		"url": {
			get() {
				return GameData.dir.base.tilesets + this.rawData.image.match(/(\w+\.[\w]{3,5})$/)[1];
			}
		},
		"hTileCount": {
			get() {
				return ~~(this.rawData.imagewidth / (this.rawData.tilewidth + this.rawData.spacing));
			}
		},
		"vTileCount": {
			get() {
				return ~~(this.rawData.imageheight / (this.rawData.tileheight + this.rawData.spacing));
			}
		}
	});

	// Add to database
	this.resref = this.key;
	GameData.db.tilesets.data.push(this);
	GameData.db.tilesets.resrefs[this.resref] = this;
};
dbTileset.prototype.constructor = dbTileset;

/*
	method: loadFiles
	Adds this tileset's required files to the loader
*/
dbTileset.prototype.loadFiles = function() {
	if(this.rawData.image) {
		game.load.image(this.key, this.url);
	}
};

/*
	method: getTileCropping(tileX, tileY)
	Gets a rectangle for the tile's cropping
*/
dbTileset.prototype.getTileCropping = function(tileX, tileY) {
	var margin = this.rawData.margin,
	    spacing = this.rawData.spacing;
	var result = new Phaser.Rectangle(
		margin + (tileX * (this.rawData.tilewidth + spacing)),
		margin + (tileY * (this.rawData.tileheight + spacing)),
		this.rawData.tilewidth,
		this.rawData.tileheight
	);
	return result;
};
var Level = function(levelObj) {
	Phaser.Sprite.call(this, game, 0, 0);
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
Level.prototype = Object.create(Phaser.Sprite.prototype);
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
			this.addChild(layer);
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
	this.addChild(rat);
	this.gameObjects.rats.push(rat);
};
var TileLayer = function(rawData, level) {
	Phaser.Sprite.call(this, game, 0, 0);
	game.add.existing(this);

	this.rawData = rawData;
	this.map = level;
	this.tiles = [];
	while(this.tiles.length < this.map.width * this.map.height) {
		this.tiles.push(null);
	}
};
TileLayer.prototype = Object.create(Phaser.Sprite.prototype);
TileLayer.prototype.constructor = TileLayer;

/*
	method: placeTiles
	Places this layer's tiles
*/
TileLayer.prototype.placeTiles = function() {
	var a, b, gid, tid, ts, stopQuery, tempPos;
	for(a = 0;a < this.rawData.data.length;a++) {
		gid = this.rawData.data[a];
		stopQuery = false;
		for(b = 0;b < GameData.db.tilesets.data.length && !stopQuery;b++) {
			ts = GameData.db.tilesets.data[b];
			if(gid >= ts.rawData.firstgid && gid <= ts.rawData.firstgid + ts.rawData.tilecount) {
				tid = gid - ts.rawData.firstgid;
				stopQuery = true;
				tempPos = this.getPosFromIndex(a);
				this.placeTile(tempPos.x, tempPos.y, ts, tid);
			}
		}
	}
};

/*
	method: getPosFromIndex(index)
	Returns a tile position object(with x and y values) from an index
*/
TileLayer.prototype.getPosFromIndex = function(index) {
	return {
		x: (index % this.map.width),
		y: Math.floor(index / this.map.width)
	};
};

/*
	method: getIndexFromPos(x, y)
	Returns a tile index from coordinates
*/
TileLayer.prototype.getIndexFromPos = function(x, y) {
	return x + (y * this.map.width);
};

/*
	method: placeTile(x, y, tileset, tileID)
	Places a tile
*/
TileLayer.prototype.placeTile = function(x, y, tileset, tileID) {
	// Determine data
	var tilePos = {
		x: (tileID % tileset.hTileCount),
		y: Math.floor(tileID / tileset.hTileCount)
	};
	var index = this.getIndexFromPos(x, y);
	// Place tile
	var tile = new Tile(x, y, tileset, tilePos.x, tilePos.y);
	this.addChild(tile);
	this.tiles.splice(index, 1, tile);
	// Get tile properties
	var props;
	if(tileset.rawData.tileproperties && tileset.rawData.tileproperties[tileID]) {
		props = tileset.rawData.tileproperties[tileID];
		if(props.type) {
			tile.type = props.type;
		}
	}
};
var Tile = function(tileX, tileY, tileset, tilesetX, tilesetY) {
	Phaser.Sprite.call(this, game, tileX * GameData.tile.width, tileY * GameData.tile.height, tileset.key);
	game.add.existing(this);

	this.tileset = tileset;

	// Auto-crop
	this.crop(this.tileset.getTileCropping(tilesetX, tilesetY));

	// Set tile type
	this.type = GameData.tile.type.PATH;
};
Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;
var GameObject = function(game, x, y, imageKey) {
	// Inherit Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, imageKey);

	// Add self to game objects
	this.game.add.existing(this);

	// Set base properties
	this.game = game;
	Object.defineProperty(this, "state", {
		get() {
			return this.game.state.getCurrentState();
		}
	});
};

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

/*
	method: addAnim
	An override method for adding an animation to a game object
	Params: (key) A string containing the key to call the animation by
	        (frameList)
*/
GameObject.prototype.addAnim = function(key, frameList, frameRate, loop) {
	// Set default values for parameters
	if (typeof frameRate === "undefined") {
		frameRate = 60;
	}
	if (typeof loop === "undefined") {
		loop = true;
	}

	// Add animation
	this.animations.add(key, frameList, frameRate, false);
};

/*
	method: playAnim
	An override method for playing an animation for a game object
*/
GameObject.prototype.playAnim = function(key, frameRate) {
	// Set default values for parameters
	if(typeof frameRate === "undefined") {
		frameRate = 60;
	}

	// Play animation
	this.animations.play(key, frameRate);
};
var Rat = function(game, x, y, gender, age) {
	// Inherit from Phaser.Sprite
	GameObject.call(this, game, x, y, "atlasRats");

	// Set base properties
	this.stats = {
		age: age,
		gender: gender
	};

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

Rat.GENDER_MALE = 0;
Rat.GENDER_FEMALE = 1;
Rat.AGE_OF_CONSENT = 1200;

var bootState = {
	/*
	method: preload
	--------------------------------------------
	Loads in the main asset list
	*/
	preload: function() {
		game.load.json("assets_main", "assets/list_main.json");
	},

	/*
	method: create
	--------------------------------------------
	Will load all the main assets
	*/
	create: function() {
		// Initialize load event
		game.load.onFileComplete.add(function loadProgress(progress, key, success, totalLoadedFiles, totalFiles) {
			if(totalLoadedFiles >= totalFiles) {
				game.load.onFileComplete.remove(loadProgress, this);
				game.state.start("loadingscreen", true, false, "assets/levels/testlevel.json");
			}
		}, this);

		// Prepare list
		var list = game.cache.getJSON("assets_main"),
			a = 0,
			b = 0,
			assetList = null,
			curAsset = null,
			assetTypes = [
				"images",
				"atlases"
			];

		// Load images
		for (b = 0; b < assetTypes.length; b++) {
			assetList = list[assetTypes[b]];
			for (a = 0; a < assetList.length; a++) {
				curAsset = assetList[a];
				switch (assetTypes[b]) {
					case "images":
						game.load.image(curAsset.key, curAsset.url);
						break;
					case "atlases":
						game.load.atlasJSONArray(curAsset.key, curAsset.url, curAsset.cfg_url);
						break;
				}
			}
		}
		game.load.start();
	}
};
var loadingScreenState = new Phaser.State();

/*
	method: init(levelUrl)
	Sets basic data of this state
*/
loadingScreenState.init = function(levelUrl) {
	this.levelUrl = levelUrl;
};

/*
	method: create
	Starts loading the level
*/
loadingScreenState.create = function() {
	game.load.onFileComplete.add(function loadProgress(progress, fileKey, success, totalLoadedFiles, totalFiles) {
		if(totalLoadedFiles >= totalFiles) {
			game.load.onFileComplete.remove(loadProgress, this);
			this.loadAssets();
		}
	}, this);

	game.load.json("level", this.levelUrl);
	game.load.start();
};

/*
	method: loadAssets
	Loads the level's assets
*/
loadingScreenState.loadAssets = function() {
	// Create level
	var levelObj = game.cache.getJSON("level");
	var level = new Level(levelObj);
	level.loadLevelFiles();

	// Add file load callback
	game.load.onFileComplete.add(function loadProgress(progress, fileKey, success, totalLoadedFiles, totalFiles) {
		if(totalLoadedFiles >= totalFiles) {
			game.load.onFileComplete.remove(loadProgress, this);
			game.state.start("game", false, false, level);
		}
	}, this);
};
var gameState = new Phaser.State();

/*
	method: init(level)
	Initializes the level's data
*/
gameState.init = function(level) {
	this.level = level;
};

/*
	method: create
	Starts the level
*/
gameState.create = function() {
	// Initialize the level group (for zooming)
	this.level.initLevel();
	this.level.scale.set(2);
};
var game = new Phaser.Game(800, 600, Phaser.AUTO, "content", null, false, false);

game.state.add("boot", bootState);
game.state.add("game", gameState);
game.state.add("loadingscreen", loadingScreenState);

game.state.start("boot");
})(Phaser);