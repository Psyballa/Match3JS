import device;
import ui.widget.ButtonView as Button;
import ui.View as View;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;

var BUTTON_TRAY_BUFFER = 10;
exports = Class(View, function (supr) {
	this._startGameBtn = null;
	this._optionsBtn = null;
	this._UIButtonSize = 105;
	this._backgroundImage = null;
	this._backgroundView = null;
	this._buttonCount = 0;
	this.init = function (args) {
		console.log("Showing title screen");
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
		this.addSubview(this._backgroundView);
		this.addSubview(this._buttonTray);
	};

	this._createButtons = function createButtons () {
		this._startGameBtn = this._createUIButton('play', 35);
		this._optionsBtn = this._createUIButton('options', 155);
		this._highScoreBtn = this._createUIButton('highScore', 305);
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
		})
	}

	this._createButtonTray = function _createButtonTray() {
		return new View({
			x: 0,
			y: this.style.height - this._UIButtonSize - BUTTON_TRAY_BUFFER,
			width: this.style.width,
			height: this._UIButtonSize
		})
	};
})