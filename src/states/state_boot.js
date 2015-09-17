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
		game.load.onFileComplete.add(function(progress, key, success, totalLoadedFiles, totalFiles) {
			game.state.start("game");
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