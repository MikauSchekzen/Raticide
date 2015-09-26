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