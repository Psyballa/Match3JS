import device;
import ui.View as View;
import src.models.Gem as Gem;

var GRID_WIDTH = 8;
var GRID_HEIGHT = 8;
exports = Class(View, function (supr) {
	this._gems = [];
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build(args);
	}

	this._shuffleGems = function _shuffleGems(board) {
		// TODO: Implement this
	}

	this._getGemAtPosition = function _getGemAtPosition(position) {
		// TODO: Implement this
	}
})