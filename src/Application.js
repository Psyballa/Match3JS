import device;
import ui.TextView as TextView;
import ui.StackView as StackView;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;

import src.models.Board as Board;
import src.models.GameScreen as GameScreen;
import src.lib.Util as Utils;
import src.models.TitleScreen as TitleScreen;

var BOUNDS_WIDTH = 576;
exports = Class(GC.Application, function () {
	this.baseWidth = 0;
	this.baseHeight = 0;
	this.scale = 0;
	this._rootView = null;
	this._gameScreen = null;
	this._titleScreen = null;
	this._highScores = [];
	this.initUI = function () {
		this.scaleUI();
		GLOBAL.utils = new Utils(); // This is how you get a global class defined.
		// TODO: Move to game screen class.
		this._rootView = new StackView({
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight
		});

		
		this._titleScreen = new TitleScreen({
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight
		});

		this.addSubview(this._rootView);
		this._rootView.push(this._titleScreen);
		
		this._gameScreen = new GameScreen({
			boardWidth: 8,
			boardHeight: 8,
			canHandleEvents: true,
			blockEvents: false,
			width: this.baseWidth,
			height: this.baseHeight,
			sceneWidth: this.baseWidth,
			sceneHeight: this.baseHeight
		});

		// this.addSubview(this._gameScreen);
		this._subscribeToEvents();
	};

	this._subscribeToEvents = function _subscribeToEvents() {
		this._titleScreen.on('titlescreen:play', function startGame() {
			this._rootView.push(this._gameScreen);
			this._gameScreen.emit("gamescreen:start");
		}.bind(this));

		this._gameScreen.on('gamescreen:quit', function quitToMenu() {
			console.log("I have quit");
			this._rootView.pop();
		}.bind(this));
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
