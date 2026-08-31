import translations from "./translations.json";
import {getAuth, signOut} from "firebase/auth";
import {db } from './firebase.js';
import {doc, setDoc,getDoc,updateDoc  } from "firebase/firestore";
import {changePFP} from "./accountFunctions.js"

export function processInput(input) {
  const entries = input.split(",").map(entry => entry.trim());
  return entries;
}
export function changeWheelDesign(var1, var2){
  const entry = { colour1: var1, colour2: var2 };
  localStorage.setItem('ColorDesign', JSON.stringify(entry));

  //Removes all markings
  const allLanguages = document.getElementsByClassName("designSelect");
  for (let i = 0; i < allLanguages.length; i++) {
    const element = allLanguages[i];
    element.style.border = 'none';
  }

  //Marks the Selected Design
  const selectedDesign = document.getElementById(var1 +"/"+ var2);
  selectedDesign.style.border = '2px solid orange';
  location.reload();
}
export function getColorCode(){
  //Retrieve the stored data from localStorage
  var storedColor = localStorage.getItem('ColorDesign');
  var colorCode1;
  var colorCode2;

  if(storedColor){
    var colorObj = JSON.parse(storedColor);
    colorCode1 = colorObj.colour1;
    colorCode2 = colorObj.colour2;
  
    //Marks the Selected Design
    var colorCode = colorObj.colour1 + "/" + colorObj.colour2;
    const selectedDesign = document.getElementById(colorCode);
    selectedDesign.style.border = '2px solid orange';  
  }else{
    colorCode1 = "darkred";
    colorCode2 = "saddlebrown";
  }   

  return { colour1: colorCode1, colour2: colorCode2 };
}
export function sliderchanged(){
  //Set the change in Localstorage
  var range = document.getElementById("uptimeSlider").value;
  localStorage.setItem('UpDuration', range);
  location.reload();
}
export function setSlider(){
  //Loads the saved number from LocalStorage
  var range = document.getElementById("uptimeSlider");
  const x = localStorage.getItem('UpDuration');
  if(x){
    range.value = localStorage.getItem('UpDuration');
    localStorage.setItem('UpDuration', range.value);
  }else{
    range.value = 200;
  }  
}
export function loadoldsegments(){
  //Loads the saved segments from LocalStorage
  var storedSegments = JSON.parse(localStorage.getItem('Segments'));
  var newSegments= [];
  if(storedSegments){
    newSegments.push(...storedSegments);
  }else{
    newSegments.push("Example 1", "Example 2");
  }  
  return newSegments;
}
export function languageChange(languageCode){
  //Sets the selected Language in LocalStorage
  localStorage.setItem('Language', languageCode);
  setLanguage();
}
export function setLanguage(){
  var languageCode = localStorage.getItem('Language');
  const storedSegments = JSON.parse(localStorage.getItem('Segments'));

  //Head Cell of Table
  const element1 = document.getElementById("headCell");
  //Add all Entries Button
  const element2 = document.getElementById("addAll");
  //Remove Entry Button
  const element3 = document.getElementById("deleteInput"); 
  //Segments Counter
  const element4 = document.getElementById("segmentsCounter");
  //Uptime Text
  const element5 = document.getElementById("UptimeID");
  //Design Text
  const element6 = document.getElementById("DesignText");

  element1.innerHTML = translations[languageCode].lastPicks;
  element2.innerHTML = translations[languageCode].addAllEntries;
  element3.innerHTML = translations[languageCode].removeEntry;
  element4.innerHTML = translations[languageCode].segmentCounter + ": " + storedSegments.length;
  element5.innerHTML = translations[languageCode].Uptime;
  element6.innerHTML = translations[languageCode].design;
  
  //Removes all markings
  const allLanguages = document.getElementsByClassName("langSelect");
  for (let i = 0; i < allLanguages.length; i++) {
    const element = allLanguages[i];
    element.style.border = 'none';
  }

  //Marks the Selected Language
  const selectedLanguage = document.getElementById(languageCode);
  selectedLanguage.style.border = '3px solid orange';
}
export function loadOldWins(){
  const storedEntries = JSON.parse(localStorage.getItem('PastEntries'));
  const table = document.getElementById('pastResults');
  table.innerHTML = "";

  //Insert constant Header
  const row = table.insertRow();
  const HeadCell = row.insertCell();
  HeadCell.id = "headCell";
  HeadCell.innerHTML = "Last Picks";

  const userState = getUserStatus();
  if (userState) {
    //A User is signed in
    getAccountEntries()
      .then((retrievedEntries) => {
        retrievedEntries.forEach((entry) => {
          const row = table.insertRow();
          const entryCell = row.insertCell();
          entryCell.id = "entryCell";
          entryCell.innerHTML = entry.Entry || "";
          const dateCell = row.insertCell();
          dateCell.id = "dateCell";
          var date = getFirebaseDateFormat(entry.date);
          dateCell.innerHTML = date;
        });
      })
  }else {
    if(storedEntries){
      //Fill Table
      storedEntries.forEach((entry) => {
      const row = table.insertRow();
      const entryCell = row.insertCell();
      entryCell.id = "entryCell";
      entryCell.innerHTML = entry.content;
      const dateCell = row.insertCell();
      dateCell.id = "dateCell";
      dateCell.innerHTML = getFormattedDate(entry.date);
      });
    }
  }
  
  setLanguage();
}
export function addEntryForLocalSave(content) {
  const userState = getUserStatus();
  if (userState) {
    //A User is signed in
    addEntryToDatabase(content);
  }else {
    //Adds the Entry to LocalStorage
    const currentDate = new Date();
    var storedEntries = JSON.parse(localStorage.getItem('PastEntries'));
    const entry = { content: content, date: currentDate };

    //If the array has more than 5 entries, remove the oldest one
    if(storedEntries){
      if (storedEntries.length >= 5) {
        storedEntries.shift();
      }
    }
    storedEntries.push(entry);
    localStorage.setItem('PastEntries', JSON.stringify(storedEntries));
  }

  //Refreshes the Table
  loadOldWins();
}
export function getUserStatus(){
  const auth = getAuth();
  const user = auth.currentUser;
  return user;
}
export async function addEntryToDatabase(newEntry){
  const userState = getUserStatus();
  const currentDate = new Date();

  //Retrieve the user's document from Firestore
  const userDocRef = doc(db, "users", userState.uid);
  const userDocSnapshot = await getDoc(userDocRef);
  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    const RetrievedEntries = userData.SavedEntries || [];
    const entry = { Entry: newEntry, date: currentDate };

    RetrievedEntries.push(entry);

    //Update the 'Savedentries' field in Firestore
    await updateDoc(userDocRef, { SavedEntries: RetrievedEntries});
  }
}
export async function getAccountEntries(){
  const userState = await getUserStatus(); 
  var RetrievedEntries = [];

  //Retrieve the user's document from Firestore
  const userDocRef = doc(db, "users", userState.uid);
  const userDocSnapshot = await getDoc(userDocRef);
  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    RetrievedEntries = userData.SavedEntries || [];
  }
  return RetrievedEntries;
}
export function fireBaseLogOut(){
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      location.reload();
    })
    .catch((error) => {
    });
}
export function showProfile(){
  const userState = getUserStatus(); 
  //Delete the Account Icon if it exists
  var element = document.getElementById("AccountIcon");
  if (element) {
    element.parentNode.removeChild(element);
  }
  
  //Creates all required Account elements 
  const accountDiv = document.getElementById('accountDiv');
  accountDiv.innerHTML = "";

  const imgElement = document.createElement('img');
  imgElement.src = "src/Images/Account/signout.png"
  imgElement.id = 'LogoutIcon';
  imgElement.className = 'accounticons';
  imgElement.addEventListener('click', fireBaseLogOut);
  accountDiv.appendChild(imgElement);

  const profilePicture = document.createElement('img');
  if(userState.photoURL){
    profilePicture.src = userState.photoURL;
  }
  else{
    profilePicture.src = "src/Images/Account/default-pfp.png"
  }

  profilePicture.addEventListener('click', changePFP);
  profilePicture.id = 'pfp';
  accountDiv.appendChild(profilePicture);

  var fileInput = document.createElement('input');
  fileInput.type = "file";
  fileInput.id = "profilePicInput";
  fileInput.accept ="png,gif,jpg,mov"
  profilePicture.addEventListener('click', function() {
    fileInput.click();
  });
  accountDiv.appendChild(fileInput);
  
  var userInfo = document.createElement('p');
  userInfo.textContent = userState.email;
  userInfo.id = "useremail";
  accountDiv.appendChild(userInfo);
  
  fileInput.addEventListener('change', function(event) {
    changePFP();
  });
} 
export function checkForEmptyLocalStorage(){
  //When there is an Empty LocalStorage all fields are set with the default.
  const isLocalStorageEmpty = Object.keys(localStorage).length === 0;
  if(isLocalStorageEmpty){
    const segments = ["Example 1", "Example 2"];
    const currentDate = new Date();
    const pastEntries = [
      { content: "Example Win", date: currentDate },
      { content: "Example Win2", date: currentDate }
    ];
    const colourdesign = { colour1: "darkred", colour2: "saddlebrown"};
    localStorage.setItem('Segments', JSON.stringify(segments));
    localStorage.setItem('PastEntries', JSON.stringify(pastEntries));
    localStorage.setItem('ColorDesign', JSON.stringify(colourdesign));
    localStorage.setItem('UpDuration', 300);
    localStorage.setItem('Language', "english");
  }
}


//These are Functions Assisted with basic coding tools
export function getFormattedDate(stringDate){
  const currentDate = new Date(stringDate)
  const hour = currentDate.getHours();
  const min = currentDate.getMinutes();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min} | ${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  
  return formattedDate;
}
function getFirebaseDateFormat(timestamp){
const date = timestamp.toDate();
const hours = date.getHours();
const minutes = date.getMinutes();
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
const combined = `${formattedTime} | ${formattedDate}`;
return combined;
}



