# Base code genetated using GitHub Copilot

import json
import os


class HighscoreManager:
    def __init__(self, game_name: str, data_file="highscore.json", highscore_limit=10):
        self.game = game_name
        self.limit = highscore_limit
        self.data_file = data_file
        self._load_data()


    def _load_data(self):
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r') as file:
                self.data = json.load(file)
        else:
            self.data = {}


    def _save_data(self):
        with open(self.data_file, 'w') as file:
            json.dump(self.data, file, indent=4)


    def score_to_beat(self, ascending, difficulty=None):
        # No existing save, nothing to beat
        if self.game not in self.data:
            return None 

        highscores = []
        if difficulty:
            difficulty = str(difficulty)
            if difficulty in self.data[self.game]:
                highscores = self.data[self.game][difficulty]
        else:
            highscores = self.data[self.game]
        
        # Not enough highscores to compare
        if len(highscores) < self.limit:
            return None
        
        if ascending:
            return min(highscores, key=lambda x: x['score'])['score']
        else:
            return max(highscores, key=lambda x: x['score'])['score']


    def add_score(self, name, score, ascending, difficulty=None):
        # Create save for this game
        if self.game not in self.data:
            self.data[self.game] = {}

        if difficulty:
            difficulty = str(difficulty)

            # Create save for this game's difficulty
            if difficulty not in self.data[self.game]:
                self.data[self.game][difficulty] = []

            self.data[self.game][difficulty].append({"name": name, "score": score})
            # Clean up highscores
            self.data[self.game][difficulty] = sorted(self.data[self.game][difficulty], key=lambda x: x['score'], reverse=not ascending)[:self.limit]
        else:
            if not isinstance(self.data[self.game], list):
                self.data[self.game] = []
            self.data[self.game].append({"name": name, "score": score})
            # Clean up highscores
            self.data[self.game] = sorted(self.data[self.game], key=lambda x: x['score'], reverse=not ascending)[:self.limit]
        
        self._save_data()


    def print_scores(self, ascending):
        if self.game in self.data:
            if isinstance(self.data[self.game], list):
                scores = sorted(self.data[self.game], key=lambda x: x['score'], reverse=not ascending)
                for entry in scores:
                    print(f"{entry['name']}: {entry['score']}")
            else:
                for difficulty, scores in self.data[self.game].items():
                    print(f"Difficulty: {difficulty}")
                    sorted_scores = sorted(scores, key=lambda x: x['score'], reverse=not ascending)
                    for entry in sorted_scores:
                        print(f"\t{entry['score']}\t{entry['name']}")
        else:
            print("No highscore.")


    def reset_highscores(self):
        if self.game in self.data:
            self.data[self.game] = {}
            self._save_data()
            return True
        return False
