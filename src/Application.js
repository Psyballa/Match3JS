import device;
import animate;
import ui.View as View;
import ui.TextView as TextView;
import ui.StackView as StackView;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;
import ui.resource.loader as Loader;


import src.models.TitleScreen as TitleScreen;
import src.models.GameScreen as GameScreen;
import src.models.Board as Board;
import src.models.Leaderboard as Leaderboard;
import src.models.AudioManager as AudioManager;
import src.models.Options as Options;
import src.models.About as About;
import src.lib.Util as Utils;


var BOUNDS_WIDTH = 576;
exports = Class(GC.Application, function () {
	'use strict';
	this.baseWidth = 0;
	this.baseHeight = 0;
	this.scale = 0;
	this._rootView = null;
	this._gameScreen = null;
	this._titleScreen = null;
	GLOBAL.highScores = [];
	GLOBAL.trackNum = 0;
	this._sounds = AudioManager.getSounds();
	this.initUI = function () {
		this.scaleUI();
		this.engine.updateOpts({
			alwaysRepaint: true,
			clearEachFrame: true,
			preload: ['resources/images', 'resources/audio']
		});
	};

	this._subscribeToEvents = function _subscribeToEvents() {
		this._titleScreen.on('titlescreen:play', function startGame() {
			this._transitionToView(this._gameScreen);
			this._gameScreen.emit("gamescreen:start");
		}.bind(this));

		this._titleScreen.on('titlescreen:options', function openOptions() {
			this._transitionToView(this._optionsScreen);
		}.bind(this));

		this._titleScreen.on('titlescreen:about', function openAbout() {
			this._transitionToView(this._aboutScreen);
		}.bind(this));

		this._gameScreen.on('gamescreen:quit', function quitToMenu() {
			this._transitionToView(this._titleScreen);
		}.bind(this));

		this._gameScreen.on('gamescreen:gameEnd', function addScoreToLeaderboard(score) {
			GLOBAL.highScores.push(score);
			GLOBAL.highScores.sort(function(a,b) { return b - a; });
			this._titleScreen.getLeaderboard().updateLeaderboardViews();
			this._transitionToView(this._titleScreen);
		}.bind(this));

		this._optionsScreen.on('optionsscreen:exit', function exitOptions(){
			this._transitionToView(this._titleScreen);
		}.bind(this));

		this._optionsScreen.on('optionsscreen:mutemusic', function muteMusic() {
			this._sounds.setMusicMuted(true);
		}.bind(this));

		this._optionsScreen.on('optionsscreen:playmusic', function playNewSong() {
			this._sounds.setMusicMuted(false);
		}.bind(this));

		this._optionsScreen.on('optionsscreen:muteall', function muteAllSounds() {
			this._sounds.setMusicMuted(true);
			this._sounds.setEffectsMuted(true);
		}.bind(this));

		this._optionsScreen.on('optionsscreen:unmuteall', function unmuteAllSounds() {
			this._sounds.setMusicMuted(false);
			this._sounds.setEffectsMuted(false);
		}.bind(this));

		this._aboutScreen.on('aboutscreen:exit', function exitAboutScreen() {
			this._transitionToView(this._titleScreen);
		}.bind(this));


	};
	this.scaleUI = function () {
		this.baseWidth = BOUNDS_WIDTH;
		this.baseHeight = device.height * (BOUNDS_WIDTH / device.width);
		this.scale = device.width / this.baseWidth;

		this.view.style.scale = this.scale;
	}
	this.launchUI = function () {
		this._createGameScene();
	};

	this._createGameScene = function _createGameScene() {
		GLOBAL.utils = new Utils(); // This is how you get a global class defined.
		GLOBAL.trackNum = GLOBAL.utils.getRandomInteger(0, 4);
		this._sounds.play('music' + GLOBAL.trackNum);
		
		
		// TODO: Move to game screen class.
		this._rootView = new View({
			x: 0,
			y: 0,
			opacity: 0,
			width: this.baseWidth,
			height: this.baseHeight
		});

		this._titleScreen = new TitleScreen({
			x: 0,
			y: 0,
			opacity: 0,
			tag: 'titleScreen',
			width: this.baseWidth,
			height: this.baseHeight
		});

		this._optionsScreen = new Options({
			x: 0,
			y: 0,
			opacity: 0,
			tag: 'optionsScreen',
			width: this.baseWidth,
			height: this.baseHeight
		});

		this._gameScreen = new GameScreen({
			boardWidth: 8,
			boardHeight: 8,
			canHandleEvents: true,
			blockEvents: false,
			opacity: 0,
			tag: 'gameScreen',
			width: this.baseWidth,
			height: this.baseHeight,
			sceneWidth: this.baseWidth,
			sceneHeight: this.baseHeight
		});

		this._aboutScreen = new About({
			x: 0,
			y: 0,
			opacity: 0,
			tag: 'aboutScreen',
			width: this.baseWidth,
			height: this.baseHeight
		});

		this._rootView = this._titleScreen;

		this.addSubview(this._rootView);

		animate(this._rootView).now({opacity: 1}, 2000, animate.easeOut);
		// this._rootView.push(this._titleScreen);
		
		this._subscribeToEvents();
	}

	this._transitionToView = function _transitionToView(srcView, transitionTime) {
		if (!transitionTime) {
			transitionTime = 100;
		}
		animate(srcView).now({opacity: 0}, transitionTime, animate.linear)
			.wait(transitionTime)
			.then(function() {
				this.removeSubview(this._rootView);
				this._rootView = srcView;
				this.addSubview(this._rootView);
				animate(this._rootView).now({opacity: 1}, transitionTime, animate.linear);
			}.bind(this));
	}
});
