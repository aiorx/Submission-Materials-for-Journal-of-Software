//#region map def
const map = new jsVectorMap({
    // world_merc, us_mill_en, us_merc_en,
    // us_lcc_en, us_aea_en, spain
    // russia, canada, iraq
    map: 'world',
    selector: '#map',
    backgroundColor: 'tranparent',
    draggable: false,
    zoomButtons: false,
    zoomOnScroll: false,
    zoomOnScrollSpeed: 3,
    zoomMax: 12,
    zoomMin: 1,
    zoomAnimate: true,
    showTooltip: true,
    zoomStep: 1.5,
    bindTouchEvents: true,
    // Line options
    lineStyle: {
        stroke: '#808080',
        strokeWidth: 1,
        strokeLinecap: 'round'
    },
    focusOn: {},

    markers: null,
    markersSelectable: false,
    markersSelectableOne: false,
    markerStyle: {
        initial: {
            r: 7,
            fill: '#374151',
            fillOpacity: 1,
            stroke: '#FFF',
            strokeWidth: 5,
            strokeOpacity: .5
        },
        hover: {
            fill: '#3cc0ff',
            cursor: 'pointer'
        },
        selected: {
            fill: 'blue'
        },
        selectedHover: {}
    },
    markerLabelStyle: {
        initial: {
            fontFamily: 'Verdana',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'default',
            fill: '#374151'
        },
        hover: {
            cursor: 'pointer'
        },
        selected: {},
        selectedHover: {}
    },

    labels: {
        regions: {
            render(code) {
                return [].indexOf(code) > -1 ? 'x ' : ''
            },
        }
    },
    regionsSelectable: false,
    regionsSelectableOne: false,
    regionStyle: {

        initial: {
            fill: 'rgb(242, 52, 5)',
            fillOpacity: 1,
            stroke: 'none',
            strokeWidth: 0,
            strokeOpacity: 0
        },
        hover: {
            fillOpacity: 1,
            cursor: 'default',
        },
        selected: {
            fill: '#000'
        },
        selectedHover: {}
    },

    regionLabelStyle: {
        initial: {
            fontFamily: 'Verdana',
            fontSize: '12',
            fontWeight: 'bold',
            cursor: 'default',
            fill: 'rgb(247, 181, 60)'
        },
        hover: {
            cursor: 'pointer'
        }
    },
    series: {
        markers: [
            {
                name: 'Palestine',
                coords: [31.5, 34.8],
            },
            {
                name: 'Russia',
                coords: [61, 105],
            },
            {
                name: 'Geenland',
                coords: [72, -42],
            },
            {
                name: 'Canada',
                coords: [56, -106],
            },
        ],
        regions: [

        ]
    },
})

