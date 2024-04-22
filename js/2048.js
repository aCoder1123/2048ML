// todo fix chance of getting a 4 from the start
// todo unfuck header
let score = 0;
let gameOver = false;

let board = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

const emptyBoard = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
];

let boardHistory = [];

let rolledBackNum = 0;

const boardCopy = (board) => {
	let newBoard = [[], [], [], []];
	for (i in board) {
		for (j in board[i]) {
			newBoard[i][j] = board[i][j];
		}
	}
	return newBoard;
};

const getRandPos = () => {
	return [
		Math.round(Math.random() * 4 - 0.5),
		Math.round(Math.random() * 4 - 0.5),
	];
};

const getRandPiece = () => {
	chance = Math.round(Math.random() * 11 - 0.5);
	return chance === 10 ? 4 : 2;
};

function arraysEqual(a, b) {
	return a.length === b.length && a.every((val, index) => val === b[index]);
}

const timelineBack = () => {
	console.log(boardHistory);

	if (rolledBackNum + 2 <= boardHistory.length) {
		console.log("RollingBack");
		rolledBackNum++;
		board = boardCopy(boardHistory[boardHistory.length - (rolledBackNum + 1)]);
	}
	putMatrix(board, true);
};

const timelineForward = () => {
	if (rolledBackNum > 0) {
		console.log("RollingForward");
		rolledBackNum--;
		board = boardCopy(boardHistory[boardHistory.length - (rolledBackNum + 1)]);
	}
	putMatrix(board, true);
};

const restartGame = () => {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	score = 0;
	let pos1 = getRandPos();
	let pos2 = getRandPos();
	while (arraysEqual(pos1, pos2)) {
		pos2 = getRandPos();
	}
	board[pos1[0]][pos1[1]] = getRandPiece();
	board[pos2[0]][pos2[1]] = getRandPiece();
	putMatrix(board);
	boardHistory = [];
};

const putMatrix = (matrix, hist = false) => {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			let square = document.getElementById(`r${i}c${j}`);
			value = matrix[i][j];
			if (!value) {
				square.className = "n0";
				square.innerHTML = "";
			} else {
				square.className = `p n${value}`;
				square.innerHTML = value;
			}
		}
	}
	document.getElementById("score").innerText = score;
	if (!hist) {
		boardHistory.push(boardCopy(board));
	}
};

