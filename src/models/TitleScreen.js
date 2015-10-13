import device;
import ui.widget.ButtonView as Button;
import ui.View as View;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;


import src.models.Leaderboard as Leaderboard;

var BUTTON_TRAY_BUFFER = 10;
exports = Class(View, function (supr) {
	this._startGameBtn = null;
	this._optionsBtn = null;
	this._UIButtonSize = 105;
	this._backgroundImage = null;
	this._backgroundView = null;
	this._buttonCount = 0;
	this._leaderboardView = null;
	this._titleImage = null;
	this._titleView = null;
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build();
	};

	this.build = function build(){
		this._buttonTray = this._createButtonTray();
		this._createButtons();
		this._backgroundImage = new Image({url: 'resources/images/ui/background.png'});
		this._backgroundView = new ImageView({
			superview: this,
			image: this._backgroundImage,
			x: 0,
			y: 0,
			width: this.style.width,
			height: this.style.height
		});
		this._titleImage = new Image({url: 'resources/images/ui/title.png'});
		this._titleView = new ImageView({
			superview: this,
			image:this._titleImage,
			x: this.style.width / 2 - 110,
			y: 15,
			width: 220,
			height: 30,
		});
		this._leaderboardView = new Leaderboard({
			x: 0, 
			y: 0,
			width: this.style.width,
			height: this.style.height
		});
		this.addSubview(this._backgroundView);
		this.addSubview(this._leaderboardView);
		this.addSubview(this._titleView);
		this.addSubview(this._buttonTray);
	};

	this._createButtons = function createButtons () {
		this._startGameBtn = this._createUIButton('play', 35);
		this._optionsBtn = this._createUIButton('options', 225);
		this._aboutBtn = this._createUIButton('about', 425);
	};

	this._createUIButton = function _createUIButton(buttonName, btnX) {
		this._buttonCount++;
		return new Button({
			superview: this._buttonTray,
			width: this._UIButtonSize,
			height: this._UIButtonSize,
			x: btnX,
			y: 0,
			images: {
				down: 'resources/images/ui/' + buttonName + 'Btn.png',
				up: 'resources/images/ui/' + buttonName + 'Btn.png'
			},
			on: {
				up: function() {
					this.emit('titlescreen:' + buttonName);
				}.bind(this)
			}
		});
	};

	this._createButtonTray = function _createButtonTray() {
		return new View({
			x: 0,
			y: this.style.height - this._UIButtonSize - BUTTON_TRAY_BUFFER,
			width: this.style.width,
			height: this._UIButtonSize
		});
	};

	this.getLeaderboard = function getLeaderboard() {
		return this._leaderboardView;
	};
});