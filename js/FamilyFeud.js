/*
A simple Family Feud engine
*/

var FamilyFeud = (function () {
	var that = {},
		boards = [],
		rounds = 0,
		currentBoard = 0,
		getBoards = function () {
			return boards;
		},
		getRounds = function () {
			return rounds;
		},
		drawBoard = function (board) {
			if (typeof board.played === 'undefined') {
				board.played = false;
			}
			$(["<div class='board'>",board.topic,"</div>"].join("")).appendTo("body");
		},
		dismissCurrentBoard = function () {
			$('.board').remove();
		},
		nextBoard = function () {
			if(currentBoard < rounds - 1) {
				dismissCurrentBoard();
				currentBoard++;
				drawBoard(boards[currentBoard]);
			}
		},
		previousBoard = function () {
			if(currentBoard > 0) {
				dismissCurrentBoard();
				currentBoard--;
				drawBoard(boards[currentBoard]);
			}
		},
		start = function () {
			drawBoard(boards[currentBoard]);
		};

	// load the data for the game
	if (!boards.length) {
		$.getJSON("/data.json", function(data) {
			boards = data.boards;
			rounds = boards.length;
			start();
		});
	}


	// Expose the public API - really only used for troulbeshooting
	that.boards = getBoards;
	that.rounds = getRounds;
	that.nextBoard = nextBoard;
	that.previousBoard = previousBoard;
	return that;
})();