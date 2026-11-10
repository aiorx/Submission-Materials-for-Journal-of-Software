/*
IDEAS

Python script needs to get all pages, not just page 1 (most recent data)
Search works with tribe tag (as well as name)
Add tribe tag
Add flag of the server
Option to average the tribes
Make custom groupings for average?
Custom selectors -> top N in that ranking across the world
API counter
Helper text on checkbox hover
Link text on checkbox to value - remove span and use description attribute?
Animations on hide / show elements?
Thicker line for tribe averages?
Option to hide a selector without deleting it so can toggle on / off without having to find it again

Backend tasks

Detect if a world is closed and remove from config
*/

// Update counter
// Note - I have put an API key here, but this is a free account so you can steal / use my API key but it's
// pretty pointless as it will cost me nothing and you could make your own free account =)
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/counter?id=TW_main&hit=true',
    headers: { 'X-Api-Key': 'tfrjXwZ7ENQ/FwMoOdJZ3g==6Mt1bO9Uksf8o3LO' },
    contentType: 'application/json',
    success: function (result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});

// Constants
var githubLocation = 'https://higamy.github.io/TW/Data';
var availableStatistics = ['Points', 'Rank', 'Villages', 'OD', 'ODA', 'ODD', 'Daily Defend', 'Daily Attack', 'Daily Support', 'Daily Loot Amount', 'Daily Loot Villages', 'Daily Scavenge', 'Combined Income', 'Daily Conquer'];
var colourRandomSeed = 42;

// DOM Elements
var statisticSelector = document.getElementById("statisticSelector");
var statisticsDropdownOptions = document.getElementById("statisticsDropdownOptions");
var serverSelector = document.getElementById("serverSelector");
var serverSelectorDropdownOptions = document.getElementById("serverSelectorDropdownOptions");
var worldSelector = document.getElementById("worldSelector");
var worldSelectorDropdownOptions = document.getElementById("worldSelectorDropdownOptions");

var serverContainerEl = document.getElementById("serverContainer");
var worldContainerEl = document.getElementById("worldContainer");
var graphAdder = document.getElementById("graphAdder");
var tribePopupContainer = document.getElementById("tribePopupContainer");
var plotContainer = document.getElementById("plotContainer");
var selectedGroupsContainer = document.getElementById("selectedGroupsContainer");

var groupTribeDiv = document.getElementById("groupTribeDiv");
var groupTribeCheckbox = document.getElementById("groupTribeCheckbox");
var groupTypeCheckbox = document.getElementById("groupTypeCheckbox");
var groupTypeDiv = document.getElementById("groupTypeDiv");


var serverSelectors = [];
var selectedPlayers = [];
var selectedGroups = [];
var saved_data = {};
var selectedData = {};
var current_data;
var activeGroupSelector;
var activeWorldButton;
var topPlayerData = {};

// Load metric from query string
var selectedMetric = getQueryParam("metric");
if (!selectedMetric) selectedMetric = availableStatistics[0];


console.log(selectedMetric)

var groupTribe = getQueryParam('groupTribe') === "true";
groupTribeCheckbox.checked = groupTribe;

var groupType = getQueryParam('groupType');
if (!groupType) groupType = "total";
groupTypeCheckbox.checked = groupType == "avg";

axios.get("" + (githubLocation) + "/Config/tribes.json")
    .then(function data {
        data = data.data
        console.log(data)

        for (var serverConfig of data.servers) {
            serverSelectors.push(new ServerSelector(serverConfig));
            saved_data[serverConfig['server']] = {}
        }

        // Load the server to use from the query paramter
        var server = getQueryParam('server');

        var loadedServer = false;
        for (var serverSelector of serverSelectors) {

            if (serverSelector.serverConfig.domain_game == server) {
                serverSelector.activateServer();
                loadedServer = true;
                console.log('loaded server', serverSelector)
            }
        }

        // If a server was not found in the query parameter then just load the first one
        if (!loadedServer) { serverSelectors[0].activateServer(); }

    })

