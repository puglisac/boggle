from boggle import Boggle
from flask import Flask, request, session, render_template, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/')
def make_board():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('game.html', board=board)


@app.route('/check')
def check_word():
    word = request.args["word"]
    board = session["board"]
    resp = boggle_game.check_valid_word(board, word)
    print(resp)
    return jsonify(resp)