const playMove = (d) => {
	// console.log(gameOver);
	// if (gameOver) {
	// 	return;
	// }

	console.log(`Playing move on ${board}`);
	let merged = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	let playedMove = false;
	if (d === "r") {
		console.log("moving");
		for (let i = 0; i < 4; i++) {
			let moved = false;
			for (let j = 2; j > -1; j--) {
				// console.log(`playing on (${i}, ${j})`);
				if (
					board[i][j] != 0 &&
					(board[i][j + 1] === 0 || board[i][j + 1] === board[i][j])
				) {
					// console.log(`trying on (${i}, ${j})`)

					if (board[i][j + 1] === 0) {
						board[i][j + 1] = board[i][j];
						board[i][j] = 0;
						if (merged[i][j]) {
							merged[i][j] = 0;
							merged[i][j + 1] = 1;
						}
						moved = true;
					} else if (board[i][j] === board[i][j + 1]) {
						if (merged[i][j + 1] || merged[i][j]) {
							continue;
						}
						moved = true;
						merged[i][j + 1] = 1;
						board[i][j + 1] = 2 * board[i][j + 1];
						board[i][j] = 0;
						score += board[i][j + 1];
					} else if (board[i][j] != board[i][j + 1]) {
						continue;
					} else {
						console.error("Game Logic Error");
						moved = false;
					}
				}
			}
			if (moved) {
				playedMove = true;
				i--;
			}
			moved = false;
		}
		merged = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
	} else if (d === "d") {
		console.log("movingDown");
		for (let j = 0; j < 4; j++) {
			let moved = false;
			for (let i = 2; i > -1; i--) {
				// console.log(`playing on (${i}, ${j})`);
				if (
					board[i][j] != 0 &&
					(board[i + 1][j] === 0 || board[i + 1][j] === board[i][j])
				) {
					// console.log(`trying on (${i}, ${j})`)

					if (board[i + 1][j] === 0) {
						board[i + 1][j] = board[i][j];
						board[i][j] = 0;
						if (merged[i][j]) {
							merged[i][j] = 0;
							merged[i + 1][j] = 1;
						}
						moved = true;
					} else if (board[i][j] === board[i + 1][j]) {
						if (merged[i + 1][j] || merged[i][j]) {
							continue;
						}
						moved = true;
						merged[i + 1][j] = 1;
						board[i + 1][j] = 2 * board[i + 1][j];
						board[i][j] = 0;
						score += board[i + 1][j];
					} else {
						console.error("Game Logic Error");
						moved = false;
					}
				}
			}
			if (moved) {
				j--; //!
				playedMove = true;
			}
			moved = false;
		}
		merged = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
	}
	if (d === "l") {
		console.log("moving left");
		for (let i = 0; i < 4; i++) {
			let moved = false;
			for (let j = 1; j < 4; j++) {
				// console.log(`playing on (${i}, ${j})`);
				if (
					board[i][j] != 0 &&
					(board[i][j - 1] === 0 || board[i][j - 1] === board[i][j])
				) {
					// console.log(`trying on (${i}, ${j})`)

					if (board[i][j - 1] === 0) {
						board[i][j - 1] = board[i][j];
						board[i][j] = 0;
						if (merged[i][j]) {
							merged[i][j] = 0;
							merged[i][j - 1] = 1;
						}
						moved = true;
					} else if (board[i][j] === board[i][j - 1]) {
						if (merged[i][j - 1] || merged[i][j]) {
							continue;
						}
						moved = true;
						merged[i][j - 1] = 1;
						board[i][j - 1] = 2 * board[i][j - 1];
						board[i][j] = 0;
						score += board[i][j - 1];
					} else if (board[i][j] != board[i][j - 1]) {
						continue;
					} else {
						console.error("Game Logic Error");
						moved = false;
					}
				}
			}
			if (moved) {
				playedMove = true;
				i--;
			}
			moved = false;
		}
		merged = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
	} else if (d === "u") {
		console.log("movingDown");
		for (let j = 0; j < 4; j++) {
			let moved = false;
			for (let i = 1; i < 4; i++) {
				// console.log(`playing on (${i}, ${j})`);
				if (
					board[i][j] != 0 &&
					(board[i - 1][j] === 0 || board[i - 1][j] === board[i][j])
				) {
					// console.log(`trying on (${i}, ${j})`)

					if (board[i - 1][j] === 0) {
						board[i - 1][j] = board[i][j];
						board[i][j] = 0;
						if (merged[i][j]) {
							merged[i][j] = 0;
							merged[i - 1][j] = 1;
						}
						moved = true;
					} else if (board[i][j] === board[i - 1][j]) {
						if (merged[i - 1][j] || merged[i][j]) {
							continue;
						}
						moved = true;
						merged[i - 1][j] = 1;
						board[i - 1][j] = 2 * board[i - 1][j];
						board[i][j] = 0;
						score += board[i - 1][j];
					} else {
						console.error("Game Logic Error");
						moved = false;
					}
				}
			}
			if (moved) {
				j--; //!
				playedMove = true;
			}
			moved = false;
		}
		merged = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
	}
	if (rolledBackNum && playedMove) {
		for (let i = 0; i < rolledBackNum; i++) {
			boardHistory.pop();
		}
		rolledBackNum = 0;
	}

	gameOver = true;
	for (i in board) {
		for (j in board[i]) {
			if (board[i][j] == 0) {
				gameOver = false;
				console.log(gameOver);
			}
		}
	}
	if (!gameOver) {
		let pos1 = getRandPos();
		let iters = 0;
		while (board[pos1[0]][pos1[1]] && iters < 1000) {
			pos1 = getRandPos();
			iters++;
		}
		if (iters < 999 && playedMove) {
			board[pos1[0]][pos1[1]] = getRandPiece();
			putMatrix(board);
		}
	}
};

restartGame();

document.addEventListener("keydown", (e) => {
	console.log(e.key);
	if (e.key === "ArrowRight" || e.key === "d") {
		playMove("r");
	} else if (e.key === "ArrowDown" || e.key === "s") {
		playMove("d");
	} else if (e.key === "ArrowLeft" || e.key === "a") {
		playMove("l");
	} else if (e.key === "ArrowUp" || e.key === "w") {
		playMove("u");
	}
});

// setTimeout(playMove("r"), 5000)