// Composed with basic coding tools!
function getDistinctColors(n, seed) {
    var colors = [];
    var i = 0;
    var random = new Math.seedrandom(seed); // initialize the seeded random number generator
    while (colors.length < n) {
        var color = '#' + Math.floor(random() * 16777215).toString(16); // generate a random hex code using the seeded random number generator
        if (color !== '#ffffff' && color !== '#fff' && color !== '#f5f5f5' && color !== '#f8f8f8' && color !== '#fcfcfc') { // check if the color is not close to white
            colors.push(color);
        }
        i++;
        if (i > 1000) { // add a safety net to prevent infinite loop
            break;
        }
    }
    return colors;
}


function getTopNPlayers(n = 10, metric = "current_points") {

    var topPlayers = current_data['players'].sort(function (a, b) {
        return b[metric] - a[metric];
    });

    //new GroupSelector(`Top ${n}`,  topPlayers.slice(0,n), Group.PLAYER).selectGroup(); 

    console.log("result: ", metric, topPlayers.slice(0, n))
    return topPlayers.slice(0, n)
}


class ServerSelector {
    serverConfig
    worldDropDowns
    server

    constructor(serverConfig) {
        this.serverConfig = serverConfig;
        this.server = serverConfig['server'];

        var dropDownOption = new DropDownOption(serverSelector, serverSelectorDropdownOptions, serverConfig['domain_game']);
        dropDownOption.link.addEventListener("click", function () { return this.activateServer(); })
    }

    activateServer() {
        serverSelector.innerHTML = this.serverConfig['domain_game']

        var qryParamWorld = getQueryParam('world');
        var loadedWorld = false;

        worldSelectorDropdownOptions.innerHTML = ""; // Clear previous options
        this.worldDropDowns = []
        for (var world of this.serverConfig.worlds) {
            var dropDownOption = new DropDownOption(worldSelector, worldSelectorDropdownOptions, world);
            this.worldDropDowns.push(dropDownOption);
            dropDownOption.link.addEventListener("click", function () { this.activateWorld(world) })

            if (qryParamWorld == world) {
                dropDownOption.activate();
                this.activateWorld(world);
                loadedWorld = true;
            }
        }



        // If a world was not found in the query parameter then just load the first one
        if (!loadedWorld) {
            this.worldDropDowns[0].activate();
            this.activateWorld(this.serverConfig.worlds[0]);
        }

        resetGraphAdder();
        removeAllSelectedGroups();
        updateQueryParams('server', this.serverConfig['domain_game'])
    }

