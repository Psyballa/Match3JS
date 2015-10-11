import device;
import ui.ImageView as ImageView;
import ui.View as View;

exports = Class(View, function() {
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build(args);
	}

	this.build = function build(args) {
		this._backgroundView = new ImageView({
			superview: this,
			image: 'resources/images/ui/background.png',
			x: 0,
			y: 0,
			width: args.sceneWidth,
			height: args.sceneHeight
		});
	}
})