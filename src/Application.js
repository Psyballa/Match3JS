import device;
import ui.TextView as TextView;

import src.models.Board as Board;
import src.lib.Util as Utils;

var BOUNDS_WIDTH = 576;
exports = Class(GC.Application, function () {
	this.baseWidth = 0;
	this.baseHeight = 0;
	this.scale = 0;
	this.initUI = function () {
		this.scaleUI();
		// this.tvHelloWorld = new TextView({ 
		// 	superview: this.view,
		// 	text: 'Hello, world!',
		// 	color: 'white',
		// 	x: 0,
		// 	y: 100,
		// 	width: this.view.style.width,
		// 	height: 100
		// });
		GLOBAL.utils = new Utils(); // This is how you get a global class defined.
		// TODO: Move to game screen class.

		var board = new Board({
			boardWidth: 8,
			boardHeight: 8
		});
		board.style.x = ((this.baseWidth) / 2) - (board.getGemSize() * (board.getBoardWidth() / 2));
		board.style.y = ((this.baseHeight) / 2) - (board.getGemSize() * (board.getBoardHeight() / 2)); 
		this.addSubview(board);
	};

	this.scaleUI = function () {
		this.baseWidth = BOUNDS_WIDTH;
		this.baseHeight = device.height * (BOUNDS_WIDTH / device.width);
		this.scale = device.width / this.baseWidth;

		this.view.style.scale = this.scale;
	}
	this.launchUI = function () {

	};

});