    activateWorld(world) {
        clearChart();
        resetGraphAdder();
        removeAllSelectedGroups();
        updateQueryParams('world', world)

        // Get the data - if not retrieved already
        new Promise(function (resolve, reject) {

            if (saved_data[this.server][world]) {
                resolve(saved_data[this.server][world]);
            }
            else {
                graphAdder.placeholder = "Loading data, please wait..."
                graphAdder.disabled = true;

                axios.get("" + (githubLocation) + "/" + (this.server) + "/" + (world) + "/tribes.json")
                    .then(data => {
                        data = data.data;

                        // Add total income (farm + scav)
                        for (var player of data.players) {
                            if ((!("Daily Scavenge" in player)) & (!("Daily Loot Amount" in player))) {
                                player['Combined Income'] = Array(player.dates.length).fill(0);
                            }
                            else if ((("Daily Scavenge" in player)) & (!("Daily Loot Amount" in player))) {
                                player['Combined Income'] = player["Daily Scavenge"]
                            }
                            else if ((!("Daily Scavenge" in player)) & (("Daily Loot Amount" in player))) {
                                player['Combined Income'] = player["Daily Loot Amount"]
                            }
                            else {
                                player['Combined Income'] = player["Daily Scavenge"].map((element, index) => {
                                    if (element === null) return null;
                                    else return element + player["Daily Loot Amount"][index];
                                });

                            }

                            player["current_combined income"] = player['Combined Income'].filter(arg => arg != null).slice(-1)[0]
                        }

                        console.log(data);
                        saved_data[this.server][world] = data;

                        current_data = data;

                        // Calculate the data for the top players in each category
                        topPlayerData = {};
                        var n = 10;
                        for (var topPlayerType of availableStatistics) {
                            var matchingTopData = getTopNPlayers(n, "current_" + (topPlayerType.toLowerCase()) + "");
                            var groupName = "Top " + (n) + " " + (topPlayerType) + "";
                            var dataOut = {
                                "Name": groupName,
                                "Data": matchingTopData
                            }
                            topPlayerData[topPlayerType] = dataOut;
                        }


                        // Data has loaded, so enable the search bar again
                        graphAdder.placeholder = "Start typing a player or tribe name..."
                        graphAdder.disabled = false;


                        resolve(data);
                    })
            }
        }).then(function (data) {



            var tribeList = data.tribes.map(function (value) {
                return value.tribe;
            });

            var playerList = data.players.map(function (value) {
                return value.name;
            });

            graphAdder.oninput = () => {
                // Remove the previous tribe elements
                tribePopupContainer.innerHTML = "";

                if (graphAdder.value == "") return;

                // Add Tribes
                var matchingTribes = tribeList.filter((x) => {
                    return x.toLowerCase().includes(graphAdder.value.toLowerCase());
                })


                matchingTribes.forEach((tribe, i) => {
                    // Find the matching tribe in all the data
                    var matchingTribeData = data.tribes.filter((x) => {
                        return x.tribe == tribe;
                    })
                    new GroupSelector(tribe, matchingTribeData[0], Group.TRIBE);
                });


                // Add players
                var matchingPlayers = playerList.filter((x) => {
                    return x.toLowerCase().includes(graphAdder.value.toLowerCase());
                })


                matchingPlayers.forEach((name, i) => {
                    // Find the matching tribe in all the data
                    var matchingPlayerData = data.players.filter((x) => {
                        return x.name == name;
                    })
                    new GroupSelector(name, matchingPlayerData[0], Group.PLAYER);
                });


                // Add top 10
                // Comment out for now as not ready
                //for (let topPlayerType of availableStatistics){
                //    new GroupSelector(topPlayerData[topPlayerType]["Name"], topPlayerData[topPlayerType], Group.TOP_PLAYERS);
                //}
            }

            // Load anything selected in the query string
            var queryParamTribes = getQueryParam('tribes');
            var queryParamPlayers = getQueryParam('players');

            if (queryParamTribes) {
                queryParamTribes = queryParamTribes.split("_");
                queryParamTribes.forEach((tribe, i) => {
                    // Find the matching tribe in all the data
                    var matchingTribeData = data.tribes.filter((x) => {
                        return x.id == tribe;
                    })
                    new GroupSelector(matchingTribeData[0].tribe, matchingTribeData[0], Group.TRIBE).selectGroup();
                });

            }

            // Load anything selected in the query string

            console.log(queryParamPlayers)
            if (queryParamPlayers) {
                queryParamPlayers = queryParamPlayers.split("_");

                queryParamPlayers.forEach((player, i) => {
                    // Find the matching player in all the data
                    var matchingPlayerData = data.players.filter((x) => {
                        return x.id == player;
                    })
                    new GroupSelector(matchingPlayerData[0].name, matchingPlayerData[0], Group.PLAYER).selectGroup();
                });
            }
        })
    }
}

function getQueryParam(paramName) {

    // Get the current URL
    var url = new URL(window.location.href);

    // Get the search parameters
    var searchParams = url.searchParams;

    // Retrieve the parameter value
    //return searchParams.get(paramName).toString().replace("_", ".");
    return searchParams.get(paramName)
}