//#endregion
//#region foods arr
const foods = [
    { image: "https://thefoodietakesflight.com/wp-content/uploads/2021/08/Thai-Mango-Sticky-Rice-1-of-7-677x1024.jpg", name: "mango_sticky_rice", description: "Sweet sticky rice topped with ripe mango.", country: "th", price: 2, sweet: 4, sour: 1, salty: 1, bitter: 0, umami: 0, gluten: false, seafood: false, dairy: false, spice: false },
    { image: "https://www.thedevilwearsparsley.com/wp-content/uploads/2020/04/Artsoppa-17-2-1170x617.jpg", name: "ärtsoppa", description: "Traditional Swedish pea soup with ham.", country: "se", price: 2, sweet: 1, sour: 1, salty: 3, bitter: 2, umami: 0, gluten: true, seafood: false, dairy: false, spice: false },
    { image: "https://www.justonecookbook.com/wp-content/uploads/2013/10/Takoyaki-NEW-500x375.jpg", name: "takoyaki", description: "Japanese octopus-filled savory balls.", country: "jp", price: 2, sweet: 1, sour: 2, salty: 3, bitter: 0, umami: 3, gluten: true, seafood: true, dairy: false, spice: false },
    { image: "https://onehappybite.com/wp-content/uploads/2021/06/Taiwanese-Taro-and-Yam-Balls-Dessert-5-edited.jpg", name: "taro_ball_dessert", description: "Sweet dessert made from taro balls and syrup.", country: "tw", price: 2, sweet: 5, sour: 1, salty: 1, bitter: 0, umami: 0, gluten: false, seafood: false, dairy: false, spice: false },
    { image: "https://rachelcooksthai.com/wp-content/uploads/2011/05/Green-Curry-Eggplant-04.jpg", name: "gaeng_keow_wan", description: "Thai green curry with coconut milk and meat.", country: "th", price: 3, sweet: 3, sour: 2, salty: 3, bitter: 0, umami: 3, gluten: true, seafood: false, dairy: true, spice: true },
    { image: "https://www.recipetineats.com/wp-content/uploads/2016/09/Coq-au-Vin_00.jpg?w=900", name: "coq_au_vin", description: "French chicken braised in red wine.", country: "fr", price: 3, sweet: 1, sour: 2, salty: 3, bitter: 1, umami: 3, gluten: false, seafood: false, dairy: true, spice: false },
    { image: "https://www.recipetineats.com/wp-content/uploads/2023/04/Kedgeree_3.jpg?w=900", name: "kedgeree", description: "British dish of rice, fish, and hard-boiled eggs.", country: "gb", price: 2, sweet: 1, sour: 2, salty: 3, bitter: 1, umami: 2, gluten: false, seafood: true, dairy: false, spice: true },
    { image: "https://www.oliveandmango.com/images/uploads/2023_10_10_pastitsio_2.jpg", name: "pastitsio", description: "Greek baked pasta dish with meat and béchamel.", country: "gr", price: 3, sweet: 1, sour: 1, salty: 3, bitter: 1, umami: 2, gluten: true, seafood: false, dairy: true, spice: false },
    { image: "https://ohmydish.com/wp-content/uploads/2016/08/Dutch-escarole-mash-square.jpg", name: "andijviestamppot", description: "Dutch mashed potatoes with endive.", country: "nl", price: 1, sweet: 1, sour: 1, salty: 2, bitter: 3, umami: 0, gluten: false, seafood: false, dairy: true, spice: false },
    { image: "https://www.koreanbapsang.com/wp-content/uploads/2019/12/DSC3431-4.jpg", name: "haemul_pajeon", description: "Korean seafood and green onion pancake.", country: "kr", price: 2, sweet: 1, sour: 2, salty: 3, bitter: 0, umami: 3, gluten: true, seafood: true, dairy: false, spice: true },
    { image: "https://themedivoiceoau.com/wp-content/uploads/2022/11/images-93.jpeg", name: "amala", description: "Nigerian thick paste made from yam flour.", country: "ng", price: 1, sweet: 0, sour: 0, salty: 1, bitter: 1, umami: 0, gluten: false, seafood: false, dairy: false, spice: false },
    { image: "https://feelgoodfoodie.net/wp-content/uploads/2017/06/Fattoush-Salad-10.jpg", name: "fattoush", description: "Levantine salad made from mixed greens and bread.", country: "lb", price: 1, sweet: 2, sour: 3, salty: 2, bitter: 2, umami: 1, gluten: true, seafood: false, dairy: false, spice: true },
    { image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/113777-0b21d44.jpg?quality=90&resize=400,363", name: "curry", description: "Indian spiced dish with meat or vegetables.", country: "in", price: 2, sweet: 1, sour: 2, salty: 3, bitter: 1, umami: 3, gluten: true, seafood: false, dairy: false, spice: true },
    { image: "https://www.koreanbapsang.com/wp-content/uploads/2010/01/DSC5189-3.jpg", name: "japchae", description: "Korean stir-fried glass noodles with vegetables.", country: "kr", price: 2, sweet: 2, sour: 2, salty: 3, bitter: 0, umami: 2, gluten: true, seafood: false, dairy: false, spice: true },
    { image: "https://hips.hearstapps.com/hmg-prod/images/shrimp-sausage-gumbo-index-65130058c85c0.jpg?crop=0.8888888888888888xw:1xh;center,top", name: "gumbo", description: "Louisiana stew with meat, vegetables, and roux.", country: "us", price: 2, sweet: 1, sour: 2, salty: 3, bitter: 1, umami: 3, gluten: true, seafood: true, dairy: false, spice: true },
    { image: "https://www.rainbownourishments.com/wp-content/uploads/2021/02/vegan-lamington-stack.jpg", name: "lamingtons", description: "Australian sponge cake coated in chocolate and coconut.", country: "au", price: 2, sweet: 4, sour: 0, salty: 1, bitter: 0, umami: 0, gluten: true, seafood: false, dairy: true, spice: false },
    { image: "https://i0.wp.com/live.staticflickr.com/65535/49547714652_2ea7f8a09e_b.jpg?resize=1024%2C683&ssl=1", name: "erwtensoep", description: "Dutch split pea soup with pork.", country: "nl", price: 2, sweet: 1, sour: 1, salty: 3, bitter: 1, umami: 2, gluten: false, seafood: false, dairy: false, spice: true },
    { image: "https://assets.bonappetit.com/photos/57adf6d053e63daf11a4e015/1:1/w_2560%2Cc_limit/chicken-khao-soi1.jpg", name: "khao_soi", description: "Northern Thai coconut curry noodle soup.", country: "th", price: 2, sweet: 2, sour: 3, salty: 4, bitter: 0, umami: 3, gluten: true, seafood: false, dairy: false, spice: true },
    { image: "https://cdn.sprinklebakes.com/media/2021/12/Dobos-torte-14.jpg", name: "dobos_torte", description: "Hungarian layer cake with caramel and chocolate.", country: "hu", price: 3, sweet: 4, sour: 1, salty: 1, bitter: 0, umami: 0, gluten: true, seafood: false, dairy: true, spice: false },
    { image: "https://www.unicornsinthekitchen.com/wp-content/uploads/2022/05/manakeesh-zaatar-manakish-sq.jpg", name: "manakish", description: "Levantine flatbread topped with za'atar or cheese.", country: "lb", price: 1, sweet: 0, sour: 1, salty: 3, bitter: 1, umami: 2, gluten: true, seafood: false, dairy: false, spice: true }
];
//#endregion

sweetTotal = sourTotal = saltyTotal = bitterTotal = umamiTotal = 0;
likedTotal = 0;

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffleArray(foods);

var allowGluten, allowSeafood, allowDairy, allowSpice;
allowGluten = allowSeafood = allowDairy = allowSpice = true;

var checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach(function (checkbox) {
    checkbox.checked = true;
    console.log(checkbox.value);
    checkbox.addEventListener('change', function () {
        handleAllergy(this);
    });
});

var options = {
    responsive: false,
    maintainAspectRatio: true,
    scale: {
        ticks: {
            beginAtZero: true,
            max: 5
        }
    },
    elements: {
        line: {
            borderWidth: 3
        }
    },
};

var chrt = document.getElementById("chartId").getContext("2d");
var chartId = new Chart(chrt, {
    type: 'radar',
    data: {
        labels: ["Sweet", "Sour", "Salty", "Bitter", "Umami"],
        datasets: [{
            label: "Current",
            data: [0, 0, 0, 0, 0],
            fill: true,
            backgroundColor: 'rgba(242, 52, 5,0.2)',
            borderColor: 'rgb(242, 52, 5)',
            pointBackgroundColor: 'rgb(242, 52, 5)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(242, 52, 5)'
        }, {
            label: "Preference",
            data: [0, 0, 0, 0, 0],
            fill: true,
            backgroundColor: 'rgba(247, 181, 60,0.2)',
            borderColor: 'rgb(247, 181, 60)',
            pointBackgroundColor: 'rgb(247, 181, 60)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(247, 181, 60)'
        }],
    },
    options
});

function handleAllergy(checkbox) {
    if (checkbox.checked) {
        console.log("Allergy selected: " + checkbox.value);
    } else {
        console.log("Allergy deselected: " + checkbox.value);
    }

    switch (checkbox.value) {
        case "gluten":
            allowGluten = checkbox.checked;
            break;
        case "seafood":
            allowSeafood = checkbox.checked;
            break;
        case "dairy":
            allowDairy = checkbox.checked;
            break;
        case "spice":
            allowSpice = checkbox.checked;
            break;
    }

    var label;
    var elements = document.querySelectorAll('#checkboxHolder');
    elements.forEach(function (element) {
        if (element.innerHTML.includes(checkbox.value)) {
            label = element;
        }
    });

    var labText = label.childNodes[3].innerHTML;
    var newText = "";
    newText += labText.substring(0, labText.search("</i>") + 4);
    if (!checkbox.checked) {
        newText += '<span style="color:#F18C60;">';
    }
    newText += " - " + checkbox.value.toUpperCase()
    if (!checkbox.checked) {
        newText += "</span>";
    }
    label.childNodes[3].innerHTML = newText;
}

var container = document.getElementById("foodContainer");
container.style = 'display:none;';
var chartContainer = document.getElementById("spiderChart");
chartContainer.style = 'display:none;';
var startButton = document.getElementById("startButton");
startButton.addEventListener('click', function () {
    startButton.style = 'display:none;';
    chartContainer.style = 'display:block;';
    container.style = 'display: block;';
    updateFoodDisplay("");
});

var superBtn = document.getElementById("superBtn")
superBtn.addEventListener('click', function () {
    foodMatch(true)
})

//start the program

function generateList() {
    var list = [];
    var sum = 0;
    while (sum != 100) {
        if (sum > 100) {
            sum -= list.shift();
        }
        var randomNum = 1 + Math.floor(Math.random() * 8)
        list.push(randomNum);
        sum += randomNum;
    }

    return list;
}


var resultList = generateList();

var fill = 0;
function progress(direction) {
    fill += resultList.shift();

    var elem = document.getElementById("myBar");
    elem.style.width = fill + "%";
    if (fill <= 100) {
        document.getElementById("percentText").innerHTML = ("<b>" + fill + "%</b> to Match");
    }
    else {
        document.getElementById("percentText").innerHTML = ("<b>" + "100" + "%</b> to Match");
    }
    if (direction === 'right') {
        shootLikes();
    } else if (direction === 'left') {
        shootDislikes();
    }
    if (fill >= 100) {
        
        foodMatch(true)

    }
}

let currentIndex = 0;
let likedFoods = []

function foodMatch(useCurrent) {
    const randomIndex = Math.floor(Math.random() * likedFoods.length);
    const selectedFood = useCurrent ? foods[currentIndex] : likedFoods[randomIndex];
    

    selectedFoodName = selectedFood.name.toUpperCase();
    var foodNameDisplay = document.getElementById("selectedFoodName");
    foodNameDisplay.textContent = replaceUnderscoresWithSpacesAndCapitalize(selectedFoodName);
    
    selectedFoodDescription = selectedFood.description;
    var foodDescriptionDisplay = document.getElementById("selectedFoodDescription");
    foodDescriptionDisplay.textContent = replaceUnderscoresWithSpacesAndCapitalize(selectedFoodDescription);
    
    selectedFoodImageURL = selectedFood.image;
    var foodImage = document.getElementById("popup");
    foodImage.style = "background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5) 50%, black 90%), url(" + selectedFoodImageURL + ");";
    console.log(selectedFoodImageURL)
    openPopup();

    //Confetti taken from codepen created by Andrew Collins
    const canvasEl = document.querySelector('#canvas');

    const w = canvasEl.width = window.innerWidth;
    const h = canvasEl.height = window.innerHeight * 2;

    function loop() {
        requestAnimationFrame(loop);
        ctx.clearRect(0, 0, w, h);

        confs.forEach((conf) => {
            conf.update();
            conf.draw();
        })
    }
    function Confetti() {
        //construct confetti
        const colours = ['#F5952E', '#F45614', '#76b53b'];

        this.x = Math.round(Math.random() * w);
        this.y = Math.round(Math.random() * h) - (h / 2);
        this.rotation = Math.random() * 360;

        const size = Math.random() * (w / 60);
        this.size = size < 15 ? 15 : size;

        this.color = colours[Math.floor(colours.length * Math.random())];

        this.speed = this.size / 7;

        this.opacity = Math.random();

        this.shiftDirection = Math.random() > 0.5 ? 1 : -1;
    }

    Confetti.prototype.border = function () {
        if (this.y >= h) {
            this.y = h;
        }
    }

    Confetti.prototype.update = function () {
        this.y += this.speed;

        if (this.y <= h) {
            this.x += this.shiftDirection / 3;
            this.rotation += this.shiftDirection * this.speed / 100;
        }

        if (this.y > h) this.border();
    };

    Confetti.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, this.rotation, this.rotation + (Math.PI / 2));
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    const ctx = canvasEl.getContext('2d');
    const confNum = Math.floor(w / 4);
    const confs = new Array(confNum).fill().map(_ => new Confetti());

    loop();
}

