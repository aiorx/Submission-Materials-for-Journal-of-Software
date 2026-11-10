# Thanks ChatGPT for these next three functions
    def _determine_outcome(self):
        """Rolls dice and determines the outcome"""
        user_roll = random.randint(1, 10)
        bot_roll = random.randint(1, 10)

        if user_roll > bot_roll:
            return "Win", user_roll, bot_roll
        elif user_roll < bot_roll:
            return "Lose", user_roll, bot_roll
        else:
            return "Tied", user_roll, bot_roll

    def _update_balance(self, prev_balance, bet_amount, outcome):
        """Updates the user's balance based on the outcome"""
        if outcome == "Win":
            return prev_balance + bet_amount
        elif outcome == "Lose":
            return prev_balance - bet_amount
        return prev_balance

    def _get_outcome_color(self, outcome):
        """Returns the color based on the outcome"""
        colors = {
            "Win": 0x00ff00,  # Green for win
            "Lose": 0xff0000, # Red for lose
            "Tied": 0xffff00  # Yellow for tie
        }
        return colors.get(outcome, 0xffffff) # Default to white if outcome is unknown