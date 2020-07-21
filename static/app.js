$guess = $("#input-form");
const foundWords = new Set();
let score = 0;
timer();

//handle the submit event
$guess.on("submit", function(evt) {
	evt.preventDefault();
	checkWord($(evt.target[0]).val());
	$(evt.target[0]).val("");
});

//checks if the submitted word is a valid word
async function checkWord(guess) {
	console.log(guess);
	//return if the guess is false
	if (!guess) {
		return;
	}
	//alert and return if the word has already been found
	if (foundWords.has(guess)) {
		showMessage(`${guess} has already been found`);
		return;
	}

	//request to the server to check if valid word
	let resp = await axios.get("/check", { params: { word: guess } });

	//handles response from the server
	if (resp.data == "ok") {
		foundWords.add(guess);
		displayWords(foundWords);
		addScore(guess.length);
		console.log(foundWords);
	} else if (resp.data == "not-on-board") {
		showMessage(`${guess} is not on this board`);
	} else if (resp.data == "not-word") {
		showMessage(`${guess} is not a word`);
	}
}

//displays the found words on the page
function displayWords(words) {
	$("#found-words").empty();
	for (word of words) {
		$("#found-words").append(`<div class="col-6">${word}</div>`);
	}
}

//displays the score
function addScore(num) {
	score += num;
	$("#score").empty();
	$("#score").append(`<span>Score: ${score}</span>`);
}

function timer(sec = 60) {
	countDown = setInterval(() => {
		sec -= 1;
		if (sec == 0) {
			clearInterval(countDown);
			endGame();
		} else showTimer(sec);
	}, 1000);
}

function showTimer(sec) {
	$("#timer").empty();
	$("#timer").append(`<p>Timer: ${sec} seconds`);
}

async function endGame() {
	$("#timer").empty();
	$guess.empty();
	showMessage("Game Over");
	restart();
	resp = await axios.post("/end", { params: { score } });
	if (resp.data == "New High Score!") {
		showMessage(`New High Score: ${score}`);
	}
}

function restart() {
	$("#timer").append("<div class='text-right'><a href= '/'> <button class = 'btn'> Replay </button> </a></div> ");
}

function showMessage(msg) {
	$("#msg").empty();
	$("#msg").append(`<h3>${msg}</h3>`);
}
