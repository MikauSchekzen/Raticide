var Tile = function(tileX, tileY, tileset, tilesetX, tilesetY) {
	Phaser.Sprite.call(this, game, tileX * GameData.tile.width, tileY * GameData.tile.height, tileset.key);
	game.add.existing(this);

	this.tileset = tileset;

	// Auto-crop
	this.crop(this.tileset.getTileCropping(tilesetX, tilesetY));
};
Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;