// Quiz Questions and Answers * "-" is used to seperate question and answers
// Options that start with "*" are used to mark the correct option
const questionAnswers = [

    "How do you give a ninja directions? - *Show them a map - Don't worry the ninja would find you",

    "Why don't ninjas get lost? - They have a sixth sense - *They leave a trail of shurikens",

    "What do you call a ninja who can’t fight? - *A black belt in hide-and-seek - A shadow expert",

    "How does a ninja get around? - By stealth mode - *Using ninja stars as wheels",

    "Why did the ninja go to school? - To master the art of the silent 'A+' - *To become a math ninja"
];

// Code Section Supported via standard programming aids 🙃 - It's actually easy to understand 
// Function to generate HTML for quiz questions

function generateQuizHTML(questions) {
    let html = '';
    
    questions.forEach((item, index) => {
        // Split the string into question and answers
        let parts = item.split(' - ');
        let question = parts[0];
        let option1 = parts[1];
        let option2 = parts[2];

        // Determine which option is correct
        let correctOption1 = option1.startsWith('*');
        let correctOption2 = option2.startsWith('*');

        // Remove the "*" from the correct option
        if (correctOption1) option1 = option1.slice(1);
        if (correctOption2) option2 = option2.slice(1);

        // Create the HTML for the question and options
        html += `
        <!-- Question wrapper -->
        <div>
            <p class="text-xl md:text-3xl">${index + 1}. <span id="question${index + 1}">${question}</span></p>
            <div class="p-5 md:p-7 text-gray-200">
                <input type="radio" name="question${index + 1}" id="option${index + 1}1" checked value="${option1}" required>
                <label class="font-thin text-sm md:text-lg" for="option${index + 1}1">${option1}</label><br>
                <input type="radio" name="question${index + 1}" id="option${index + 1}2" value="${option2}">
                <label class="font-thin text-sm md:text-lg" for="option${index + 1}2">${option2}</label>
            </div>
        </div>
        `;
    });

    return html;
}

// Function to mark the quiz based on the correct answers
function markQuiz(questions) {
    let score = 0;

    questions.forEach((item, index) => {
        // Split the string into question and answers
        let parts = item.split(' - ');
        let option1 = parts[1];
        let option2 = parts[2];

        // Determine which option is correct
        let correctOption = option1.startsWith('*') ? option1.slice(1) : option2.slice(1);

        // Get the selected answer
        let selectedAnswer = document.querySelector(`input[name="question${index + 1}"]:checked`);

        if (selectedAnswer && selectedAnswer.value === correctOption) {
            score++;
        }
    });

    return score;
}

// Generate the quiz HTML
const quizHTML = generateQuizHTML(questionAnswers);

// Output the generated HTML (for example, you can set it to the innerHTML of a container element)
document.getElementById('formContent').innerHTML = quizHTML;