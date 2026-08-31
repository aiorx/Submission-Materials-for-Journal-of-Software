let amount = document.getElementById("amount");
let catagery  =document.getElementById("category");
let date = document.getElementById("date");
let btn = document.querySelector(".btn");
let tBody = document.getElementById("tBody");

let catInp = document.getElementById("cat-inp");
let catBtn = document.getElementById("catBtn");

let totalAmt = document.getElementById("totalAmountMsg");
let totalRem = document.getElementById("totalRemainMsg");
let totalExp = document.getElementById("totalExpenseMsg");

let budgetInp = document.getElementById("budget-inp");
let budgetSub = document.getElementById("budget-btn");

let catOption = document.getElementById("tableCategoryDropdown");
let getDate = document.getElementById("checkDate");

let storeToatalAmt = 0;
let storeToataRemaining = 0;

totalAmt.innerHTML = `Total Amount:`;
totalRem.innerHTML = `Total Remaining`;
totalExp.innerHTML = `Total Expense`;


let existingData = JSON.parse(localStorage.getItem('expenses')) || [];

//category add ..............................
catBtn.addEventListener("click" , () =>{
    let  optionValue = catInp.value.trim();

    let allOption  = document.getElementById("category");
    let allOptionText = [];

    let allOptt = allOption.querySelectorAll("option");
    allOptt.forEach(item =>{
        allOptionText.push(item.textContent) ;
    })
 

    if(allOptionText.includes(optionValue)){
        alert("this category is already exist");
    }else{
        let createOpt = document.createElement( "option");
        createOpt.innerHTML = optionValue;
        allOption.appendChild(createOpt);
        catInp.value="";
        allOptionText.push(optionValue);
        localStorage.setItem("categories", JSON.stringify(allOptionText));
    }

    let showCatTable = document.getElementById("tableCategoryDropdown");
    let createOptionTable = document.createElement("option");
    createOptionTable.classList.add("headerOption");
    let getCatData = JSON.parse(localStorage.getItem("categories"));
    getCatData.map(item =>{
        createOptionTable.innerHTML = item;
        showCatTable.appendChild(createOptionTable);
    })
})

//load the category inside myTable>>>>>>>>>>>>>>>>>>>>
function loadStoredCat(){
    let showCatTable = document.getElementById("tableCategoryDropdown");
    let createOptionTable = document.createElement("option");
    createOptionTable.classList.add("headerOption");

    let getCatData = JSON.parse(localStorage.getItem("categories"));
    getCatData?.map(item =>{
        createOptionTable.innerHTML = item;
        showCatTable.appendChild(createOptionTable);
    })
}
//budget track....
budgetSub.addEventListener("click" , () =>{
    storeToatalAmt = budgetInp.value;
    updateBalance(existingData);
    budgetInp.value = "";
})

// Function to calculate and update total, remaining, and expense
function updateBalance(expenses) {
    let total = 0;
    let expense = 0;

    // Calculate total and expense
    expenses.forEach(item => {
        let amt = Number(item.amount);
        total += amt;
        expense += amt;
    });

    // Calculate remaining balance
    let remaining = storeToatalAmt - expense;
    storeToataRemaining = remaining;

    // Update HTML elements
    totalAmt.innerHTML = `Total Amount: ${storeToatalAmt}`;
    totalRem.innerHTML = `Total Remaining: ${remaining}`;
    totalExp.innerHTML = `Total Expense: ${expense}`;
}


// Event listener for adding an item into table...................
btn.addEventListener("click", function updateItem(e){
    e.preventDefault();

       // Generate a unique ID for the expense
       let Uid;
       function generateUid(){
           var id = "id" + Math.random().toString(16).slice(2);
           Uid = id ;
       }
       generateUid();

    let amoutnValue = amount.value;
    let catageryValue = catagery.value;
    let dateValue = date.value;

    let totalExpense = calculateTotalExpense(existingData);
    let remainingBalance = storeToatalAmt - totalExpense;

    if (Number(amoutnValue) > remainingBalance) {
        alert("Entered amount exceeds your remaining balance. Please enter a smaller amount.");
    } else {
        // Create an object for the expense
        let expense = {
            id: Uid,
            amount: amoutnValue,
            category: catageryValue,
            date: dateValue
        };

        // Clear input fields
        amount.value = "";
        catagery.value = "";
        date.value = "";

        // Add data to localStorage
        addToLocalStorage(expense);
    }
});

//update item end Derived using common development resources>>>>>>>>>>>>>>>>>>>>>
// Function to calculate total expense
function calculateTotalExpense(expenses) {
    let total = 0;
    expenses.forEach(item => {
        let amt = Number(item.amount);
        total += amt;
    });
    return total;
}




// Display data from localStorage when the page loads
window.addEventListener('load', (e) => {
    displayDataFromLocalStorage(existingData);
    loadStoredCat();
});

// Adding Data to LocalStorage
function addToLocalStorage(data) {
    // Retrieve existing data from localStorage
    let existingData = JSON.parse(localStorage.getItem('expenses')) || [];
    // Add new data to existing data
    existingData.push(data);
    // Store updated data back into localStorage
    localStorage.setItem('expenses', JSON.stringify(existingData));

    updateBalance(existingData);
    displayDataFromLocalStorage(existingData);
    
    
}

