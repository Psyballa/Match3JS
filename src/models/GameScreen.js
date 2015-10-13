import device;
import animate;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.TextView as TextView;
import ui.View as View;
import ui.widget.ButtonView as Button;

import src.models.Board as Board;
import src.models.AudioManager as AudioManager;

var DEFAULT_TIMER = 60;

exports = Class(View, function (supr) {
	this._currentTime = DEFAULT_TIMER;
	this._timer = null;
	this._timerLabel = null;
	this._timerImage = null;
	this._timerView = null;
	this._score = 0;
	this._scoreLabel = null;
	this._scoreImage = null;
	this._scoreView = null;
	this._multiplier = 1;
	this._multiplierLabel = null;
	this._multiplierImage = null;
	this._multiplierView = null;
	this._quitButton = null;
	this._backgroundView = null;
	this._board = null;
	this._sounds = AudioManager.getSounds();
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build(args);
	};

	this.build = function build(args) {
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



		this._buildUIImageViews();
		this._buildQuitButton();
		this._buildTimer();
		this._buildScoreLabel();
		this._buildMultiplierLabel();
	};

	this._buildUIImageViews = function _buildUIImageViews() {
		this._scoreboardImage = new Image({url: 'resources/images/ui/scoreboard.png'});
		this._scoreboardView = new ImageView({
			superview: this,
			image: this._scoreboardImage,
			width: 380,
			height: 110,
			x: (this.style.width / 2) - 190,
			y: 0 
		});

		this._timerImage = new Image({url: 'resources/images/ui/timer.png'});
		this._timerView = new ImageView({
			superview: this,
			image: this._timerImage,
			width: 150,
			height: 110,
			x: 0,
			y: this._scoreboardView.style.height + 40
		})

		this._multiplierImage = new Image({url: 'resources/images/ui/multiplier.png'});
		this._multiplierView = new ImageView({
			superview: this,
			image: this._multiplierImage,
			width: 150,
			height: 110,
			x: this.style.width - 150,
			y: this._timerView.style.y
		});
		this.addSubview(this._scoreboardView);
		this.addSubview(this._timerView);
		this.addSubview(this._multiplierView);
	}

	this._startGame = function _startGame(args) {
		if (this._board) {
			this._board.removeAllSubviews();
		}
		
		this.setHandleEvents(true, false);
		this._createBoard(args);
		this._resetScore();
		this._resetTimers();
		this._resetMultiplier();
		this._board.on('board:scoregems', function scoreGems (gemScore) {
			this._score += (gemScore * this._multiplier);
			this._scoreLabel.setText(this._score);
		}.bind(this));
		this._board.on('board:incrementMultiplier', function incrementMultiplier() {
			this._multiplier++;
			this._multiplierLabel.setText(this._multiplier + 'x');
		}.bind(this));
	};

	this._createBoard = function _createBoard(args) {
		this._board = new Board({
			boardWidth: args.boardWidth,
			boardHeight: args.boardHeight
		});
		this._board.style.x = ((args.sceneWidth) / 2) - (this._board.getGemSize() * (this._board.getBoardWidth() / 2));
		this._board.style.y = ((args.sceneHeight) / 2) - ((this._board.getGemSize() * (this._board.getBoardHeight() / 2)) - (args.sceneHeight/8));
		this.addSubview(this._board);
	};

	this._buildTimer = function _buildTimer() {
		this._timerLabel = new TextView({
			width: 150,
			height: 110,
			text: this._currentTime,
			size: 72,
			strokeColor: '#000000',
			color: '#FFFFFF',
			autoFontSize: true,
			horizontalAlign: 'center'
		});

		this._timerLabel.style.y = (this._timerView.style.height / 2) - (this._timerLabel.style.height / 2) + 10;
		this._timerLabel.style.x = (this._timerView.style.width / 2) - (this._timerLabel.style.width / 2);
		this._timerView.addSubview(this._timerLabel);
	};

	this._buildScoreLabel = function _buildScoreLabel() {
		this._scoreLabel = new TextView({
			width: this.style.width / 3,
			height: 72,
			text: this._score,
			size: 72,
			autoFontSize: true,
			strokeColor: '#000000',
			color: '#FFFFFF',
			horizontalAlign: 'center'
		});
		this._scoreLabel.style.y = (this._scoreboardView.style.height / 2) - (this._scoreLabel.style.height / 2) - 10;
		this._scoreLabel.style.x = (this._scoreboardView.style.width / 2) - (this._scoreLabel.style.width / 2); 
		this._scoreboardView.addSubview(this._scoreLabel);
	}

	this._buildMultiplierLabel = function _buildMultiplierLabel() {
		this._multiplierLabel = new TextView({
			width: this._multiplierView.style.width,
			height: this._multiplierView.style.height - 20,
			x: (this._multiplierView.style.width / 2) - (this._multiplierView.style.width / 2) - 20,
			y: (this._multiplierView.style.height / 2) - (this._multiplierView.style.height / 2) + 20,
			text: this._multiplier + 'x',
			autoFontSize: true,
			strokeColor: '#000000',
			color: '#FFFFFF',
			horizontalAlign: 'center'
		})
		this._multiplierView.addSubview(this._multiplierLabel);
	}
	this._resetTimers = function _resetTimers() {
		this._currentTime = DEFAULT_TIMER;
		this._timerLabel.setText(':' + DEFAULT_TIMER);
		this._timerLabel.updateOpts({color: "#FFFFFF"});
		this._timer = setInterval(
			function() {
				this._startTimer();				
			}.bind(this), 1000
		);
	};

	this._startTimer = function _startTimer() {
		this._currentTime--;
		if (this._currentTime > -1) {
			this._timerLabel.setText(':' + this._currentTime);
			if (this._currentTime === 10) {
				this._sounds.play('timerWarning');
			}
			if (this._currentTime < 10 && this._currentTime > 0) {
				animate(this._timerLabel).now({width: 0, height: 110}, 500, animate.easeIn)
				.then({width: 150, height: 110}, 500, animate.easeOut);
				this._timerLabel.updateOpts({color: "#FF0000"});
				if (this._currentTime < 5) {
					this._sounds.play('warningKlaxon');
				}
			}
		} else {
			if (!this._board.areGemsChaining()) {
				this._endGame();
			}
		}
	}

	this._resetMultiplier = function _resetMultiplier() {
		this._multiplier = 1;
		this._multiplierLabel.setText('1x');	
	}

	this._endGame = function _endGame() {
		clearInterval(this._timer);
		this.setHandleEvents(false, true);
		this._sounds.play('gameOver');
		setTimeout(function popBackToMenu() {
			this.emit('gamescreen:gameEnd', this._score);
		}.bind(this), 1500)
	};

	this._resetScore = function _resetScore() {
		this._score = 0;
		this._scoreLabel.setText('0');
	};

	this._buildQuitButton = function _buildQuitButton() {
		this._quitButton = new Button({
			superview: this,
			width: 100,
			height: 100,
			x: 0,
			y: 0,
			images: {
				down: 'resources/images/ui/exit.png',
				up: 'resources/images/ui/exit.png'
			},
			on: {
				up: function() {
					clearInterval(this._timer);
					this.emit('gamescreen:quit');
				}.bind(this)
			}
		});
		this.addSubview(this._quitButton);
	};
});