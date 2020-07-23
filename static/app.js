$guess = $("#input-form");
const foundWords = new Set();
let score = 0;
timer();

//handle the submit event
$guess.on("submit", function(evt) {
    evt.preventDefault();
    $("#msg").empty();
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
    //a countdown timer that starts when the page loads
    countDown = setInterval(() => {
        sec -= 1;
        if (sec == 0) {
            clearInterval(countDown);
            endGame();
        } else showTimer(sec);
    }, 1000);
}

function showTimer(sec) {
    //displays the timer on the page
    $("#timer").empty();
    $("#timer").append(`<p>Timer: ${sec} seconds`);
}

async function endGame() {

    //updates the high score and times played on the back end
    $("#timer").empty();
    $guess.empty();
    alert("Game Over");
    restart();
    resp = await axios.post("/end", { data: { score } });
    if (resp.data == "New High Score!") {
        showMessage(`New High Score: ${score}`);
    }
}

function restart() {
    //adds a restart button
    $("#timer").append("<div class='text-right'><a href= '/'> <button class = 'btn'> Replay </button> </a></div> ");
}

function showMessage(msg) {
    //displays messages
    $("#msg").empty();
    $("#msg").append(`<h3>${msg}</h3>`);
}