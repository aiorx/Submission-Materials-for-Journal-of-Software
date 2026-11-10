/*
    This file handles functions for the View Responses Pgae.
    The View Responses Page is accessed from the Project Management Page
    when the project leader clicks on a specific survey to view data for.
*/


let strCurrentSurveyID = '' // Keep track of what survey data is being viewed for

// Navigates the user to the View Responses page for the clicked survey
function onClickSurvey(strSurveyID) {

    // This is needed because the function is reused for btnSideBarViewProjectData
    // When that button is clicked, no strSurveyID is passed in, because we are
    // already in the correct survey. The current survey is kept track of through
    // the strCurrentSurveyID global variable. 
    if (typeof strSurveyID === "string") {
        strCurrentSurveyID = strSurveyID
    }

    console.log(strCurrentProjectID)

    intCurrentPageId = 3 // change the page id since we are changing pages

    populateMenuPanel(objMenuPanelConfigs.objViewResponsesConfig) // menu panel must be changed since we are changing pages

    clearDashboard()

    addHeaderToDashboard('Project Data')

    // Display bar charts indicating statistics for the survey responses
    displayProjectData(strCurrentSurveyID)

}

function onClickBtnMenuPanelViewGroupData() {
    clearDashboard()
    addHeaderToDashboard("Select Which Group's Data to View")
    const arrGroups = fetchGroups(strCurrentProjectID)
    let arrDashboardData = []
    arrGroups.forEach(group => {
        arrDashboardData.push(
            {
                header: group.name,
                subheader: '',
                uid: group.groupid
            }
        )
    })
    populateDashboard(arrDashboardData, displayGroupResponses)
}

// Displays charts for every likert questions in a given survey
function displayProjectData(strSurveyID) {

    // Find the survey in question. We get strSurveyID from the dashboard element
    fetchProjectLeaderSurveys().then(arrSurveys => {

        const objSurvey = arrSurveys.find(survey => survey.surveyid == strSurveyID) 

        console.log(objSurvey)

        // Get the likert questions
        const arrLikertQuestions = objSurvey.questions.filter(question => question.questionType == 'likert')

        console.log(`Likert Questions: `)
        console.log(arrLikertQuestions)

        // Get the available options for the questions
        const arrLikertOptions = arrLikertQuestions.map(question => question.options)

        console.log(`Likert Options: ${arrLikertOptions}`)
        
        // Create a div for the charts
        const divCharts = document.createElement('div')
        divCharts.id = 'divCharts'
        document.querySelector('#divDashboard').appendChild(divCharts)


        // for loop that iterates over every likert question
        arrLikertQuestions.forEach(question => {
            console.log('Current Question: ');
            console.log(question);

            // Collect all responses for the current question
            let arrResponses = [];
            objSurvey.groupResponses.forEach(group => {
                group.memberResponses.forEach(member => {
                    const answer = member.answers.find(ans => ans.questionid === question.questionid);
                    if (answer) {
                        arrResponses.push(answer.answer); // Collect the answer
                    }
                });
            });
            console.log(`Responses for question "${question.questionText}":`);
            console.log(arrResponses);

            // Count the occurrences of each answer choice. This will be our y-axis.
            const objResponseCount = countResponses(arrResponses);
            console.log("Count of every response: ");
            console.log(objResponseCount);

            // Create the x-axis. This will be the possible responses
            const arrXAxis = createXAxis(objResponseCount);
            console.log('X Axis: ');
            console.log(arrXAxis);

            // Create the y-axis. Occurrences of an answer.
            const arrYAxis = createYAxis(objResponseCount);
            console.log('Y Axis: ');
            console.log(arrYAxis);

            // Name of the series is the question
            const strName = question.questionText;
            console.log(strName);

            // Create a container div for the chart and its header
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container'; // Optional: Add a class for styling

            // Create a header for the chart
            const chartHeader = document.createElement('h2');
            chartHeader.textContent = question.questionText; // Set the header text
            chartHeader.className = 'chart-header'; // Optional: Add a class for styling
            chartContainer.appendChild(chartHeader); // Append the header to the container

            // Create a new div for the chart
            const chartDiv = document.createElement('div');
            chartDiv.id = `chart-${question.questionid}`; // Unique ID for the chart
            chartContainer.appendChild(chartDiv); // Append the chart div to the container

            // Append the container to the main charts div
            document.querySelector('#divCharts').appendChild(chartContainer);

            // Create the chart inside the new div
            createBarChart(arrXAxis, arrYAxis, strName, chartDiv.id);
        })

    });
    
}

