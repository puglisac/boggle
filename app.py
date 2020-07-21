from boggle import Boggle
from flask import Flask, request, session, render_template, jsonify, redirect
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route("/")
def setup_board():
    return render_template('setup.html')

@app.route('/game')
def make_board():
    """show the boggle game board"""
    size=int(request.args['size'])
    board = boggle_game.make_board(size)
    session['board'] = board
    return render_template('game.html', board=board)


@app.route('/check')
def check_word():
    """check if submission is a valid word"""
    word = request.args["word"]
    board = session["board"]
    resp = boggle_game.check_valid_word(board, word)
    return jsonify(resp)

@app.route('/end', methods=["POST"])
def update_data():
    score= int(request.json['params']['score'])
    print("score= ", score)
    if session.get('played'):
        played = session['played']
        played+=1
        session['played']=played
    else:
        session['played']=1    

    if session.get('high_score'):
        if session['high_score']<score:
            session['high_score']=score
    else: 
        session['high_score']=score        
    print("from session: ", session.get('played'), session.get('high_score'))
    return redirect('/')