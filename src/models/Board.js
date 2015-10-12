import device;
import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.models.Gem as Gem;

var SELECTED_GEM_MARGIN = 2; // Ensuring when a gem is selected, selection looks bigger.
exports = Class(View, function (supr) {
	this._gems = [];
	this._boardWidth = 0;
	this._boardHeight = 0;
	this._gemSize = 66;
	this._isSelecting = false;
	this._selectedGem = null;
	this._selectedView = null;
	this.init = function (args) {
		this._boardWidth = args.boardWidth;
		this._boardHeight = args.boardHeight;
		args = merge(
			args,
			{
				width: this._boardWidth * this._gemSize,
				height: this._boardHeight * this._gemSize
			}
		);

		supr(this, 'init', [args]);
		this._buildGemsArray();
		this.build();
	};


	this.build = function build() {
		var selectedImage = new Image({url: 'resources/images/ui/selected.png'});
		this._selectedView = new ImageView({
			superview: this,
			image: selectedImage,
			x: 0,
			y: 0,
			width: this._gemSize + SELECTED_GEM_MARGIN,
			height: this._gemSize + SELECTED_GEM_MARGIN,
			visible: false,
		});
	};

	this._buildGemsArray = function _buildGemsArray() {
		this._gems = [];
		for (var row = 0; row < this._boardHeight; ++row) {
			this._gems.push([]);
			for (var col = 0; col < this._boardWidth; ++col) {
				var forbiddenColorTypes = [];
				var gemPastHorizontalThreshold = ((col - 2) > -1);
				var gemPastVerticalThreshold = ((row - 2) > -1);

				if (gemPastHorizontalThreshold) { // Prevent going off left side of board
					if (this._gems[row][col-1].getColorType() === this._gems[row][col-2].getColorType()) {
						forbiddenColorTypes.push(this._gems[row][col-1].getColorType());
					}
				}

				if (gemPastVerticalThreshold) { // Prevent off going top of board
					if (this._gems[row-1][col].getColorType() === this._gems[row-2][col].getColorType()) {
						forbiddenColorTypes.push(this._gems[row-1][col].getColorType());
					}
				}
				var gem = this._createGem(col, row, forbiddenColorTypes);
				this._gems[row].push(gem);
				this.addSubview(gem);
			}
		}
	};

	this.onInputSelect = function onInputSelect(startEvent, startPoint) {
		var gemOnPoint = this._getGemForPoint(startPoint);
		var gemDiff = this._getDistanceBetweenTwoGems(this._selectedGem, gemOnPoint);
		if (gemOnPoint) {
			var gemDX, gemDY;
			if (gemDiff) {
				gemDX = gemDiff.x;
				gemDY = gemDiff.y;
			}
			console.log(gemDiff);
			if (!this._isSelecting || ((gemDX > 1) || (gemDY > 1))) {
				this._selectGem(gemOnPoint);
				this._isSelecting = true;
			} else {
				this._deselectGem();
				this._isSelecting = false;
			}
		}
	};

	this._selectGem = function _selectGem(gem) {
		if (this._selectedGem) {
			this._deselectGem();
		}
		this._selectedGem = gem;
		this._selectedView.style.x = (gem.getPosition().x * this._gemSize) - SELECTED_GEM_MARGIN;
		this._selectedView.style.y = (gem.getPosition().y * this._gemSize) - SELECTED_GEM_MARGIN;
		this._selectedView.style.visible = true;
	};

	this._deselectGem = function _deselectGem() {
		this._selectedView.style.visible = false;
		this._selectedGem = null;
	};

	this._createGem = function _createGem(col, row, forbiddenColorTypes) {
		return new Gem({
			position: {x: col, y: row},
			forbiddenColors: forbiddenColorTypes
		});
	};

	this._getGemForPoint = function _getGemForPoint(point) {
		var px = Math.floor(point.x / this._gemSize);
		var py = Math.floor(point.y / this._gemSize);

		return this._getGemAtPosition(px, py);
	};

	this._getDistanceBetweenTwoGems = function _getDistanceBetweenTwoGems(gemA, gemB) {
		if (!gemA || !gemB) {
			return null;
		}
		var gemAPos = gemA.getPosition();
		var gemBPos = gemB.getPosition();
		if (gemAPos && gemBPos) { 
			var dx = Math.abs(gemBPos.x - gemAPos.x);
			var dy = Math.abs(gemBPos.y - gemAPos.y);

			return {x: dx, y: dy};
		}
	}
	this._getGemAtPosition = function _getGemAtPosition(px, py) {
		return this._gems[py][px];
	};

	this.getGemSize = function getGemSize() {
		return this._gemSize;
	};

	this.getBoardWidth = function getBoardWidth() {
		return this._boardWidth;
	};

	this.getBoardHeight = function getBoardHeight() {
		return this._boardHeight;
	};
});
