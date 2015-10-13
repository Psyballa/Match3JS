import device;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View as View;
import ui.widget.ButtonView as Button;

import src.models.Board as Board;

var DEFAULT_TIMER = 60000;

exports = Class(View, function (supr) {
	this._timer = 0;
	this._score = 0;
	this._quitButton = null;
	this._backgroundView = null;
	this._board = null;
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build(args);
	};

	this.build = function build(args) {
		console.log(args);
		this._backgroundView = new ImageView({
			superview: this,
			image: 'resources/images/ui/background.png',
			x: 0,
			y: 0,
			canHandleEvents: true,
			width: args.sceneWidth,
			height: args.sceneHeight
		});

		this.on('gamescreen:start', function() {
			this._startGame(args);
		}.bind(this));
		this._buildQuitButton();
	};

	this._startGame = function _startGame(args) {
		this._createBoard(args);
		this._resetScore();
		this._resetTimers();
	}

	this._createBoard = function _createBoard(args) {
		this._board = new Board({
			boardWidth: args.boardWidth,
			boardHeight: args.boardHeight
		});
		this._board.style.x = ((args.sceneWidth) / 2) - (this._board.getGemSize() * (this._board.getBoardWidth() / 2));
		this._board.style.y = ((args.sceneHeight) / 2) - ((this._board.getGemSize() * (this._board.getBoardHeight() / 2)) - (args.sceneHeight/8));
		this.addSubview(this._board);
	}

	this._resetTimers = function _resetTimers() {
		this._timer = DEFAULT_TIMER;
	}

	this._resetScore = function _resetScore() {
		this._score = 0;
	}

	this._buildQuitButton = function _buildQuitButton() {
		this._quitButton = new Button({
			superview: this,
			width: 70,
			height: 70,
			x: 0,
			y: 0,
			images: {
				down: 'resources/images/ui/playBtn.png',
				up: 'resources/images/ui/playBtn.png'
			},
			on: {
				up: function() {
					console.log("Quitting game");
					this.emit('gamescreen:quit');
				}.bind(this)
			}
		});
		this.addSubview(this._quitButton);
	};
	this.tick = function tick() {

	};
});