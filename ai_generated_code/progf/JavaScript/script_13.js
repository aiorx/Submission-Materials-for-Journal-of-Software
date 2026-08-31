// class Crafted with basic coding tools
class Project {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.numFavorites = 0;
    this.numWatching = 0;
    this.numShared = 0;
  }
  favorite() { this.numFavorites++; }
  watch() { this.numWatching++; }
  share() { this.numShared++; }
}
// class Crafted with basic coding tools
class User {
  constructor(username, userhandle, pfpname) {
    this.username = username;
    this.userhandle = userhandle;
    this.pfpname = pfpname;
    this.projects = [];
  }

  addProject(projectOrTitle, description) {
    if (projectOrTitle instanceof Project) {
      this.projects.push(projectOrTitle);
    } else {
      const project = new Project(projectOrTitle, description);
      this.projects.push(project);
    }
  }

  removeProjectByTitle(title) {
    this.projects = this.projects.filter(project => project.title !== title);
  }
}

// function Crafted with basic coding tools
function addCard(title, description) {
  const cardContainer = document.querySelector('.projects__container');

  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.classList.add('box');

  const cardContentDiv = document.createElement('div');
  cardContentDiv.classList.add('card__content');

  const cardTitle = document.createElement('h3');
  cardTitle.classList.add('card__title');
  cardTitle.textContent = title;

  const cardDescription = document.createElement('p');
  cardDescription.classList.add('card__description');
  cardDescription.textContent = description;

  cardContentDiv.appendChild(cardTitle);
  cardContentDiv.appendChild(cardDescription);

  const cardActionsDiv = document.createElement('div');
  cardActionsDiv.classList.add('card__actions');

  const starButton = document.createElement('button');
  starButton.classList.add('card__star-icon', 'star-icon');
  starButton.setAttribute('type', 'button');

  const watchIcon = document.createElement('button');
  watchIcon.classList.add('card__watch-icon', 'watch-icon');
  starButton.setAttribute('type', 'button');

  const shareIcon = document.createElement('button');
  shareIcon.classList.add('card__share-icon', 'share-icon');
  starButton.setAttribute('type', 'button');

  cardActionsDiv.appendChild(starButton);
  cardActionsDiv.appendChild(watchIcon);
  cardActionsDiv.appendChild(shareIcon);

  cardElement.appendChild(cardContentDiv);
  cardElement.appendChild(cardActionsDiv);

  cardContainer.appendChild(cardElement);
}
// made by me
function addAnnouncement(title, description) {
  const announcementContainer = document.querySelector('.announcements__container');

  const announcementElement = document.createElement('div');
  announcementElement.classList.add('announcements__element');

  const annTitle = document.createElement('h3');
  annTitle.textContent = title;

  const annDescription = document.createElement('p');
  annDescription.textContent = description;

  const thematicBreak = document.createElement('hr')

  announcementElement.appendChild(annTitle);
  announcementElement.appendChild(annDescription);

  announcementContainer.appendChild(thematicBreak);
  announcementContainer.appendChild(announcementElement);
}

function addTrending(user, title) {
  const trendingContainer = document.querySelector('.trending__container');

  const trendingElem = document.createElement('div');
  trendingElem.classList.add('trending__element');

  const trendingImg = document.createElement('img');
  trendingImg.classList.add('trending__userimg');
  trendingImg.src = `assets/pictures/${user.pfpname}.png`;

  const trendingProjInfo = document.createElement('div');
  trendingProjInfo.classList.add('trending__project-info');

  const trendingUser = document.createElement('h3');
  trendingUser.textContent = `@${user.userhandle}`;

  const trendingProjTitle = document.createElement('p');
  trendingProjTitle.textContent = title;

  trendingProjInfo.appendChild(trendingUser);
  trendingProjInfo.appendChild(trendingProjTitle);
  trendingElem.appendChild(trendingImg);
  trendingElem.appendChild(trendingProjInfo);

  trendingContainer.appendChild(trendingElem);
}

function startTopbarUI(loggeduser) {
  const topUserImgs = document.querySelectorAll('.topbar__userimg');
  const usernames = document.querySelectorAll('.username');
  const userhandles = document.querySelectorAll('.userhandle');

  topUserImgs.forEach(topUserImg => { topUserImg.src = `assets/pictures/${loggeduser.pfpname}.png`; });
  usernames.forEach(username => { username.textContent = loggeduser.username; });
  userhandles.forEach(userhandle => { userhandle.textContent = loggeduser.userhandle; });
}

// CREATING USERS AND PROJECTS

const loggeduser = new User("Samuel Sousa", "samussd", "user1");
const user2 = new User("Cool Name", "linda", "user2");
const user3 = new User("WWhite", "walter_white", "user3");
const user4 = new User("Alex The Great", "alex", "user4");

const project1 = new Project("Calculator", "Online calculator app with diverse functionality and ability to process advanced expressions.");
const project2 = new Project("Pixel Sketch", "Online pixel art maker with multiple drawing options and color selections. You can change canvas and brush size.")
const project3 = new Project("Very Cool App", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");

loggeduser.addProject(project1);
loggeduser.addProject(project2);
loggeduser.addProject(project3);

// CREATING THE DOCUMENT ELEMENTS

startTopbarUI(loggeduser);

loggeduser.projects.forEach(proj => {
  addCard(proj.title, proj.description);
});

addAnnouncement('Something happened', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.');
addAnnouncement('New changes incoming', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
addAnnouncement('Emergency Alert', 'Wee woo wee woo wee woo wee woo wee woo wee woo wee woo wee woo wee woo wee woo wee woo');

addTrending(user2, "Cool App");
addTrending(loggeduser, "Pixel Sketch");
addTrending(user4, "Even Cooler App");
addTrending(user3, "Crypto Scam App");

// EVENT LISTENERS

const stars = document.querySelectorAll('.star-icon');
const eyes = document.querySelectorAll('.watch-icon');

stars.forEach(starIcon => {
  starIcon.addEventListener('click', function () {
    starIcon.classList.toggle('active');

    const urlSuffix = starIcon.classList.contains('active') ? '' : '-outline';
    starIcon.style.webkitMaskImage = `url('assets/icons/star${urlSuffix}.svg')`;
    starIcon.style.maskImage = `url('assets/icons/star${urlSuffix}.svg')`;
  });
});

eyes.forEach(eyeIcon => {
  eyeIcon.addEventListener('click', function () {
    eyeIcon.classList.toggle('active');

    const urlSuffix = eyeIcon.classList.contains('active') ? '' : '-outline';
    eyeIcon.style.webkitMaskImage = `url('assets/icons/eye${urlSuffix}.svg')`;
    eyeIcon.style.maskImage = `url('assets/icons/eye${urlSuffix}.svg')`;
  });
});