//got help from chatGPT if code didnt work correctly
//got help form old codes
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(bodyParser.json());

//the whole array was Crafted with standard coding tools
let tasks = [
	{ task: 'Einkauf erledigen', autor: 'Max Mustermann', creaDate: '2023-01-15', finDate: '2023-01-18' },
	{ task: 'Präsentation vorbereiten', autor: 'Anna Beispiel', creaDate: '2023-02-01', finDate: '2023-02-10' },
	{ task: 'Sport treiben', autor: 'Erika Musterfrau', creaDate: '2023-03-05', finDate: '2023-03-07' },
	{ task: 'Buch lesen', autor: 'Tom Testperson', creaDate: '2023-04-10', finDate: '2023-04-20' },
	{ task: 'Projekt abschließen', autor: 'Lisa Proben', creaDate: '2023-05-15', finDate: '2023-06-01' },
	{ task: 'Reise planen', autor: 'Paul Planer', creaDate: '2023-07-02', finDate: '2023-07-15' },
	{ task: 'Geburtstagsgeschenk kaufen', autor: 'Alex Aufmerksam', creaDate: '2023-08-20', finDate: '2023-08-25' },
	{ task: 'Sprachkurs beginnen', autor: 'Sarah Sprachliebhaber', creaDate: '2023-09-10', finDate: '2023-10-01' },
	{ task: 'Website aktualisieren', autor: 'Chris Coder', creaDate: '2023-11-05', finDate: '2023-11-15' },
	{ task: 'Familientreffen organisieren', autor: 'Fiona Familienmensch', creaDate: '2023-12-01', finDate: '2023-12-10' }
];

app.get('/tasks', (req, res) => {
	res.json({ tasks });
});

app.post('/tasks', (req, res) => {
	const { task, autor, creaDate, finDate } = req.body;
	//checks if every part of the task is given
	if (!task || !autor || !creaDate || !finDate) {
		return res.status(400).json({ error: 'All fields are required' });
	}
	//help from chatGPT because code didnt work
	const newTask = {
		id: tasks.length + 1,
		task,
		autor,
		creaDate,
		finDate,
	};

	tasks.push(newTask);
	res.status(201).json({ message: 'Task created', task: newTask });
});
//gets the information from the user and checks if they are available
app.get('/tasks/:id', (req, res) => {
	const taskId = parseInt(req.params.id);
	const task = tasks.find(task => task.id === taskId);
	//if this task doesnt exist the status code 404 gets printed
	if (!task) {
		return res.status(404).json({ error: 'Task not found' });
	}

	res.json({ task });
});
//changes an information of the task 
app.patch('/tasks/:id', (req, res) => {
	const keys = Object.keys(req.body);
	const changeTask = tasks.find(task => task.id === parseInt(req.params.id));
	// if the task doesnt get changed the status code 404 gets printed
	if (!changeTask) {
		return res.status(404).json({ error: 'Task not found' });
	}

	keys.forEach(key => {
		changeTask[key] = req.body[key];
	});

	res.json({ message: 'Task updated', task: changeTask });
});
//deletes a task of the arrays
app.delete('/tasks/:id', (req, res) => {
	const taskId = parseInt(req.params.id);
	tasks = tasks.filter(task => task.id !== taskId);
	res.json({ message: 'Task deleted', tasks });
});

app.listen(port, () => {
	console.log(`Bookstore app listening on port ${port}`);
});


