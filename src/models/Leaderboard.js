import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.TextView as TextView;
import ui.widget.ButtonView as Button;


exports = Class(View, function (supr) {
	this._views = [];
	this._leaderboardView;
	this._leaderboardSize = 50;
	this.init = function (args) {
		supr(this, 'init', [args]);
		this.build();
	};

	this.build = function build() { 
		this._leaderboardView = new View({
			x: this.style.width / 16,
			y: this.style.height / 8,
			width: this.style.width,
			height: this.style.height / 2
		});

		this.addSubview(this._leaderboardView);
		// Build leaderboard views
		this.buildLeaderboardViews();
	};

	this.buildLeaderboardViews = function buildLeaderboardViews() {
		for (var leaderboardIdx = 0; leaderboardIdx < 10; leaderboardIdx++) {
			var place = new TextView({
				x: 0,
				y: leaderboardIdx * this._leaderboardSize,
				width: 100,
				height: 50,
				text: leaderboardIdx + 1,
				size: 50,
				strokeColor: '#000000',
				color: '#FFFFFF',
				fontFamily: 'Checkbook',
				autoFontSize: true,
				horizontalAlign: 'center'
			});

			var entry = new TextView({
				x: this.style.width / 3,
				y: leaderboardIdx * this._leaderboardSize,
				width: 300,
				height: 50,
				text: '---------',
				size: 50,
				strokeColor: '#000000',
				fontFamily: 'Checkbook',
				color: '#FFFFFF',
				autoFontSize: true,
				horizontalAlign: 'center'
			});
			this._views.push(entry);
			this._leaderboardView.addSubview(place);
			this._leaderboardView.addSubview(entry);
		}
	};

	this.pushScoreToLeaderboard = function pushScoreToLeaderboard(score) {
		GLOBAL.highScores.push(score);
		GLOBAL.highScores.sort(function(a,b) { return b - a; });
	}
	this.updateLeaderboardViews = function updateLeaderboardViews() {
		console.log(GLOBAL.highScores);
		this._views.forEach(function (entry, index) {
			if (GLOBAL.highScores[index]) {
				entry.setText(GLOBAL.highScores[index]);
			}
		});
	};
});