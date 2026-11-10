// Designed with routine coding tools 4.0

// Generate 5 random skills (if the user does not have any - PLACEHOLDER DURING TESTING)
var generateRandomSkills = function () {

    // Random names for skills and references
    var skillNames = ['JavaScript', 'Python', 'Project Management', 'Graphic Design', 'Data Analysis'];
    var references = ['Jane Doe', 'John Smith', 'Alex Johnson', 'Chris Lee', 'Sam Morgan'];

    // Random rating generator
    var randomRating = () => Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5

    // Randomize helper function
    var randomElement = (array) => array[Math.floor(Math.random() * array.length)];

    // Empty array to hold skills
    var skills = [];

    // Randomize 5 skills
    for (var i = 0; i < 5; i++) {
        skills.push({
            _id: "dummy-skill-" + (i + 1) + "-" + (Date.now()) + "-" + (Math.random()) + "",
            name: randomElement(skillNames),
            rating: randomRating(),
            reference: randomElement(references)
        });
    }

    return skills;
};

module.exports = generateRandomSkills;
