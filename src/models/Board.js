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
	this._possibleSwaps = [];
	this._selectedView = null;
	this._chains = [];
	this._possibleSwaps = [];
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
				var gem = this._createGem(row, col, forbiddenColorTypes);
				this._gems[row].push(gem);
				this.addSubview(gem);
			}
		}
	};

	this._createGem = function _createGem(row, col, forbiddenColorTypes) {
		return new Gem({
			position: {x: col, y: row},
			forbiddenColors: forbiddenColorTypes
		});
	};

	this._selectGem = function _selectGem(gem) {
		this._selectedGem = gem;
		this._selectedView.style.x = (gem.getPosition().x * this._gemSize) - SELECTED_GEM_MARGIN;
		this._selectedView.style.y = (gem.getPosition().y * this._gemSize) - SELECTED_GEM_MARGIN;
		this._selectedView.style.visible = true;
	};

	this._deselectGem = function _deselectGem() {
		this._selectedView.style.visible = false;
		this._selectedGem = null;
	};

	this.onInputSelect = function onInputSelect(startEvent, startPoint) {
		var gemOnPoint = this._getGemForPoint(startPoint);
		if (gemOnPoint) {
			if (!this._isSelecting) {
				this._selectGem(gemOnPoint);
				this._isSelecting = true;
			} else {
				var destGem = gemOnPoint;
				// If same color or not neighbors, don't swap.
				if (this._checkIfGemsAreNeighbors(this._selectedGem, destGem) && this._selectedGem.getColorType() !== destGem.getColorType()) {
					this._trySwap(this._selectedGem, destGem);
				}
				this._deselectGem();
				this._isSelecting = false;
				
			}
		}
	};

	this._calculatePossibleSwaps = function _calculatePossibleSwaps() {
		for (var row = 0; row < this._boardHeight; row++) {
			for (var column = 0; column < this._boardWidth; column++) {
				if (column < this._boardWidth - 1) {
					var gemChecked = this._gems[row][column];
					var gemToRight = this._gems[row][column+1];
					if (this._checkIfSwapResultsInMatch(gemChecked, gemToRight)) {
						this._possibleSwaps.push([gemChecked, gemToRight]);
					}
				}
			}
		}
	}

	this._trySwap = function _trySwap(srcGem, destGem) {
		this._swapGems(srcGem, destGem);
		var matches = [];
		console.log("*** getting matches from srcgem");
		matches = matches.concat(this._checkForMatches(srcGem));
		console.log("*** getting matches from destgem");
		matches = matches.concat(this._checkForMatches(destGem));
		if (matches.length < 1) {
			console.log("*** no swaps found, swapping back");
			this._swapGems(srcGem, destGem);
		} else {
			console.log("Found a match!");
			console.log("Deleting all gems in matches...");
			this._chains.push(matches);
			this._deleteGems(matches);
		}
	};

	this._checkIfSwapResultsInMatch = function _checkIfSwapResultsInMatch(srcGem, destGem) {
		this._swapGems(srcGem, destGem);

		var matches = [];
		matches = matches.concat(this._checkForMatches(srcGem));
		matches = matches.concat(this._checkForMatches(destGem));

		this._swapGems(srcGem, destGem);

		return (matches.length > 1);
	};

	this._swapGems = function _swapGems(srcGem, destGem) {
		this._gems[srcGem.getPosition().y][srcGem.getPosition().x] = destGem;
		this._gems[srcGem.getPosition().y][srcGem.getPosition().x].setPosition(destGem.getPosition());
		this._gems[destGem.getPosition().y][destGem.getPosition().x] = srcGem;
		this._gems[destGem.getPosition().y][destGem.getPosition().x].setPosition(srcGem.getPosition());

		var tempX = srcGem.style.x;
		var tempY = srcGem.style.y;
		var tempPos = srcGem.getPosition();
		srcGem.style.y = destGem.style.y;
		srcGem.style.x = destGem.style.x;
		srcGem.setPosition(destGem.getPosition());
		destGem.style.y = tempY;
		destGem.style.x = tempX;
		destGem.setPosition(tempPos);
	};

	this._deleteGems = function _deleteGems(gems) {
		gems.forEach(function (gem) {
			// this.scoreGem(gem.getColorType());
			this.removeSubview(gem);
		}.bind(this));
	};

	this._checkForMatches = function _checkForMatches(gem) {
		var matches = [];

		matches = matches.concat(this._checkVerticalMatches(gem));
		matches = matches.concat(this._checkHorizontalMatches(gem));

		matches = matches.filter(function (elem, index, self) {
			return index == self.indexOf(elem);
		});
		console.log("*** matches are: ");
		console.log(matches);
		return matches;
	};

	this._checkVerticalMatches = function _checkVerticalMatches(gem) {
		var gemPosY = gem.getPosition().y;
		var matchGems = [];
		for (var rowAbove = gemPosY - 1; rowAbove >= 0; rowAbove--) {
			if (this._gems[rowAbove] && this._gems[rowAbove][gem.getPosition().x].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[rowAbove][gem.getPosition().x]);
			} else {
				break;
			}
		}

		for (var rowBelow = gemPosY + 1; rowBelow < this._boardHeight; rowBelow++) {
			if (this._gems[rowBelow] && this._gems[rowBelow][gem.getPosition().x].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[rowBelow][gem.getPosition().x]);
			} else {
				break;
			}
		}

		if (matchGems.length < 2) {
			matchGems = [];
		} else {
			matchGems.push(gem);
		}

		return matchGems;
	};

	this._checkHorizontalMatches = function _checkHorizontalMatches(gem) {
		// Traverse left until no match or edge of board
		var gemPosX = gem.getPosition().x;
		var matchGems = [];
		for (var colLeft = gemPosX - 1; colLeft >= 0; colLeft--) {
			if (this._gems[gem.getPosition().y][colLeft].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[gem.getPosition().y][colLeft]);
			} else {
				break;
			}
		}

		for (var colRight = gemPosX + 1; colRight < this._boardWidth; colRight++) {
			if (this._gems[gem.getPosition().y][colRight].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[gem.getPosition().y][colRight]);
			} else {
				break;
			}
		}
		if (matchGems.length < 2) {
			//If we have one or no matches, pretty much have no matches.
			matchGems = [];
		} else {
			matchGems.push(gem);
		}
		return matchGems;
	};


	this._checkForMatchesToLeft = function _checkForMatchesToLeft (gem) {
		var matchGems = [];
		for (var column = gem.getPosition().x - 1; column >= 0; column--) {
			if (this._gems[gem.getPosition().y][column].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[gem.getPosition().y][column]);
			} else {
				break;
			}
		}
		console.log("*** matches to left: ");
		console.log(matchGems);
		return matchGems;
	};

	this._checkForMatchesToRight = function _checkForMatchesToRight(gem) {
		var matchGems = [];
		for (var column = gem.getPosition().x + 1; column < this._boardWidth; column++) {
			if (this._gems[gem.getPosition().y][column].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[gem.getPosition().y][column]);
			} else {
				break;
			}
		}

		console.log("*** matches to right");
		console.log(matchGems);
		return matchGems;
	};

	this._checkForMatchesAbove = function _checkForMatchesAbove(gem) {
		var matchGems = [];
		for(var row = gem.getPosition().y - 1; row >= 0; row--) {
			if (this._gems[row] && this._gems[row][gem.getPosition().x].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[row][gem.getPosition().x]);
			} else {
				break;
			}
		}
		console.log("*** matches above");
		console.log(matchGems);
		return matchGems;
	};

	this._checkForMatchesBelow = function _checkForMatchesBelow(gem) {
		var matchGems = [];
		for (var row = gem.getPosition().y + 1; row < this._boardHeight; row++) {
			if (this._gems[row] && this._gems[row][gem.getPosition().x].getColorType() === gem.getColorType()) {
				matchGems.push(this._gems[row][gem.getPosition().x]);
			} else {
				break;
			}
		}
		console.log("*** matches below");
		console.log(matchGems);
		return matchGems;
	};

	this._checkIfGemsAreNeighbors = function _checkIfGemsAreNeighbors(gemA, gemB) {
		// return whether or not gem B exists in gem A's list of neighbors
		
		var gemANeighbors = this._getNeighborsForGem(gemA);
		var gemsAreNeighbors = false;
		gemANeighbors.forEach(function (neighbor) {
			if (neighbor === gemB) {
				console.log("We are neighbors!");
				gemsAreNeighbors = true;
			}
		}.bind(this));

		return gemsAreNeighbors;
	};

	this._getNeighborsForGem = function _getNeighborsForGem(gem) {
		var gemPos = gem.getPosition();
		var leftNeighbor, rightNeighbor, aboveNeighbor, belowNeighbor;
		if (this._gems[gemPos.y]) {
			if (this._gems[gemPos.y][gemPos.x-1]) {
				leftNeighbor = this._gems[gemPos.y][gemPos.x-1];
			} 
			if (this._gems[gemPos.y][gemPos.x+1]) {
				rightNeighbor = this._gems[gemPos.y][gemPos.x+1];
			}
		}
		
		if (this._gems[gemPos.y-1] && this._gems[gemPos.y-1][gemPos.x]) {
			aboveNeighbor = this._gems[gemPos.y-1][gemPos.x];
		}
		if (this._gems[gemPos.y+1] && this._gems[gemPos.y+1][gemPos.x]) {
			belowNeighbor = this._gems[gemPos.y+1][gemPos.x];
		}

		var neighbors = [];
		[leftNeighbor, rightNeighbor, aboveNeighbor, belowNeighbor].forEach(function (neighbor) {
			if (neighbor) { // Done so we don't accidentally push undefined
				neighbors.push(neighbor);
			}
		}.bind(this));

		return neighbors;
	};

	this._getGemForPoint = function _getGemForPoint(point) {
		var px = Math.floor(point.x / this._gemSize);
		var py = Math.floor(point.y / this._gemSize);

		return this._getGemAtPosition(px, py);
	};

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
