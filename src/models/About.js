import ui.View as View;
import ui.TextView as TextView;
import ui.widget.ButtonView as Button;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;

exports = Class(View, function (supr) {
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build();
	}

	this.build = function build() {
		this._backgroundImage = new Image({url: 'resources/images/ui/background.png'})
		this._backgroundView = new ImageView({
			superview: this,
			x: 0,
			y: 0,
			width: this.style.width,
			height: this.style.height,
			image: this._backgroundImage
		});



		this._directionsText = new TextView({
			superview: this,
			x: 0,
			y: 100,
			width: this.style.width,
			height: 100,
			text: 'HOW TO PLAY:',
			color: '#FFFFFF',
			size: 50,
			strokeColor: '#000000',
			horizontalAlign: 'center',
			verticalAlign: 'top'
		});

		this._rulesText = new TextView({
			superview: this,
			x: 0, 
			y: 200,
			width: this.style.width,
			height: 400,
			text: "1. CLICK GEM. \n 2. CLICK NEIGHBORING GEM (NO DIAGONALS!) \n 3. SCORE MAD POINTZ \n 4. STREAKS OF 5 OR MORE INCREASE MULTI",
			wrap: true,
			color: '#FFFFFF',
			size: 50,
			strokeColor: '#000000',
			strokeWidth: 3,
			horizontalAlign: 'center',
			verticalAlign: 'center'
		})

		this._CYAText = new TextView({
			superview: this,
			x: 0,
			y: 0,
			width: this.style.width,
			height: this.style.height,
			wrap: true,
			text: 'All audio and art either created by Justin Telmo or taken from open source websites. Made by Justin Telmo in under a week using GameClosure.',
			color: '#FFFFFF',
			size: 25,
			strokeColor: '#000000',
			strokeWidth: 3,
			horizontalAlign: 'center',
			verticalAlign: 'bottom'
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
					this.emit('aboutscreen:exit');
				}.bind(this)
			}
		});
		this.addSubview(this._backgroundView);
		this.addSubview(this._directionsText);
		this.addSubview(this._CYAText);
		this.addSubview(this._exitBtn);
	};
});