var NinePatch = function(key, patch, width, height, parent) {
	// Initialize
	Phaser.Image.call(this, game, 0, 0);
	
	this.textureKey = key;
	this.desiredSize = {
		width: width,
		height: height
	};
	this.patchData = patch;
	this.applyNinePatch(this.patchData);
};
NinePatch.prototype = Object.create(Phaser.Image.prototype);
NinePatch.prototype.constructor = NinePatch;

/*
	method: applyNinePatch(patchData)
	Refreshes the nine patch
*/
NinePatch.prototype.applyNinePatch = function(patchData) {
	// Clean
	if(this.texture) {
		this.texture.destroy();
	}

	var sprArr = [];
	while(sprArr.length < 3) {
		sprArr.push([]);
	}
	var bmd = new Phaser.BitmapData(game, "tempBmd", this.desiredSize.width, this.desiredSize.height);

	// Apply nine patch properties
	patchData.totalSize = {
		width: (patchData.corner[0] * 2) + patchData.horizontal,
		height: (patchData.corner[1] * 2) + patchData.vertical
	};

	var a, b, img, doDraw;
	// Draw custom canvas
	if(patchData.customCanvas) {
		img = game.make.image(patchData.customCanvas.offset, patchData.customCanvas.offset, this.textureKey);
		img.crop(new Phaser.Rectangle(
			patchData.customCanvas.origin[0],
			patchData.customCanvas.origin[1],
			patchData.customCanvas.size[0],
			patchData.customCanvas.size[1]
		));
		img.width = this.desiredSize.width - (patchData.customCanvas.offset * 2);
		img.height = this.desiredSize.height - (patchData.customCanvas.offset * 2);
		bmd.draw(img);
		img.destroy();
	}

	// Create nine patch
	for(a = 0;a < 3;a++) {
		for(b = 0;b < 3;b++) {
			img = game.make.image(0, 0, this.textureKey);
			doDraw = true;
			// Get top-left corner
			if(a === 0 && b === 0) {
				img.crop(new Phaser.Rectangle(patchData.origin[0] + 0, patchData.origin[1] + 0, patchData.corner[0], patchData.corner[1]));
			}
			// Get top-right corner
			else if(a === 2 && b === 0) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + patchData.totalSize.width - patchData.corner[0],
					patchData.origin[1] + 0,
					patchData.corner[0],
					patchData.corner[1]
				));
				img.x = this.desiredSize.width - patchData.corner[0];
			}
			// Get bottom-left corner
			else if(a === 0 && b === 2) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + 0,
					patchData.origin[1] + patchData.totalSize.height - patchData.corner[1],
					patchData.corner[0],
					patchData.corner[1]
				));
				img.y = this.desiredSize.height - patchData.corner[1];
			}
			// Get bottom-right corner
			else if(a === 2 && b === 2) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + (patchData.totalSize.width - patchData.corner[0]),
					patchData.origin[1] + (patchData.totalSize.height - patchData.corner[1]),
					patchData.corner[0],
					patchData.corner[1]
				));
				img.x = this.desiredSize.width - patchData.corner[0];
				img.y = this.desiredSize.height - patchData.corner[1];
			}
			// Get top
			else if(a === 1 && b === 0) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + patchData.corner[0],
					patchData.origin[1] + 0,
					patchData.horizontal,
					patchData.corner[1]
				));
				img.width = this.desiredSize.width - (patchData.corner[0] * 2);
				img.x = patchData.corner[0];
			}
			// Get bottom
			else if(a === 1 && b === 2) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + patchData.corner[0],
					patchData.origin[1] + patchData.corner[1] + patchData.vertical,
					patchData.horizontal,
					patchData.corner[1]
				));
				img.width = this.desiredSize.width - (patchData.corner[0] * 2);
				img.x = patchData.corner[0];
				img.y = this.desiredSize.height - patchData.corner[1];
			}
			// Get left
			else if(a === 0 && b === 1) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + 0,
					patchData.origin[1] + patchData.corner[1],
					patchData.corner[0],
					patchData.vertical
				));
				img.height = this.desiredSize.height - (patchData.corner[1] * 2);
				img.y = patchData.corner[1];
			}
			// Get right
			else if(a === 2 && b === 1) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + patchData.corner[0] + patchData.horizontal,
					patchData.origin[1] + patchData.corner[1],
					patchData.corner[0],
					patchData.vertical
				));
				img.height = this.desiredSize.height - (patchData.corner[1] * 2);
				img.x = this.desiredSize.width - patchData.corner[0];
				img.y = patchData.corner[1];
			}
			// Get canvas
			else if(a === 1 && b === 1 && !patchData.noCanvas && !patchData.customCanvas) {
				img.crop(new Phaser.Rectangle(
					patchData.origin[0] + patchData.corner[0],
					patchData.origin[1] + patchData.corner[1],
					patchData.horizontal,
					patchData.vertical
				));
				img.width = this.desiredSize.width - (patchData.corner[0] * 2);
				img.height = this.desiredSize.height - (patchData.corner[1] * 2);
				img.x = patchData.corner[0];
				img.y = patchData.corner[1];
			}
			else {
				doDraw = false;
			}
			if(doDraw) {
				bmd.draw(img);
			}
			img.destroy();
		}
	}

	// Generate texture
	this.setTexture(bmd.generateTexture());
	game.cache.removeBitmapData("tempBmd");
	bmd.destroy();
};


/*
 * Reference: the 'patch' object
 * 
 * {
 * 	origin: [x(number), y(number)],
 * 	corner: [width(number), height(number)],
 * 	horizontal: number,
 * 	vertical: number,
 * 	noCanvas: boolean,
 * 	customCanvas: {
 *		origin: [x(number), y(number)],
 *		size: [width(number), height(number)],
 *		offset: [x(number), y(number)]
 * 	}
 * }
*/
