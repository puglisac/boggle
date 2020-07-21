$guess = $("form");
const foundWords = new Set();
let score = 0;
$guess.on("submit", function(evt) {
    evt.preventDefault();
    checkWord($(evt.target[0]).val());
    $(evt.target[0]).val("");
});

async function checkWord(guess) {
    console.log(guess);
    if (!guess) {
        return;
    }
    if (foundWords.has(guess)) {
        alert(`${guess} has already been found`);
        return;
    }

    let resp = await axios.get("/check", { params: { word: guess } });

    if (resp.data == "ok") {
        foundWords.add(guess);
        displayWords(foundWords);
        addScore(guess.length);
        console.log(foundWords);
    } else if (resp.data == "not-on-board") {
        alert(`${guess} is not on this board`);
    } else if (resp.data == "not-word") {
        alert(`${guess} is not a word`);
    }
}

function displayWords(words) {
    $("#found-words").empty();
    for (word of words) {
        $("#found-words").append(`<div>${word}</div>`);
    }
}

function addScore(num) {
    score += num;
    $("#score").empty();
    $("#score").append(`<span>Score: ${score}</span>`);
}