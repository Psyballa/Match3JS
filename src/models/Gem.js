import device;
import animate;
import ui.View as View;
import ui.ImageView as ImageView;

// All gem sizes will be 66x66 for convenience sake.
exports = Class(View, function (supr) {
	this._position = null;
	this._size = 66;
	this._colorType = null;
	this._imageView = null;
	this._animator = null;
	this.init = function (args) {
		args = merge(
			args,
			{
				x: args.position.x * this._size,
				y: args.position.y * this._size,
				colorType: this._getPossibleColorType(args.forbiddenColors),
				width: this._size,
				height: this._size
			}
		);
		supr(this, 'init', [args]);
		this.build(args);
	};

	this.build = function build(args) {
		this._position = args.position;
		this._colorType = args.colorType;
		this._imageView = new ImageView({
			superview: this,
			image: 'resources/images/gems/gem_0' + args.colorType + '.png',
			x: 0,
			y: 0,
			width: this._size,
			height: this._size
		});
		this._animator = animate(this._imageView);
	};

	this.getPosition = function getPosition() {
		return this._position;
	};

	this.getColorType = function getColorType() {
		return this._colorType;
	};

	this._getPossibleColorType = function _getPossibleColorType(forbiddenColorTypes) {
		if (!forbiddenColorTypes) {
			return;
		}
		var knownColorTypes = [0, 1, 2, 3, 4];
		var acceptedTypes = knownColorTypes.filter(
			function (currentType) {
				return forbiddenColorTypes.indexOf(currentType) < 0;
			}
		);
		return GLOBAL.utils.getRandomElementFromArray(acceptedTypes);	
	};

	this.getSize = function getSize() {
		return this._size;
	};

	this.setPosition = function setPosition(pos) {
		this._position = pos;
	};

	this.animateFall = function animateFall(pos) {
		this._imageView.style.y = -pos;
		this._animator.now({y: 0}, 200, animate.linear);
	};
});