function updateQueryParams(paramName, paramValue) {
    // Function to update the URL the user is on to have the right query params
    // So that can refresh and the same plot will appear
    // So that can share links with query params set up and plot will show right away


    // Get the current URL
    var url = new URL(window.location.href);

    // Get the search parameters
    var searchParams = url.searchParams;

    // Update or add a parameter
    // If it is empty then delete it
    if (paramValue === "") {
        searchParams.delete(paramName);
    }
    else {
        searchParams.set(paramName, paramValue);
    }

    // Replace the existing query string with the updated parameters
    url.search = searchParams.toString();

    // Create a new history state with the updated URL
    var newUrl = url.href;
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

function removeAllSelectedGroups() {
    console.log("Selected groups", selectedGroups);
    for (var group of selectedGroups.slice().reverse()) {
        group.Container.removeGroup();
    }
    selectedGroups = [];
}

class DropDownOption {
    link
    selector
    text

    constructor(selector, parent, text = "") {
        var newOption = document.createElement("li");
        var newLink = document.createElement("a");
        newLink.setAttribute("class", "dropdown-item");
        newLink.setAttribute("href", "javascript:void(0)");

        newLink.innerHTML = text;

        newLink.addEventListener("click", function () { this.activate() })

        // Build the DOM
        newOption.appendChild(newLink);
        parent.appendChild(newOption);

        // Store properties
        this.link = newLink;
        this.selector = selector;
        this.text = text;
    }

    activate() {
        this.selector.innerHTML = this.text

        /* Need to make subclass of this only for the world selector that stores the server and the world, or just add the below function when the world gets created higher up */

    }


}

class ServerContainer {
    worldSelectorContainer
    serverButton
    server
    worldButtons

    constructor(serverConfig) {
        this.worldButtons = []
        this.server = serverConfig['server']


        var worldSelectorContainer = document.createElement('div');
        this.worldSelectorContainer = worldSelectorContainer;
        worldSelectorContainer.classList.add("even-spacing");
        for (var world of serverConfig.worlds) {
            this.worldButtons.push(new WorldButton(this, world));
        }

        serverButton.addEventListener('click', function () {
            for (var serverSelector of serverSelectors) serverSelector.deactivate();
            this.activate();
        })

        // Build up the DOM        
        worldContainerEl.appendChild(worldSelectorContainer);
        serverContainerEl.appendChild(serverButton);

        // Hide by default
        this.deactivate();
    }

    activate() {
        this.serverButton.classList.remove('btn-secondary');
        this.serverButton.classList.add('btn-primary');
        this.worldSelectorContainer.classList.remove('hidden');
        this.worldButtons[0].activate();
        resetGraphAdder();
    }

    deactivate() {
        this.serverButton.classList.add('btn-secondary');
        this.serverButton.classList.remove('btn-primary');
        this.worldSelectorContainer.classList.add('hidden');
    }

    deactiveAllButtons() {
        for (var button of this.worldButtons) {
            button.deactivate();
        }
    }
}

class SelectedGroupContainer {
    InputGroup
    GroupContainer

    constructor(inputGroup) {
        this.InputGroup = inputGroup;
        console.log(inputGroup);
        var groupContainer = document.createElement('div');
        this.GroupContainer = groupContainer;
        groupContainer.classList.add('groupContainer');

        var groupText = document.createElement('span');
        groupText.classList.add('groupText');
        groupText.innerHTML = inputGroup.Name;

        if (inputGroup.Type == Group.PLAYER) { groupContainer.classList.add("playerContainer") }

        var removeGroupButton = document.createElement('span');
        removeGroupButton.classList.add('removeGroupButton');
        removeGroupButton.innerHTML = '❌';

        removeGroupButton.addEventListener('click', function () {
            this.removeGroup();
        })



        groupContainer.appendChild(groupText);
        groupContainer.appendChild(removeGroupButton);
        selectedGroupsContainer.appendChild(groupContainer);
    }

    removeGroup() {
        console.log("Removing... ", this)

        // Remove this group from the selected ones
        var index = selectedGroups.indexOf(this.InputGroup);
        if (index > -1) {
            selectedGroups.splice(index, 1);
        }


        updatePlayerList();
        resetGraphAdder();
        redrawChart();
        updateGroupsInQueryString();

        // Update UI
        selectedGroupsContainer.removeChild(this.GroupContainer);
    }

}

class WorldButton {
    world
    server
    button
    serverContainer
    data

    constructor(ServerContainer, world) {

        this.serverContainer = ServerContainer;

        var worldButton = document.createElement('button');
        this.button = worldButton
        worldButton.classList.add('btn', 'btn-secondary');
        worldButton.innerHTML = world;

        ServerContainer.worldSelectorContainer.appendChild(worldButton);

        worldButton.addEventListener('click', function () { return this.activate(); })

        this.world = world
        this.server = ServerContainer.server
    }

    activate() {
        clearChart();
        resetGraphAdder();

        this.serverContainer.deactiveAllButtons();

        // Update styles
        this.button.classList.add('btn-info');
        this.button.classList.remove('btn-secondary');

        // Get the data - if not retrieved already
        new Promise(function (resolve, reject) {

            if (this.data) {
                resolve('Data loaded from previous save.');
            }
            else {
                axios.get("" + (githubLocation) + "/" + (this.server) + "/" + (this.world) + "/tribes.json")
                    .then(data => {
                        data = data.data;
                        console.log(data);
                        this.data = data;
                        resolve('Data retrieved via XHR.');
                    })
            }
        }).then(function (message) {
            //console.log(message);
            var tribeList = this.data.tribes.map(function (value) {
                return value.tribe;
            });
            //console.log(tribeList);

            graphAdder.oninput = () => {
                // Remove the previous tribe elements
                tribePopupContainer.innerHTML = "";

                if (graphAdder.value == "") return;

                var matchingTribes = tribeList.filter((x) => {
                    return x.toLowerCase().startsWith(graphAdder.value.toLowerCase());
                })


                matchingTribes.forEach((tribe, i) => {
                    // Find the matching tribe in all the data
                    var matchingTribeData = this.data.tribes.filter((x) => {
                        return x.tribe == tribe;
                    })
                    new GroupSelector(tribe, matchingTribeData[0]);
                });
            }
        })

    }

    deactivate() {
        // Update styles
        this.button.classList.remove('btn-info');
        this.button.classList.add('btn-secondary');
    }
}

function resetGraphAdder() {
    graphAdder.value = "";
    var event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    graphAdder.dispatchEvent(event);
}

function clearChart() {
    plotContainer.innerHTML = "";
}

var Group = {
    TRIBE: "tribe",
    PLAYER: "player",
    TOP_PLAYERS: "top players"
}

class GroupSelector {
    Name
    Data
    PlayerData
    Container

    // Is this group already selected?
    get Selected() {
        for (var group of selectedGroups) {
            if (group.Data == this.Data) return true;
        }
        return false
    }

    constructor(Name, Data, Type) {
        this.Name = Name;
        this.Data = Data;
        this.Type = Type;


        // Below for tribes, will need other logic for other types of selector
        if (Type == Group.TRIBE) {
            this.PlayerData = current_data.players.filter(function (x) {
                return x.tribe == Data.id;
            });
        }
        else if (Type == Group.PLAYER) {
            this.PlayerData = [Data];
        }
        else if (Type == Group.TOP_PLAYERS) {
            this.PlayerData = Data.Data;
        }

        var tribePopup = document.createElement("div");
        tribePopup.classList.add("tribe-popup");

        var groupIcon = document.createElement('span');
        groupIcon.classList.add("typeIcon");

        switch (Type) {
            case Group.PLAYER:
                groupIcon.classList.add("playerIcon");
                tribePopup.classList.add("group-popup-player");
                break;
            case Group.TRIBE:
                groupIcon.classList.add("tribeIcon");
                break;
        }

        tribePopup.appendChild(groupIcon);

        // Highlight if already on the plot
        if (this.Selected) tribePopup.classList.add("tribe-popup-selected");

        // Add the span with the name
        var nameSpan = document.createElement("span");
        nameSpan.innerHTML = Name;
        tribePopup.appendChild(nameSpan);


        tribePopupContainer.appendChild(tribePopup);

        tribePopup.addEventListener("click", function () { this.selectGroup() })
    }


    selectGroup() {

        // Don't select the group if it is already selected
        if (this.Selected) return;


        selectedGroups.push(this);
        activeGroupSelector = this;
        this.Container = new SelectedGroupContainer(this);
        updatePlayerList();
        resetGraphAdder();
        redrawChart();
        updateGroupsInQueryString();
    }


}

function updatePlayerList() {

    selectedPlayers = []
    for (var group of selectedGroups) {

        if ((group.Type == Group.TRIBE) & (groupTribe)) {

            // ** Make a date list of all dates **
            var allDates = [];

            for (var playerData of group.PlayerData) {
                allDates = allDates.concat(playerData.dates)
            }

            // Make unique
            allDates = [...new Set(allDates)];

            // Sort
            allDates.sort(function (a, b) {
                return a - b;
            });


            var aggregateDict = {
                "name": group.Name,
                "dates": allDates
            }

            for (var statistic of availableStatistics) {
                var aggregateVals = [];

                for (var dateVal of allDates) {
                    var aggregateVal = null;
                    for (var playerData of group.PlayerData) {
                        var dateIndex = playerData.dates.indexOf(dateVal);

                        if ((dateIndex > -1) & (statistic in playerData)) {
                            if (playerData[statistic][dateIndex] !== null) {
                                aggregateVal = aggregateVal + playerData[statistic][dateIndex]
                            }
                        }
                    }

                    if ((groupType == "avg") & (aggregateVal !== null)) aggregateVal = aggregateVal / group.PlayerData.length;

                    aggregateVals.push(aggregateVal);
                }


                // Assign the aggregate value back to the object
                aggregateDict[statistic] = aggregateVals;
            }

            Array.prototype.push.apply(selectedPlayers, [aggregateDict]);
            console.log("aggregateDict", aggregateDict);
        }
        else {
            Array.prototype.push.apply(selectedPlayers, group.PlayerData);
        }
    }

    // Remove duplicates
    selectedPlayers = [...new Set(selectedPlayers)];

    current_metric_name = "current_" + (selectedMetric.toLowerCase()) + ""

    // Return the data sorted by current points
    selectedPlayers.sort(function (a, b) {
        return b[current_metric_name] - a[current_metric_name];
    });

    console.log("selectedPlayers", selectedPlayers)
    selectedData = []
    for (var player of selectedPlayers) {
        var player_data = []

        if (selectedMetric in player) {
            console.log("Metric found", selectedMetric)
            for (var i = 0; i < player.dates.length; i++) {
                player_data.push([player.dates[i], player[selectedMetric][i]])
            }
            selectedData.push({
                name: player.name,
                data: player_data
            });
        }

    }
    console.log("selectedData", selectedData)

}

groupTribeCheckbox.addEventListener("change", function () {
    groupTribe = groupTribeCheckbox.checked;
    updateQueryParams("groupTribe", groupTribe);
    console.log(groupTribe)

    // The grouping type only makes sense to be visible if grouping is being used.
    if (groupTribe) groupTypeDiv.classList.remove("hidden"); else groupTypeDiv.classList.add("hidden");

    updatePlayerList();
    redrawChart();
})

groupTypeCheckbox.addEventListener("change", function () {
    groupType = (groupTypeCheckbox.checked) ? "avg" : "total";
    updateQueryParams("groupType", groupType);

    updatePlayerList();
    redrawChart();
})


function updateGroupsInQueryString() {

    var players = [];
    var tribes = [];

    for (var group of selectedGroups) {
        if (group.Type == Group.TRIBE) tribes.push(group.Data.id); else players.push(group.Data.id);
    }

    updateQueryParams("players", players.join("_"));
    updateQueryParams("tribes", tribes.join("_"));
}

var layoutVal;
var alignVal;
var verticalAlign;

function redrawChart() {
    if (!activeGroupSelector) {
        return;
    }
    clearChart();

    // If no data, then show nothing
    if (selectedPlayers.length == 0) return;

    // How many groups are there
    var numGroups = selectedGroups.length;

    var playerCount = selectedGroups.reduce(function (count, obj) {
        if (obj.Type === Group.PLAYER) {
            return count + 1;
        }
        return count;
    }, 0);


    var tribeCount = selectedGroups.reduce(function (count, obj) {
        if (obj.Type === Group.TRIBE) {
            return count + 1;
        }
        return count;
    }, 0);


    var specialGroupCount = numGroups - playerCount - tribeCount;

    // Show the option to group tribes, only if at least 1 tribe is selected
    if (playerCount == numGroups) groupTribeDiv.classList.add("hidden"); else groupTribeDiv.classList.remove("hidden");

    // Title text signifying what groups / players are present
    var titleText;
    if ((numGroups == 1) && (tribeCount == 1)) {
        titleText = "" + (selectedGroups[0].Data.tribe) + ""
    }
    else if ((numGroups == 1) && (playerCount == 1)) {
        titleText = "" + (selectedGroups[0].Name) + ""
    }
    else if ((numGroups > 1) && (playerCount == 0)) {
        titleText = "" + (numGroups) + " Tribes"
    }
    else if ((numGroups > 1) && (tribeCount == 0)) {
        titleText = "" + (numGroups) + " Players"
    }
    else if ((playerCount == 0) && (tribeCount == 0) && (specialGroupCount == 1)) {
        titleText = "" + (selectedGroups[0].Name) + ""
    }
    else if ((playerCount == 0) && (tribeCount == 0) && (specialGroupCount > 1)) {
        titleText = "" + (numGroups) + " Special Groups"
    }
    else {
        titleText = "" + (playerCount) + " Player, " + (tribeCount) + " Tribes"
    }


    titleText = titleText + " (" + (selectedMetric) + ")"

    var windowWidth = window.innerWidth;
    if (windowWidth > 850) {
        layoutVal = 'vertical';
        alignVal = 'right';
        verticalVal = 'middle';
    }
    else {
        layoutVal = 'horizontal';
        alignVal = 'center';
        verticalVal = 'bottom';
    }

    Highcharts.chart('plotContainer', {
        chart: {
            type: 'spline',
            zoomType: 'xy',
            height: 600
        },

        colors: getDistinctColors(selectedData.length, colourRandomSeed),

        subtitle: {
            text: 'Created by higamy'
        },

        yAxis: {
            title: {
                text: selectedMetric
            }
        },
        title: {
            text: titleText
        },

        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },

        legend: {
            layout: layoutVal,
            align: alignVal,
            verticalAlign: verticalVal,
            floating: false
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },

        series: selectedData,

        responsive: {
            rules: [{
                condition: {

                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            marker: {
                                radius: 2.5
                            }
                        }
                    }
                }
            }]
        }

    });
}

// Set up the drop down to select the statistic
for (var statistic of availableStatistics) {
    var dropDownOption = new DropDownOption(statisticSelector, statisticsDropdownOptions, statistic);

    dropDownOption.link.addEventListener("click", function () {
        selectedMetric = statistic;
        updateQueryParams("metric", statistic);
        updatePlayerList();
        redrawChart();
    })

    if (selectedMetric == statistic) { dropDownOption.activate() };
}