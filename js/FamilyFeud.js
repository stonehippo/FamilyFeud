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
				board.strikes = 0;
				fillboard(board);
			}
			$("<div class='board'></div>").appendTo("body");
			$(["<h1>",board.topic,"</h1>"].join("")).appendTo(".board");
			$("<div class='strikes'><span>X</span><span>X</span><span>X</span></div>").appendTo(".board");

			// draw the answers for the board
			$("<table><thead></thead><tbody></tbody></table>").appendTo(".board");
			$.each(board.answers, function (index, item) {
				var cell;
				if (item) {
					cell = ["<td class='answer'>",item.answer,"</td><td class='percentage'>",item.percentage,"</td>"].join("");
				} else {
					cell="<td colspan='2'></td>";
				}

				if (index < 4) { // the item to the first column
					$(["<tr></tr>"].join("")).appendTo('.board table tbody');
					$('.board table tbody tr').last().append(cell);
				}  else {		
					$(cell).appendTo(['.board table tbody tr:nth-child(', index - 3,')'].join(""));
				}
			});
			$(".board").on('click', function () {strikeBoard(boards[currentBoard]);});
			updateStrikeCount(board);
		},
		fillboard = function (board) {
			// there are less than 8 answers in the board, add in filler items
			while (board.answers.length < 8) {
				board.answers.push(null);
			}
		},
		strikeBoard = function (board) {
			if (board.strikes < 3) {
				board.strikes++;
				flashStrikes(board);
				updateStrikeCount(board);
			}
		},
		flashStrikes = function (board) {
			console.log("You know have", board.strikes, "strikes!");
		},
		updateStrikeCount = function (board) {
			$('.strikes span').each(function (index, item) {
				if (index < (board.strikes)) {
					$(item).addClass("struck");
				}
			});
		},
		dismissCurrentBoard = function () {
			$(".board").off();
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
			$("#next").on('click', function () {that.nextBoard();});
			$("#previous").on('click', function () {that.previousBoard();});
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