const School = require('./school');

const school = new School();

// register a listener for bellRing event
school.on('bellRing', function ({ period, text }) {
    console.log("We need to run because " + (period) + " " + (text) + "");
});

school.startPeriod();
