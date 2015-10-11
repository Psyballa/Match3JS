
	this._animateSwap = function _animateSwap(srcGem, destGem) {
		var swapDirections = this._getSwapDirections(srcGem, destGem);
		var swapAnimations = this._getSwapAnimations(swapDirections);

		console.log("Swap animations: ");
		console.log(swapAnimations);
		animate(srcGem, 'swapGem').now(swapAnimations.sourceAnim, 1000, 'linear');
		animate(destGem, 'swapGem').now(swapAnimations.destAnim, 1000, 'linear');

		animate.getGroup('swapGem').on('Finish', function() {
			console.log("I swapped a gem, holy shit");
		});		
	}

	this._getSwapDirections = function _getSwapDirections(srcGem, destGem) {
		if (!srcGem || !destGem) {
			return;
		}
		var srcPos = srcGem.getPosition();
		var destPos = destGem.getPosition();
		var dx = srcPos.x - destPos.x;
		var dy = srcPos.y - destPos.y;

		// First check horizontally
		if (dx !== 0 && dy !== 0) {
			// Somehow we got two gems that aren't neighbors
			return;
		} else {
			if (dx === -1) {  // L to R
				srcDir = 'left';
				destDir = 'right';
			}
			if (dx === 1) {
				srcDir = 'right';
				destDir = 'left';
			}
			if (dy === -1) {
				srcDir = 'down';
				destDir = 'up';
			}
			if (dy === 1) {
				srcDir = 'up';
				destDir = 'down';
			}
		}

		return {sourceDirection: srcDir, destinationDirection: destDir};
	}

	this._getSwapAnimations = function _getSwapAnimations(swapDirections) {
		var srcSwapAnim = this._getSwapAnimationForDirection(swapDirections.sourceDirection);
		var dstSwapAnim = this._getSwapAnimationForDirection(swapDirections.destinationDirection);
		var swapAnimations = {sourceAnim: srcSwapAnim, destAnim: dstSwapAnim};

		console.log(swapAnimations);
		return swapAnimations;
	}

	this._getSwapAnimationForDirection = function _getSwapAnimationForDirection(direction) {
		var swapAnimation;
		switch (direction) {
			case 'up':
				swapAnimation = {y: -(gemSize)};
				break;
			case 'down':
				swapAnimation = {y: (gemSize)};
				break;
			case 'left': 
				swapAnimation = {x: -(gemSize)};
				break;
			case 'right':
				swapAnimation = {x: (gemSize)};
				break;
			default:
				break;

		}
		return swapAnimation;
	}