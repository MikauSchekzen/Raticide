var GUI_Frame = function(x, y, width, height) {
	GUI_Base.call(this);

	// Add frame
	this.resize(width, height);
	this.add(new NinePatch("sprGUI_Frame", {
			origin: [64, 0],
			corner: [12, 12],
			horizontal: 40,
			vertical: 40,
			customCanvas: {
				origin: [0, 0],
				size: [64, 64],
				offset: 3
			}
		}, width, height, this));

	// Set position and size
	this.x = x;
	this.y = y;
};
GUI_Frame.prototype = Object.create(GUI_Base.prototype);
GUI_Frame.prototype.constructor = GUI_Frame;