// Displaying Data from LocalStorage
function displayDataFromLocalStorage(data) {
    // Iterate over existing data and create table rows to display 
    updateBalance(data);
    tBody.innerHTML = "";
    let total =0;
    // if(storeToataRemaining < 0){
    //     alert("Out of budget");
    //     existingData.forEach(item => {
    //         let row = document.createElement('tr');
    //         row.innerHTML = `
    //             <td id="amt">${item.amount}</td>
    //             <td id="cat">${item.category}</td>
    //             <td id="date">${item.date}</td>
    //             <td class="actions">
    //                 <a href="#"  class="edit-item" title="Edit">Edit</a>
    //                 <a href="#"  class="remove-item" title="Remove">Remove</a>
    //             </td>
    //             <td style="display:none;" id='id'> ${item.id}</td>
    //         `;
    //         tBody.appendChild(row); // Assuming tBody is your table body element
    //         total += Number(item.amount);

    //         updateBalance(existingData);
    
    //     });
    // }
    data.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td id="amt">${item.amount}</td>
            <td id="cat">${item.category}</td>
            <td id="date">${item.date}</td>
            <td class="actions">
                <a href="#"  class="edit-item" title="Edit">Edit</a>
                <a href="#"  class="remove-item" title="Remove">Remove</a>
            </td>
            <td style="display:none;" id='id'> ${item.id}</td>
        `;
        tBody.appendChild(row); // Assuming tBody is your table body element
        total += Number(item.amount);

        updateBalance(data);

    });
    

 

    let tFoot = document.getElementById("tFoot");
    let tFoodTr = document.createElement("tr");
    let tFootTd = document.createElement("td");

    tFootTd.colSpan = "4";
    tFootTd.innerHTML = `Total is: ${total}`;
    tFoot.innerHTML = "";
    tFoot.appendChild(tFoodTr).appendChild(tFootTd);

}

//filter json data based on the cat>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let tableCategory = document.getElementById("tableCategoryDropdown");
let tableCategoryOpt = tableCategory.querySelectorAll("option");
tableCategory.addEventListener("change" , (event) =>{   
    tBody.innerHTML = "";
    let selectCat = event.target.value.toLowerCase();

    let getData = JSON.parse(localStorage.getItem("expenses"));
    let filterArr = getData.filter(item => item.category == selectCat);

    if(selectCat==='category'){
        displayDataFromLocalStorage(getData);

    }else{
        displayDataFromLocalStorage(filterArr);
    }    
})


//filter json data based on the date>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let tableDate = document.getElementById("checkDate");
tableDate.addEventListener('change' , (event) =>{
    tBody.innerHTML = "";
    let dateVAl = event.target.value;

    let getData = JSON.parse(localStorage.getItem("expenses"));
    let filterArr = getData.filter(item => item.date == dateVAl);

    if(!dateVAl){
        displayDataFromLocalStorage(getData);

    }else{
        displayDataFromLocalStorage(filterArr);
    }   

})


//Remove the item from table>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-item")) {
         event.preventDefault();
        let allData = JSON.parse(localStorage.getItem("expenses")|| []);
        let currentRow = event.target.closest("tr");
        let currentRowId = currentRow.querySelector("#id").textContent.trim();

        let removeArr = allData.filter(item => item.id !== currentRowId);

         localStorage.setItem("expenses" , JSON.stringify(removeArr));
        let updatedData = JSON.parse(localStorage.getItem("expenses"));

        tBody.innerHTML = "";
        displayDataFromLocalStorage(updatedData)
      
    }
});


//updatign the item form table.................................>>>>>>>>>>>>>>

document.addEventListener("click" , (event) =>{
    // event.preventDefault();
    if(event.target.classList.contains("edit-item")){
        let currentRow = event.target.closest("tr");
        let currentId = currentRow.querySelector("#id").textContent.trim();

        let curAmt = currentRow.querySelector("#amt").textContent;
        let curCat = currentRow.querySelector("#cat").textContent;
        let curDate = currentRow.querySelector("#date").textContent;

        amount.value = curAmt;
        catagery.value = curCat;
        date.value = curDate;

        let updateBtn =document.getElementById('updateBtn');
        updateBtn.style.display ="flex";
        btn.style.display ="none";
        
        updateBtn.addEventListener("click" , function updateItem(e){
            e.preventDefault();
            if(amount.value > storeToataRemaining || amount.value == "" || catagery.value == "Select Category" || !date.value){
                alert("Entered amount is greater or Enter valid value" );
            }else{
                let allData = JSON.parse(localStorage.getItem('expenses')) || [];
                let index = allData.findIndex((i) => i.id == currentId);
            
                allData[index].amount = amount.value;
                allData[index].category  = catagery.value;
                allData[index].date = date.value;
            
                localStorage.setItem("expenses", JSON.stringify(allData))
            
                tBody.innerHTML = "";
                displayDataFromLocalStorage(allData);
                updateBtn.style.display ="none";
            
                // Reset input fields
                amount.value = "";
                catagery.value = "";
                date.value = "";
            
                btn.style.display = "flex"; 
                updateBtn.removeEventListener("click", updateItem);
            }

        });
        
    }
});
