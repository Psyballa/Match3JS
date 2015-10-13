import AudioManager;

exports.sound = null;
exports.getSounds = function() {
	if (!exports.sound) {
		exports.sound = new AudioManager({
			path: 'resources/sounds',
			files: {
				match1: {
					path: 'streak',
					volume: 0.8,
					background: false,
					loop: false
				},
				match2: {
					path: 'streak',
					volume: 0.8,
					background: false,
					loop: false
				},
				match3: {
					path: 'streak',
					volume: 0.8,
					background: false,
					loop: false
				},
				match4: {
					path: 'streak',
					volume: 0.8,
					background: false,
					loop: false
				},
				invalidSwap: {
					path: 'effects',
					volume: 0.8,
					background: false,
					loop: false
				},
				heatingUp: {
					path: 'effects',
					volume: 0.8,
					background: false,
					loop: false
				},
				onFire: {
					path: 'effects',
					volume: 1.0,
					background: false,
					loop: false
				},
				gameOver: {
					path: 'effects',
					volume: 1.0,
					background: false,
					loop: false
				},
				warningKlaxon: {
					path: 'effects',
					volume: 0.5,
					background: false,
					loop: false,
				},
				timerWarning: {
					path: 'effects',
					volume: 0.5,
					background: false,
					loop: false
				},
				music0: {
					path: 'music',
					volume: 0.5,
					background: true
				},
				music1: {
					path: 'music',
					volume: 0.5,
					background: true
				},
				music2: {
					path: 'music',
					volume: 0.5,
					background: true
				},
				music3: {
					path: 'music',
					volume: 0.5,
					background: true
				}
			}
		});
	}
	return exports.sound;
}