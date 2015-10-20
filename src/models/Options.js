import device;
import ui.View as View;
import ui.TextView as TextView
import ui.widget.ButtonView as Button;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;
import src.models.AudioManager as AudioManager;

exports = Class(View, function(supr) {
	this._sounds = AudioManager.getSounds();
	// Arguably the most important variable in this game
	this._trackListing = [
		'Note Drop - Broke For Free',
		'Willbe - Cloverleaf',
		'Wild Things - YEYEY',
		'Tiptoe - YEYEY'
	];
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build();
	};
	this.build = function build() {
		var backgroundImage = new Image({url: 'resources/images/ui/background.png'});
		var backgroundView = new ImageView({
			x: this.style.x,
			y: this.style.y,
			width: this.style.width,
			height: this.style.height,
			image: backgroundImage
		});
		this.addSubview(backgroundView);
		this._buildLabels();
		this._buildButtons();
	};

	this._buildLabels = function _buildLabels() {
		this._muteMusicLabel = new TextView({
			x: 50,
			y: 200,
			width: 300,
			height: 75,
			autoSizeFont: false,
			size: 50,
			text: 'Mute Music',
			strokeColor: '#000000',
			color: '#FFFFFF',
			horizontalAlign: 'left'
		});

		this._muteAllLabel = new TextView({
			x: 50,
			y: 350,
			width: 300,
			height: 75,
			size: 50,
			autoSizeFont: false,
			text: 'Mute All',
			strokeColor: '#000000',
			color: '#FFFFFF',
			horizontalAlign: 'left'
		});

		this._currentSong = new TextView({
			superview: this,
			width: this.style.width,
			height: 100,
			x: 0,
			y: this.style.height - 300,
			text: 'CURRENT SONG:',
			size: 35,
			strokeWidth: 3,
			strokeColor: '#000000',
			color: '#FFFFFF',
			horizontalAlign: 'center',
			verticalAlign: 'center'
		});

		this._songText = new TextView({
			superview: this,
			width: this.style.width,
			height: 100,
			x: 0,
			y: this.style.height - 200,
			text: this._trackListing[GLOBAL.trackNum],
			size: 50,
			strokeColor: '#000000',
			color: '#FFFFFF',
			horizontalAlign: 'center',
			verticalAlign: 'center'
		});

		this.addSubview(this._muteMusicLabel);
		this.addSubview(this._muteAllLabel);
		this.addSubview(this._currentSong);
		this.addSubview(this._songText);
	};

	this._buildButtons = function _buildButtons() {
		this._muteMusicBtn = new Button({
			superview: this,
			width: 100,
			height: 100,
			x: 400,
			y: 200,
			toggleSelected: true,
			state: Button.states.UNSELECTED,
			images: {
				unselected: 'resources/images/ui/checkbox-unchecked.png',
				selected: 'resources/images/ui/checkbox-checked.png'
			},
			on: {
				selected: function() {
					this.emit('optionsscreen:mutemusic');
				}.bind(this),
				unselected: function() {
					this.emit('optionsscreen:playmusic');
				}.bind(this)
			}
		});

		this._muteAllBtn = new Button({
			superview: this,
			width: 100,
			height: 100,
			x: 400,
			y: 350,
			toggleSelected: true,
			state: Button.states.UNSELECTED,
			images: {
				unselected: 'resources/images/ui/checkbox-unchecked.png',
				selected: 'resources/images/ui/checkbox-checked.png'
			},
			on: {
				selected: function() {
					this.emit('optionsscreen:muteall');
				}.bind(this),
				unselected: function() {
					this.emit('optionsscreen:unmuteall');
				}.bind(this)
			}
		});

		this._exitBtn = new Button({
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
				up: function(){
					this.emit('optionsscreen:exit');
				}.bind(this)
			}
		});

		this.addSubview(this._muteMusicBtn);
		this.addSubview(this._muteAllBtn);
		this.addSubview(this._exitBtn);
	};

});