function swipe(direction) {
    if (direction === 'right') {
        likedFoods.push(foods[currentIndex]);
    }
    updateLikedFoods()
    currentIndex++
    if (currentIndex > foods.length - 1) {
        currentIndex = 0
    }

    var keepGenerating = false;
    do {
        var newFood = foods[currentIndex];
        keepGenerating = (!allowGluten && newFood.gluten) || (!allowSeafood && newFood.seafood) || (!allowDairy && newFood.dairy) || (!allowSpice && newFood.spice);
        if (keepGenerating) {
            currentIndex++;
        }
        if (currentIndex > foods.length - 1) {
            currentIndex = 0;
        }
    } while (keepGenerating);

    updateFoodDisplay(direction);
    progress(direction);
}

let lastSwipeTime = 0;

document.addEventListener('keydown', function (event) {
    const currentTime = new Date().getTime();

    if (currentTime - lastSwipeTime >= 300) {
        if (event.key === 'ArrowLeft') {
            swipe('left');
        } else if (event.key === 'ArrowRight') {
            swipe('right');
        }

        lastSwipeTime = currentTime;
    }
});

function updateDictionary(dict, key) {
    if (dict.hasOwnProperty(key)) {
        dict[key]++;
    } else {
        dict[key] = 1;
    }
}

