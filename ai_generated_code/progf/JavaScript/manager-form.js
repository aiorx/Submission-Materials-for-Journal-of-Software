/*
    This code is Drafted using common development resources

    This code specifies a dynamic way to create a form with following input types:
        1.text
        2.textarea
        3.select
        4.checkbox
        5.radio
        
*/

function addQuestion(type) {
    const form = document.getElementById("dynamic-form");

    const questionDiv = document.createElement("div");
    questionDiv.className = "form-item";

    const label = document.createElement("label");
    label.className = "question-label";
    label.textContent = "Question:";
    questionDiv.appendChild(label);

    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Enter your question";
    questionDiv.appendChild(questionInput);

    const answerLabel = document.createElement("label");
    answerLabel.className = "question-label";
    answerLabel.textContent = "Answer:";
    questionDiv.appendChild(answerLabel);

    if (type === 'text') {
        const input = document.createElement("input");
        input.type = "text";
        input.name = "textInput";
        input.placeholder = "Enter answer";
        questionDiv.appendChild(input);
    } else if (type === 'textarea') {
        const textarea = document.createElement("textarea");
        textarea.name = "textArea";
        textarea.placeholder = "Enter details";
        questionDiv.appendChild(textarea);
    } else if (type === 'radio' || type === 'checkbox') {
        addOptionInput(questionDiv, type);
    }

    form.appendChild(questionDiv);

    document.getElementById("submit-form").style.display = "block";

}


function addDropdownWidget() {
    const form = document.getElementById("dynamic-form");

    const questionDiv = document.createElement("div");
    questionDiv.className = "form-item";

    const label = document.createElement("label");
    label.className = "question-label";
    label.textContent = "Question:";
    questionDiv.appendChild(label);

    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Enter your question";
    questionDiv.appendChild(questionInput);

    const answerLabel = document.createElement("label");
    answerLabel.className = "question-label";
    answerLabel.textContent = "Answer:";
    questionDiv.appendChild(answerLabel);

    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown-widget";

    const dropdown = document.createElement("select");
    dropdown.name = "dropdownWidget";
    dropdownDiv.appendChild(dropdown);

    const optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Enter option value";
    optionInput.className = "option-input";
    dropdownDiv.appendChild(optionInput);

    const addOptionButton = document.createElement("button");
    addOptionButton.type = "button";
    addOptionButton.textContent = "Add Option";
    addOptionButton.onclick = function () {
        const value = optionInput.value.trim();
        if (value) {
            const option = document.createElement("option");
            option.value = value;
            option.text = value;
            dropdown.appendChild(option);
            optionInput.value = "";
        }
    };

    dropdownDiv.appendChild(addOptionButton);
    questionDiv.appendChild(dropdownDiv);
    form.appendChild(questionDiv);

    // Shows the submit button
    document.getElementById("submit-form").style.display = "block";

}

function addOptionInput(parentElement, type) {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option-input";

    const optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Enter option value";
    optionDiv.appendChild(optionInput);

    const addOptionButton = document.createElement("button");
    addOptionButton.type = "button";
    addOptionButton.textContent = "Add Option";
    addOptionButton.onclick = function () {
        const value = optionInput.value.trim();
        if (value) {
            if (type === 'radio' || type === 'checkbox') {
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.type = type;
                input.name = type + "Option";
                input.value = value;
                label.appendChild(input);
                label.appendChild(document.createTextNode(" " + value));
                parentElement.appendChild(label);
                parentElement.appendChild(document.createElement("br"));
            }
            optionInput.value = "";
        }
    };

    optionDiv.appendChild(addOptionButton);
    parentElement.appendChild(optionDiv);
}
function submitForm() {
    const form = document.getElementById("dynamic-form");
    const jsonData = [];

    const formItems = form.querySelectorAll(".form-item"); // All form items (questions)

    formItems.forEach(item => {
        const questionTextElement = item.querySelector("input[type='text'][placeholder='Enter your question']");
        const questionText = questionTextElement ? questionTextElement.value : ''; // Get question text

        // Determine the question type
        let questionType = '';
        if (item.querySelector("select")) {
            questionType = 'select';
        } else if (item.querySelector("textarea")) {
            questionType = 'textarea';
        } else if (item.querySelector("input[type='radio']")) {
            questionType = 'radio';
        } else if (item.querySelector("input[type='checkbox']")) {
            questionType = 'checkbox';
        } else {
            questionType = 'text';
        }

        const questionData = {
            question: questionText,
            type: questionType,
            options: [],
            answers: []
        };

        // Handle 'select' type
        if (questionType === 'select') {
            const selectOptions = item.querySelectorAll("select option");
            selectOptions.forEach(option => {
                if (option.value) {
                    questionData.options.push(option.value);
                }
            });
        }

        // Handle 'radio' and 'checkbox' types
        if (questionType === 'radio' || questionType === 'checkbox') {
            const inputOptions = item.querySelectorAll(`input[type='${questionType}']`);
            inputOptions.forEach(input => {
                const label = item.querySelector(`label[for='${input.id}']`);
                if (label) {
                    questionData.options.push(label.innerText);
                }
            });
        }

        // Handle 'text' type or any other question type
        if (questionType === 'text' || questionType === 'textarea') {
            const answerInputs = item.querySelectorAll(`input[type='text']:not([placeholder='Enter your question']), textarea`);
            answerInputs.forEach(input => {
                if (input.value) {
                    questionData.answers.push(input.value);
                }
            });
        }

        jsonData.push(questionData);
    });

    // Send JSON data to the backend
    fetch('/submit-form/{{file}}/{{pk}}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // CSRF protection
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
