var GUI_Frame = function(x, y, width, height) {
	GUI_Base.call(this);

	// Load texture
	this.loadTexture("sprGUI_Frame");

	// Set position and size
	this.x = x;
	this.y = y;
	this.resize(width, height);
};
GUI_Frame.prototype = Object.create(GUI_Base.prototype);
GUI_Frame.prototype.constructor = GUI_Frame;