// let preloadedIndex = 1; // Index for the next image to be displayed

// function preloadNextImage() {
//     if (preloadedIndex >= foods.length) {
//         preloadedIndex = 0; // Loop back to the first image if we reach the end of the array
//     }
//     const preloadedImage = document.getElementById('preloadedImage');
//     preloadedImage.src = foods[preloadedIndex].image; // Set the source for the preloaded image
// }

function updateFoodDisplay(direction) {
    // const currentImage = document.getElementById('currentImage');
    // const preloadedImage = document.getElementById('preloadedImage');
    const dishName = document.getElementById('dishName');
    const description = document.getElementById('description');
    const dishflag = document.getElementById('foodcountry');
    const dollar2 = document.getElementById('dollar2');
    const dollar3 = document.getElementById('dollar3');

    const allergyGluten = document.getElementById('allergyGluten');
    const allergySeafood = document.getElementById('allergySeafood');
    const allergyDairy = document.getElementById('allergyDairy');
    const allergySpice = document.getElementById('allergySpice');

    // currentImage.style.transition = 'transform 0.5s ease-in-out';
    // currentImage.style.transform = `translateX(${direction === 'left' ? '-' : ''}100%)`;

    translation = ''
    if (direction === 'left') {
        translation = 'translateX(-100%)'
    }
    else if (direction == 'right') {
        translation = 'translateX(100%)'
        likedTotal++;
        sweetTotal += foods[currentIndex].sweet;
        sourTotal += foods[currentIndex].sour;
        saltyTotal += foods[currentIndex].salty;
        bitterTotal += foods[currentIndex].bitter;
        umamiTotal += foods[currentIndex].umami;
    }

    currArr = new Array(foods[currentIndex].sweet, foods[currentIndex].sour, foods[currentIndex].salty, foods[currentIndex].bitter, foods[currentIndex].umami);
    chartId.data.datasets[0].data = currArr;
    prefArr = new Array(sweetTotal / likedTotal, sourTotal / likedTotal, saltyTotal / likedTotal, bitterTotal / likedTotal, umamiTotal / likedTotal);
    chartId.data.datasets[1].data = prefArr
    chartId.update()

    let currMulti = [];
let ind = 0;
currArr.forEach(element => {
    currMulti.push([ind++, element]);
});
ind = 0;
let prefMutli = [];
prefArr.forEach(element => {
    prefMutli.push([ind++, element]);
});

    //food preference stuff elan is working on 5/23

    // const spans= []
    // for (let index = 0; index < 4; index++) {
    //     const element = document.getElementById("fpDesc"+index+1)
    //     spans.push(element)
    // }
    // console.log(spans)

    const prefOrder = ["sweet", "sour", "salty", "bitter", "umami"]

    const span1 = document.getElementById("fpDesc1")
    const span2 = document.getElementById("fpDesc2")
    const span3 = document.getElementById("fpDesc3")
    const span4 = document.getElementById("fpDesc4")


    function sortByDistanceFrom2_5(arr) {
        return arr.sort((a, b) => {
            const distanceA = Math.abs(a[0] - 2.5);
            const distanceB = Math.abs(b[0] - 2.5);
            return distanceA - distanceB;
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate a random index between 0 and i
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at index i and j
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // currMulti = sortByDistanceFrom2_5(currMulti)
    // prefMutli = sortByDistanceFrom2_5(prefMutli)
    currMulti = shuffleArray(currMulti)
    prefMutli = shuffleArray(prefMutli)
    currMulti = currMulti.reverse()
    prefMutli = prefMutli.reverse()
    console.log("-----")
    console.log(currMulti)
    console.log(prefMutli)

    // span1.innerText=currArr[0][0]
    // spans[0].innerText = currArr[0]
    span1.innerText=formatPref(currMulti[0][1],currMulti[0][0])
    span2.innerText=formatPref(currMulti[1][1],currMulti[1][0])
    span3.innerText=formatPref(prefMutli[0][1],prefMutli[0][0])
    span4.innerText=formatPref(prefMutli[1][1],prefMutli[1][0])

    function formatPref(num, ind){
        prefix=""
        suffix = prefOrder[ind]
        if(num >= 4){
            prefix = "very"
        }
        else if(num >= 3){
            prefix="a little"
        }
        else if (num <= 2){
            prefix = "not very"
        }
        else if(num<=1){
            prefix = "not"
        }
        return prefix+" "+suffix
    }

    foodImage.style.transform = translation;
    setTimeout(() => {
        // currentIndex = preloadedIndex;
        // preloadedIndex = (preloadedIndex + 1) % foods.length;
        // preloadNextImage();

        // currentImage.src = preloadedImage.src;
        // currentImage.style.transform = 'translateX(0)';

        foodImage.src = foods[currentIndex].image;
        dishName.innerText = replaceUnderscoresWithSpacesAndCapitalize(foods[currentIndex].name);
        dishflag.className = "fi fi-" + foods[currentIndex].country;
        dollar2.style = foods[currentIndex].price >= 2 ? "" : "color: rgba(255, 243, 222, 0.3);";
        dollar3.style = foods[currentIndex].price >= 3 ? "" : "color: rgba(255, 243, 222, 0.3);";
        allergyGluten.style = foods[currentIndex].gluten ? "" : "color: rgba(255, 243, 222, 0.3);";
        allergySeafood.style = foods[currentIndex].seafood ? "" : "color: rgba(255, 243, 222, 0.3);";
        allergyDairy.style = foods[currentIndex].dairy ? "" : "color: rgba(255, 243, 222, 0.3);";
        allergySpice.style = foods[currentIndex].spice ? "" : "color: rgba(255, 243, 222, 0.3);";
        description.innerText = foods[currentIndex].description;
        foodImage.style.transform = 'translateX(0)';
    }, 300);

    tiltFoodContainer(direction)
    
// preloadNextImage();
}

function replaceUnderscoresWithSpacesAndCapitalize(str) {
    let stringWithSpaces = str.replace(/_/g, ' ');

    stringWithSpaces = stringWithSpaces.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });

    return stringWithSpaces;
}

function updateLikedFoods() {
    updateFoodPref("likedFood")
}

function updateFoodPref(name) {
    const likedFoodsContainer = document.getElementById("likedFoods");

    if (name === "likedFood") {
        likedFoodsContainer.innerHTML = '';
        likedFoods.forEach(food => {
            const foodElement = document.createElement('img');
            foodElement.src = food.image;
            foodElement.className = name;
            likedFoodsContainer.appendChild(foodElement);
        });
    }
}

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}


