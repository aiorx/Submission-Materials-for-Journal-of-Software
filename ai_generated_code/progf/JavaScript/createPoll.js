import { badCommand } from '../commonResponses';
import { sendDiscordMessage } from './discord';
import { volleyMessage, creatingPoll } from './responses';

const VALID_HOURS = ['17:00', '18:00'];
const RALLLY_CREATE_URL = 'https://app.rallly.co/api/trpc/polls.create?batch=1';

const UM_TEMPLATE_URL = (date) => `https://sasum.scl.pt/aluguercampos.php?dia=${date}&desporto=`;

function pad(n) {
	return n.toString().padStart(2, '0');
}

// WARNING: Since I was not familiar with the HTMLRewriter, the following function
// was Supported via standard programming aids when asking it to convert our previous Python code at:
// https://github.com/RuiCunhaM/haslab-volleyball-bot/blob/master/packages/volley/create-poll/scrapper.py
// It struggled with the parsing, but with some manual adjustments, it was able to generate this snippet that makes
// sense and works, however, I am still not convinced this is the optimal implementation.
// I suspect this can be improved by reading the docs carefully.
async function getSlots(startDate) {
	const slots = [];
	const todayIndex = startDate.getDay(); // 0 (Sun) to 6 (Sat)

	for (let i = 0; i < 6 - todayIndex; i++) {
		const currDate = new Date(startDate);
		currDate.setDate(startDate.getDate() + i);
		const isoDate = currDate.toISOString().split('T')[0];

		const url = UM_TEMPLATE_URL(isoDate);
		const response = await fetch(url);

		if (!response.ok) {
			continue; // skip if fetch fails
		}

		const context = {
			isNave2: false,
			isMatchingButton: false,
			availableHours: [],
		};

		const targetClass = ['btn', 'btn-primary', 'btn-m', 'btn_reserva'].sort().join(' ');

		const rewriter = new HTMLRewriter()
			.on('div.col-md-6.m-b-30', {
				element() {
					context.isNave2 = false; // reset for each new div
				},
			})
			.on('div.col-md-6.m-b-30 b', {
				text(text) {
					if (text.text.includes('Nave 2')) {
						context.isNave2 = true;
					}
				},
			})
			.on('div.col-md-6.m-b-30 button', {
				element(el) {
					const classAttr = el.getAttribute('class') || '';
					const classList = classAttr.trim().split(/\s+/).sort().join(' ');
					context.isMatchingButton = context.isNave2 && classList === targetClass;
				},
				text(text) {
					if (context.isMatchingButton) {
						context.availableHours.push(text.text.trim());
					}
				},
			});

		await rewriter.transform(response).arrayBuffer(); // force processing

		for (const h of VALID_HOURS) {
			if (context.availableHours.includes(h)) {
				const [hour, minute] = h.split(':').map(Number);
				const startTime = `${pad(hour)}:${pad(minute)}`;
				const endTime = `${pad(hour + 1)}:${pad(minute)}`;

				slots.push({
					startDate: `${isoDate}T${startTime}`,
					endDate: `${isoDate}T${endTime}`,
				});
			}
		}
	}

	return slots;
}

async function createRalllyPoll(env, date, slots) {
	const payload = {
		0: {
			json: {
				disableComments: false,
				hideParticipants: false,
				hideScores: false,
				title: 'Volleyball',
				location: 'Nave 2',
				timeZone: 'Europe/Lisbon',
				requireParticipantEmail: null,
				options: slots,
				description: `Volleyball week ${date}`,
			},
			meta: {
				values: {
					requireParticipantEmail: ['undefined'],
				},
			},
		},
	};

	const createRes = await fetch(RALLLY_CREATE_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: env.RALLLY_COOKIE,
		},
		body: JSON.stringify(payload),
	});

	const result = await createRes.json();

	if (!createRes.ok) {
		console.log(JSON.stringify(result));
		return badCommand();
	}

	const urlId = result[0]?.result?.data?.json?.id;

	return `https://app.rallly.co/invite/${urlId}`;
}

async function createPollInternal(env, date, title, responseUrl) {
	return new Promise(async function(resolve, _) {
		const slots = await getSlots(date);
		const inviteLink = await createRalllyPoll(env, date, slots);

		await sendDiscordMessage(env, title, inviteLink);

		await fetch(responseUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: volleyMessage(title, inviteLink),
		});

		resolve();
	});
}

export async function createPoll(env, ctx, text, responseUrl) {
	let date = new Date();
	let title = 'Rallly for next week!';

	switch (text) {
		case '':
			// NOTE: By default we always want the next Monday, even if today is already Monday
			const nextMonday = new Date(date);
			nextMonday.setDate(date.getDate() + (8 - date.getDay()));
			date = nextMonday;
			break;
		case 'current':
			title = 'Rallly for this week!';
			break;
		default:
			return badCommand();
	}

	ctx.waitUntil(createPollInternal(env, date, title, responseUrl));

	return creatingPoll();
}
