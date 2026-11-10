# This script is entirely Assisted using common GitHub development utilities. 

from flask import Flask, request, jsonify
import pygame
import time

app = Flask(__name__)

pygame.mixer.init()

def play_sound(file):
    pygame.mixer.music.load(file)
    pygame.mixer.music.play()

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    if 'nfc' in data:
        nfc_value = data['nfc']
        if nfc_value == 1:
            play_sound('1.mp3')
            return jsonify({"status": "playing 1.mp3"}), 200
        elif nfc_value == 0:
            play_sound('0.mp3')
            return jsonify({"status": "playing 0.mp3"}), 200
        else:
            return jsonify({"error": "Invalid nfc value"}), 400
    else:
        return jsonify({"error": "nfc key missing"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)