let popup = document.getElementById("popup");

function openPopup() {
    popup.classList.add("open-popup");
    document.querySelector('.container').classList.add('blur-effect');
}
function closePopup() {
    popup.classList.remove("open-popup");
    document.querySelector('.container').classList.remove('blur-effect');
}

function matchDecline() {
    popup.classList.remove("open-popup");
    document.querySelector('.container').classList.remove('blur-effect');
    fill = 70
    progress(true)
}

// Base code Penned via standard programming aids, modified by Bryan
function tiltFoodContainer(direction) {
    const foodContainer = document.getElementById('foodContainer');
    let tiltAngle = 15; // Degree of tilt
    let moveDistance = 80; // Pixels to move horizontally

    if (direction === 'left') {
        // Tilt and move left
        foodContainer.style.transform = `translateX(${-moveDistance}px) rotate(${-tiltAngle}deg)`;
    } else if (direction === 'right') {
        // Tilt and move right
        foodContainer.style.transform = `translateX(${moveDistance}px) rotate(${tiltAngle}deg)`;
    } else {
        // Reset position if direction is not left or right
        foodContainer.style.transform = 'translateX(0) rotate(0deg)';
    }
    setTimeout(() => {
        foodContainer.style.transform = 'rotate(0deg)';
    }, 250);
}

window.onload = function() {
    var canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
    }
};

// document.getElementById('btnRight').addEventListener('click', shootLikes);

// document.addEventListener('keydown', function(event) {
//     if (event.key === 'ArrowRight') {
//       shootLikes();
//     }
//   });

// function shootLikes() {
//   const container = document.getElementById('foodContainer');
//   const button = document.getElementById('btnRight');
//   const rect = button.getBoundingClientRect();
  
//   // Position the container at the side of the button
//   container.style.top = `${rect.top + window.scrollY}px`;
//   container.style.left = `${rect.right + window.scrollX + 200}px`;

//   for (let i = 0; i < 20; i++) {
//     const emoji = document.createElement('div');
//     emoji.classList.add('shootemojis');
//     emoji.innerHTML = getRandomEmoji();
//     emoji.style.left = '0px';
//     emoji.style.top = `${Math.random() * 50}px`;
//     container.appendChild(emoji);

//     // Remove the emoji after animation ends
//     emoji.addEventListener('animationend', () => {
//       emoji.remove();
//     });
//   }
// }

// function getRandomEmoji() {
//   const emojis = ['👍', '♥️', '💖', '💗', '💝'];
//   return emojis[Math.floor(Math.random() * emojis.length)];
// }
