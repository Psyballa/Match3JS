import device;

exports = Class('Util', function () {
	// These are all functions that could theoretically be used in any class.
	this.init = function () {};

	this.getRandomInteger = function getRandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	};

	this.getRandomElementFromArray = function getRandomElementFromArray(array) {
		return array[Math.floor(Math.random() * array.length)];
	};

	this.checkIfArraysHaveSameContents = function checkIfArraysHaveSameContents (arrayA, arrayB) {
		if (!arrayA || !arrayB || (arrayA.length !== arrayB.length)) {
			return false;
		}
		for (var i = 0; i < arrayA.length; i++) {
			if (arrayB.indexOf(arrayA[i]) < 0) {
				return false;
			}
		}
		return true;
	}
});