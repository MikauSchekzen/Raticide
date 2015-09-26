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