function createBarChart(arrXAxis, arrYAxis, strName, chartDivId) {
    const options = {
        chart: {
            type: 'bar'
        },
        series: [{
            name: strName,
            data: arrYAxis
        }],
        xaxis: {
            categories: arrXAxis
        }
    }

    const chart = new ApexCharts(document.querySelector(`#${chartDivId}`), options)
    chart.render()
}


function countResponses(arrResponses) {
    const setPossibleResponses = new Set(arrResponses)
    let objResponseCount = {}
    setPossibleResponses.forEach(option => {

        objResponseCount[option] = 0
        arrResponses.forEach(response => {
            if (response == option) {
                objResponseCount[option] += 1
            }
        })
    })
    return objResponseCount
}

// Get the keys of the object while preserving the order
function createXAxis(objResponseCount) {
    const arrXAxis = Object.keys(objResponseCount)
    return arrXAxis
}

// Get the values of the object while preserving the order
function createYAxis(objResponseCount) {
    const arrYAxis = Object.values(objResponseCount)
    return arrYAxis
}

// This function was Formed using common GitHub development resources
// It's purpose is to show the responses that group members have given to the survey.
// strGroupID is given from the dashboard element
function displayGroupResponses(strGroupID) {
    clearDashboard(); // Clear the dashboard

    // Fetch all surveys
    fetchProjectLeaderSurveys().then(arrSurveys => {

        const objCurrentSurvey = arrSurveys.find(survey => survey.surveyid === strCurrentSurveyID);

        if (!objCurrentSurvey) {
            console.error('Survey not found');
            return;
        }

        const groupResponses = objCurrentSurvey.groupResponses.find(group => group.groupid === strGroupID);

        if (!groupResponses) {
            console.error('Group responses not found for the given group ID.');
            return;
        }

        // Add a header to the dashboard
        addHeaderToDashboard(`Responses for ${groupResponses.groupName}`);

        // Iterate over each member's responses
        groupResponses.memberResponses.forEach(memberResponse => {
            // Create a response card for each member
            const memberCard = document.createElement('div');
            memberCard.className = 'response-card'; // Use the new custom class

            // Add the member's name as the card title
            const memberName = document.createElement('h3');


            memberName.textContent = memberResponse.memberName + " evaluating Frankin Doane";


            // This is just a quick fix to prevent "Franklin Doane evaluating Franklin Doane"
            if (memberResponse.memberName == 'Franklin Doane') {
                memberName.textContent = 'Franklin Doane evaluating Seth Risner'
            }

            memberCard.appendChild(memberName);

            // Iterate over each question in the survey
            objCurrentSurvey.questions.forEach(question => {
                const questionContainer = document.createElement('div');
                questionContainer.className = 'mb-4';

                // Add the question text
                const questionText = document.createElement('p');
                questionText.innerHTML = `<strong>${question.questionText}</strong>`;
                questionContainer.appendChild(questionText);

                // Display options based on question type
                if (question.questionType === 'likert' || question.questionType === 'multipleChoice') {
                    question.options.forEach(option => {
                        const optionLabel = document.createElement('div');
                        optionLabel.classList.add('form-check');

                        // Check if this option was selected by the member
                        const isSelected = memberResponse.answers.some(
                            answer => answer.question === question.questionText && answer.answer === option
                        );

                        optionLabel.innerHTML = `
                            <input class="form-check-input" type="radio" disabled ${isSelected ? 'checked' : ''}>
                            <label class="form-check-label">${option}</label>
                        `;
                        questionContainer.appendChild(optionLabel);
                    });
                } else if (question.questionType === 'shortAnswer') {
                    // Find the member's answer for the short answer question
                    const memberAnswer = memberResponse.answers.find(
                        answer => answer.question === question.questionText
                    );

                    const shortAnswerInput = document.createElement('input');
                    shortAnswerInput.type = 'text';
                    shortAnswerInput.classList.add('form-control');
                    shortAnswerInput.placeholder = 'Short answer text';
                    shortAnswerInput.value = memberAnswer ? memberAnswer.answer : '';
                    shortAnswerInput.disabled = true;
                    questionContainer.appendChild(shortAnswerInput);
                }

                // Append the question container to the member card
                memberCard.appendChild(questionContainer);

                let btnApproveFeedback = document.createElement('button')
                btnApproveFeedback.innerHTML = "Approve Feedback"
                memberCard.appendChild(btnApproveFeedback)
            });

            // Append the member card to the dashboard
            document.querySelector('#divDashboard').appendChild(memberCard);
        });

    }); 
    
}

