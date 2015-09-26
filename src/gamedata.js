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
	},
	// Directions as integers. By using 1, 2, -1, and -2 we can 'calculate'
	// oppossite directions (e.g. NORTH * -1 === 1 === SOUTH).
	directions: {
		NORTH: 1,
		EAST: 2,
		SOUTH: -1,
		WEST: -2
	},
	camera: {
		keyboardSpeedMod: 10
	}
};
