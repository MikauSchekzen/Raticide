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
	var index = this.getIndexFromPos(x, y);
	var tile = new Tile(x, y, tileset, tileID);
	this.addChild(tile);
	this.tiles.splice(index, 1, tile);
};