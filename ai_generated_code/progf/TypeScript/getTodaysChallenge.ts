// Lol thanks ChatGPT
export function getTodaysChallenge() {
	const currentDate = new Date();
	const day = currentDate.getDate();
	let rule = '';

	switch (day) {
		case 28:
			rule = 'Targets Assigned 10 PM (Sign ups close)';
			break;
		case 29:
			rule = 'GAME STARTS. 12 AM: To stay safe, players must hold the animal with their right hand';
			break;
		case 30:
			rule = 'To stay safe, players must be holding the animal with both hands';
			break;
		case 31:
			rule = 'Targets Change at 10 PM: To stay safe, players must be holding animal BELOW waist';
			break;
		case 1:
			rule = 'To stay safe, players must be holding animal ABOVE their shoulder';
			break;
		case 2:
			rule = 'To stay safe, players must be under a roof or overhang';
			break;
		case 3:
			rule =
				'Targets Change at 10 PM: Players with less than one elimination are automatically eliminated';
			break;
		case 4:
		case 11:
		case 16:
		case 19:
			rule = 'On weekends, players must abide by all rules and must carry a plushie to be safe';
			break;
		case 5:
			rule = 'To stay safe, players must be touching a wall';
			break;
		case 6:
			rule = 'To stay safe, players must be wearing a HAT.';
			break;
		case 7:
			rule =
				'Targets Change at 10 PM: To stay safe, players must be wearing JORTS (jean shorts) You CAN roll up regular jeans to be shorts-length (at or above knee level).';
			break;
		case 8:
			rule = 'To stay safe, players must be wearing a wig';
			break;
		case 9:
			rule = 'To stay safe, players must be SITTING OR LAYING DOWN ON THE GROUND.';
			break;
		case 10:
			rule =
				'Targets Change at 10 PM: Players with less than two eliminations are automatically eliminated';
			break;
		case 12:
			rule = 'To eliminate others, players must have at least one shoe off.';
			break;
		case 13:
			rule = 'To eliminate others, players must be carrying a football in one hand.';
			break;
		case 14:
			rule =
				'Targets Change at 10 PM:. To eliminate others, players must give their target a flower immediately after eliminating them.';
			break;
		case 15:
			rule = 'To eliminate others, players must be wearing a tie around their neck.';
			break;
		case 20:
			rule = 'NO ONE IS SAFE. (can be tagged anytime even w/animal)';
			break;
		default:
			rule = 'On weekends, players must abide by all rules and must carry a plushie to be safe';
			break;
	}
	return rule;
}
