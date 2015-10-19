
import device;
import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.models.Gem as Gem;
import src.models.AudioManager as AudioManager;
var SELECTED_GEM_MARGIN = 2; // Ensuring when a gem is selected, selection looks bigger.
var MAX_CHAIN_SOUNDS = 4;
var SWAP_ANIM_TIME = 250; //ms
exports = Class(View, function (supr) {
	'use strict';
	this._gems = [];
	this._boardWidth = 0;
	this._boardHeight = 0;
	this._gemSize = 66;
	this._isSelecting = false;
	this._selectedGem = null;
	this._selectedView = null;
	this._chainingGems = false;
	this._animatingSwap = false;
	this._onFire = false;
	this._currentChain = 0;
	this._currentlyDragging = false;
	this._currentGemCenter = null;
	this._sounds = AudioManager.getSounds();

	this.init = function (args) {
		this._boardWidth = args.boardWidth;
		this._boardHeight = args.boardHeight;
		args = merge(
			args,
			{
				width: this._boardWidth * this._gemSize,
				height: this._boardHeight * this._gemSize,
				clip: true
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
				this._createGem(col, row, forbiddenColorTypes);
			}
		}
	};

	this.onInputStart = function onInputSelect(startEvent, startPoint) {
		if (this._chainingGems || this._animatingSwap) {
			return;
		}

		var gemOnStartPoint = this._getGemForPoint(startPoint);
		if (gemOnStartPoint) {
			this._selectedGem = gemOnStartPoint;
		}
		this.startDrag({
			radius: 1
		});
	};


	this._getSwapDirectionFromDrag = function _getSwapDirectionFromDrag(delta) {
		var dx = delta.x;
		var dy = delta.y;
		var swapDir;

		if (Math.abs(dx) > Math.abs(dy)) {
			swapDir = (dx > 0) ? 'right' : 'left';
		} else {
			swapDir = (dy > 0) ? 'down' : 'up';
		}

		return swapDir;
	};

	this._getSwapAnimationFromDirection = function _getSwapAnimationFromDirection(srcGem, destGem, swapDirection) {
		var swapAnim;
		var otherSwapAnim;
		switch (swapDirection) {
			case 'up':
				swapAnim = {y: srcGem.style.y - this._gemSize};
				otherSwapAnim = {y: destGem.style.y + this._gemSize};
				break;
			case 'down':
				swapAnim = {y: srcGem.style.y + this._gemSize};
				otherSwapAnim = {y: destGem.style.y - this._gemSize};
				break;
			case 'left':
				swapAnim = {x: srcGem.style.x - this._gemSize};
				otherSwapAnim = {x: destGem.style.x + this._gemSize};
				break;
			case 'right':
				swapAnim = {x: srcGem.style.x + this._gemSize};
				otherSwapAnim = {x: destGem.style.x - this._gemSize};
				break;
		}

		return {srcAnim: swapAnim, destAnim: otherSwapAnim};
	};

	// ugly IMO but gets job done. suggestions for alternate implementation appreciated
	this._getOppositeSwapDirection = function _getOppositeSwapDirection(swapDir) {
		var oppositeSwapDir;
		switch(swapDir) {
			case 'up':
				oppositeSwapDir = 'down';
				break;
			case 'down':
				oppositeSwapDir = 'up';
				break;
			case 'left':
				oppositeSwapDir = 'right';
				break;
			case 'right':
				oppositeSwapDir = 'left';
				break;
		}
		return oppositeSwapDir;
	};

	this._animateSwap = function _animateSwap(srcGem, destGem, swapDirection) {
		var swapAnims = this._getSwapAnimationFromDirection(srcGem, destGem, swapDirection);
		animate(srcGem).now(swapAnims.srcAnim, SWAP_ANIM_TIME);
		animate(destGem).now(swapAnims.destAnim, SWAP_ANIM_TIME);
	};

	this.onDrag = function onDrag(dragEvent, moveEvent, delta) {
		if (this._currentlyDragging || this._animatingSwap || this._currentlyDragging) {
			return;
		}
		var swapDirection = this._getSwapDirectionFromDrag(delta);
		this._currentlyDragging = true;
		var gemAtSwapPoint = this._getGemAtSwapPoint(swapDirection);
		if (!gemAtSwapPoint && !this._sounds.isPlaying('invalidSwap')) {
			this._sounds.play('invalidSwap');
		} else {
			this._validateMove(this._selectedGem, gemAtSwapPoint, swapDirection);
		}
	}

	this._getGemAtSwapPoint = function _getGemAtSwapPoint(swapDir) {
		if (!this._selectedGem) {
			return; 
		}
		var destGem = null;
		switch(swapDir) {
			case 'left':
				destGem = this._gems[this._selectedGem.getPosition().y][this._selectedGem.getPosition().x-1];
				break;
			case 'right':
				destGem = this._gems[this._selectedGem.getPosition().y][this._selectedGem.getPosition().x+1];
				break;
			case 'up':
				if (this._gems[this._selectedGem.getPosition().y-1]) {
					destGem = this._gems[this._selectedGem.getPosition().y-1][this._selectedGem.getPosition().x];
				}
				break;
			case 'down':
				if (this._gems[this._selectedGem.getPosition().y+1]) {
					destGem = this._gems[this._selectedGem.getPosition().y+1][this._selectedGem.getPosition().x];
				}
				break;
		}

		return destGem;
	}

	this.onDragStop = function onDragStop(dragEvent, moveEvent, delta) {
		this._currentlyDragging = false;
	}

	this._validateMove = function _validateMove(srcGem, destGem, swapDirection) {
		this._animatingSwap = true;
		this._animateSwap(srcGem, destGem, swapDirection);
		this._swapGems(srcGem, destGem);
		var matchedGems = this._checkForMatches();
		if (matchedGems.length > 0) {
			setTimeout(function() {
				this._deleteGems(this._checkForMatches());
				this._animatingSwap = false;
			}.bind(this), SWAP_ANIM_TIME);
		} else {
			setTimeout(function() {
				var oppSwapDir = this._getOppositeSwapDirection(swapDirection);
				this._sounds.play('invalidSwap');
				this._animateSwap(srcGem, destGem, oppSwapDir);
				this._swapGems(destGem, srcGem);
				this._animatingSwap = false;
			}.bind(this), SWAP_ANIM_TIME)
		}
	}

	this._checkForMatches = function _checkForMatches() {
		// Traverse through gems array
		var matches = [];
		// Find matches horizontally
		matches = matches.concat(this._findMatchesOnRows());
		matches = matches.concat(this._findMatchesOnColumns());
		matches = matches.filter(function (item, pos, self) {
			return self.indexOf(item) === pos;
		});

		return matches;
	};

	this._deleteGems = function _deleteGems(gems) {
		if (gems.length > 0) {
			this._currentChain++;
			this._chainingGems = true;
			var matchSoundName = (this._currentChain > MAX_CHAIN_SOUNDS) ? 4 : this._currentChain
			this._sounds.play('match' + matchSoundName);
			if (this._currentChain == 3) {
				this._sounds.play('heatingUp');
			}

			if (this._currentChain > MAX_CHAIN_SOUNDS && !this._onFire) {
				this._sounds.play('onFire');
				this.emit('board:incrementMultiplier');
				this._onFire = true;
			}
			var gemsDestroyed = 0;
			gems.forEach(function (gem) {
				gem.style.centerAnchor = true;
				gem.style.anchorX = gem.getSize()/2;
				gem.style.anchorY = gem.getSize()/2;
				var shrinkTick = 0;
				var shrinkAnim = setInterval(function() {
					shrinkTick++;
					if (shrinkTick < 10) {
						gem.style.scale /= 2;
					} else {
						this._gems[gem.getPosition().y][gem.getPosition().x] = null;
						this.removeSubview(gem);
						gemsDestroyed++;
						shrinkTick = 0;
						clearInterval(shrinkAnim);
					}
				}.bind(this), 10);
			}.bind(this));

			var matchScore = gems.length * (100 * this._currentChain);
			this.emit('board:scoregems', matchScore);

			var timeUntilDropExistingGems = setInterval(function() {
				if (gemsDestroyed === gems.length) {
					this._shiftExistingGemsDown();
					clearInterval(timeUntilDropExistingGems);
				}
				
			}.bind(this), 20);
		} else {
			this._chainingGems = false;
			this._onFire = false;
			this._currentChain = 0;
			device.collectGarbage(); // Chaining has ended, await user input
		}
	};



	this._shiftExistingGemsDown = function _shiftExistingGemsDown() {
		// Iterate through columns bottom up, looking for non-null gems.
		var lowestColumn = 0;
		for (var col = 0; col < this._boardWidth; col++) {
			for (var row = this._boardHeight - 1; row >= 0; row--) {
				if (this._gems[row][col] === null) {
					var gemToShift = null;
					for (var lookUp = row - 1; lookUp >= 0; lookUp--) {
						lowestColumn = lookUp;
						gemToShift = this._gems[lookUp][col];
						if (gemToShift !== null) {
							this._gems[lookUp][col] = null;
							this._gems[row][col] = gemToShift;
							gemToShift.setPosition({x: gemToShift.getPosition().x, y: row});
							animate(gemToShift).now({y: gemToShift.getPosition().y * this._gemSize}, (100), animate.linear);
							break;
						}
					}
				}
			}
		}

		this._createNewGemsForColumns();
		setTimeout(function() {
			this._deleteGems(this._checkForMatches());
		}.bind(this), 350);			
	};

	this._createNewGemsForColumns = function _createNewGemsForColumns() {
		for (var col = 0; col < this._boardWidth; col++) {
			for (var row = this._boardHeight - 1; row > -1; row--) {
				if (this._gems[row][col] === null) {
					this._createGem(col, row, []);
				}
			}
		}
	}

	this._shiftGemDown = function _shiftGemDown(gem) {
		var newY = gem.getPosition().y + 1;
		this._gems[gem.getPosition().y][gem.getPosition().x] = null;
		this._gems[newY][gem.getPosition().x] = gem;
		gem.setPosition({x: gem.getPosition().x, y: newY});
		animate(gem).now({y:(newY+1) * this._gemSize}, 50, animate.linear);
	}

	this._findMatchesOnRows = function _findMatchesOnRows() {
		// Traverse through each row
		var matches = [];
		this._gems.forEach(function (row){
			// Iterate right, checking for matches.
			var currentGemColor = row[0].getColorType();
			var prevGemColor;
			var currentStreak = 0;
			for (var rowIdx = 1; rowIdx < this._boardWidth; rowIdx++) {
				prevGemColor = currentGemColor;
				currentGemColor = row[rowIdx].getColorType();
				if (currentGemColor === prevGemColor) {
					currentStreak++;
					if (currentStreak === 2) { // It's a match!
						for(var streakIdx = currentStreak; streakIdx > -1; streakIdx--) {
							matches.push(row[rowIdx-streakIdx]);
						}
					}
					if (currentStreak > 2) { // You got more than a match-3!
						matches.push(row[rowIdx]);
					}
				} else {
					currentStreak = 0;
				}
				
			}
		}.bind(this));
		return matches;
	}

	// While this understandably looks very similar to _findMatchesOnRows, we need this.
	this._findMatchesOnColumns = function _findMatchesOnColumns() {
		var matches = [];
		for (var col = 0; col < this._boardWidth; col++) {
			var currentStreak = 0;
			var currentGemColor = this._gems[0][col].getColorType();
			var previousGemColor;
			for (var row = 1; row < this._boardHeight; row++) {
				previousGemColor = currentGemColor;
				currentGemColor = this._gems[row][col].getColorType();
				if (currentGemColor === previousGemColor) {
					currentStreak++;
					if (currentStreak === 2) {
						for (var streakIdx = currentStreak; streakIdx > -1; streakIdx--) {
							matches.push(this._gems[row-streakIdx][col]);
						}
					}
					if (currentStreak > 2) {
						matches.push(this._gems[row][col]);
					}
				} else {
					currentStreak = 0;
				}
				
			}
		}
		return matches;
	}

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

	this._swapGems = function _swapGems(srcGem, destGem) {	
		// Swap for gems array
		this._gems[srcGem.getPosition().y][srcGem.getPosition().x] = destGem;
		this._gems[destGem.getPosition().y][destGem.getPosition().x] = srcGem;
		// Swap that player sees
		var tempPos = srcGem.getPosition();

		srcGem.setPosition(destGem.getPosition());

		destGem.setPosition(tempPos);
	};

	this._createGem = function _createGem(col, row, forbiddenColorTypes) {
		var newGem = new Gem({
			position: {x: col, y: row},
			forbiddenColors: forbiddenColorTypes
		});
		newGem.style.y = -this._gemSize;
		this._gems[row][col] = newGem;
		this.addSubview(newGem);
		animate(newGem).now({y: (row) * this._gemSize}, (50 * row) + 50, animate.easeOut);
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

	this.areGemsChaining = function areGemsChaining() {
		return this._chainingGems;
	}
});
