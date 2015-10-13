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
				}
			}
		});
	}
	return exports.sound;
}