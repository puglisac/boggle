from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def test_setup(self):
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<label class="col-12" for="size">How many rows?</label>', html)

    def test_game(self):
        with app.test_client() as client:
            resp = client.get('/game?size=4')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<h2>Found Words</h2>', html)
            self.assertEquals(len(session['board']), 4)
    def test_check(self):
            with app.test_client() as client:
                with client.session_transaction() as session:
                    session['board']=[["H", "E", "L", "L", "O"],
                    ["H", "E", "L", "L", "O"],
                    ["H", "E", "L", "L", "O"],
                    ["H", "E", "L", "L", "O"],
                    ["H", "E", "L", "L", "O"]]
                resp = client.get('/check?word=hello')
                self.assertEqual(resp.json, 'ok')
    def test_end(self):
        # how to setup this test?
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['high_score']='10'
                resp = client.post('/end', data={'score', '20'})
                self.asserEqual(session['high_score'], 20)
                