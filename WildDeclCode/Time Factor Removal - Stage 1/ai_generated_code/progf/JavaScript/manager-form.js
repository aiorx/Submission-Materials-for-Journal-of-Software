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
    var form = document.getElementById("dynamic-form");

    var questionDiv = document.createElement("div");
    questionDiv.className = "form-item";

    var label = document.createElement("label");
    label.className = "question-label";
    label.textContent = "Question:";
    questionDiv.appendChild(label);

    var questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Enter your question";
    questionDiv.appendChild(questionInput);

    var answerLabel = document.createElement("label");
    answerLabel.className = "question-label";
    answerLabel.textContent = "Answer:";
    questionDiv.appendChild(answerLabel);

    if (type === 'text') {
        var input = document.createElement("input");
        input.type = "text";
        input.name = "textInput";
        input.placeholder = "Enter answer";
        questionDiv.appendChild(input);
    } else if (type === 'textarea') {
        var textarea = document.createElement("textarea");
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
    var form = document.getElementById("dynamic-form");

    var questionDiv = document.createElement("div");
    questionDiv.className = "form-item";

    var label = document.createElement("label");
    label.className = "question-label";
    label.textContent = "Question:";
    questionDiv.appendChild(label);

    var questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Enter your question";
    questionDiv.appendChild(questionInput);

    var answerLabel = document.createElement("label");
    answerLabel.className = "question-label";
    answerLabel.textContent = "Answer:";
    questionDiv.appendChild(answerLabel);

    var dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown-widget";

    var dropdown = document.createElement("select");
    dropdown.name = "dropdownWidget";
    dropdownDiv.appendChild(dropdown);

    var optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Enter option value";
    optionInput.className = "option-input";
    dropdownDiv.appendChild(optionInput);

    var addOptionButton = document.createElement("button");
    addOptionButton.type = "button";
    addOptionButton.textContent = "Add Option";
    addOptionButton.onclick = function () {
        var value = optionInput.value.trim();
        if (value) {
            var option = document.createElement("option");
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
    var optionDiv = document.createElement("div");
    optionDiv.className = "option-input";

    var optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Enter option value";
    optionDiv.appendChild(optionInput);

    var addOptionButton = document.createElement("button");
    addOptionButton.type = "button";
    addOptionButton.textContent = "Add Option";
    addOptionButton.onclick = function () {
        var value = optionInput.value.trim();
        if (value) {
            if (type === 'radio' || type === 'checkbox') {
                var label = document.createElement("label");
                var input = document.createElement("input");
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
    var form = document.getElementById("dynamic-form");
    var jsonData = [];

    var formItems = form.querySelectorAll(".form-item"); // All form items (questions)

    formItems.forEach(function item {
        var questionTextElement = item.querySelector("input[type='text'][placeholder='Enter your question']");
        var questionText = questionTextElement ? questionTextElement.value : ''; // Get question text

        // Determine the question type
        var questionType = '';
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

        var questionData = {
            question: questionText,
            type: questionType,
            options: [],
            answers: []
        };

        // Handle 'select' type
        if (questionType === 'select') {
            var selectOptions = item.querySelectorAll("select option");
            selectOptions.forEach(option => {
                if (option.value) {
                    questionData.options.push(option.value);
                }
            });
        }

        // Handle 'radio' and 'checkbox' types
        if (questionType === 'radio' || questionType === 'checkbox') {
            var inputOptions = item.querySelectorAll("input[type='" + (questionType) + "']");
            inputOptions.forEach(input => {
                var label = item.querySelector("label[for='" + (input.id) + "']");
                if (label) {
                    questionData.options.push(label.innerText);
                }
            });
        }

        // Handle 'text' type or any other question type
        if (questionType === 'text' || questionType === 'textarea') {
            var answerInputs = item.querySelectorAll("input[type='text']:not([placeholder='Enter your question']), textarea");
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
        .then(function response { return response.json(); })
        .then(function data {
            console.log('Success:', data);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


// Helper function to get CSRF token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
