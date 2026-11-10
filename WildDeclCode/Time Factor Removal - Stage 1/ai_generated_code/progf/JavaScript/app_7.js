//class 55

function showSection(params) {
    var elements = document.querySelectorAll('.main_content > div');

    elements.forEach(function (element) {
        element.classList.add('hiden');

    document.getElementById(params + 'Section').classList.remove('hiden')
    });
}

 

// Adapted from standard coding samples

// function showSection(params) {
//     // Select all sections inside .main_content
//     const elements = document.querySelectorAll(".main_content > div");

//     // Hide all sections
//     elements.forEach(data => {
//         data.classList.add("hiden"); // Make sure this class exists in CSS
//     });

//     // Build the ID from the parameter, like "home" -> "homeSection"
//     const targetId = params + "Section";
//     const target = document.getElementById(targetId);

//     // If target section exists, show it
//     if (target) {
//         target.classList.remove("hiden");
//     } else {
//         // "No element found with ID:", targetId
//         console.warn("No element found with ID:", targetId);
//     }
// }

// function showSection(params) {
//   // select all section inside .main_content
//   const array = document.querySelectorAll(".main_content > div");

//   // hide all section use class .hiden by foreach loop
//   array.forEach((element) => {
//     element.classList.add("hiden");

//     // build the id from the parameter, like "home" -> homeSection
//     const targetId = params + "Section";
//     const target = document.getElementById(targetId);

//     //if target section exists, show it
//     if (target) {
//       target.classList.remove("hiden");
//     }
//     // if no element found with id : targetId
//     else {
//       "No element found with ID: ", targetId;
//     }
//   });
// }

/*
function showSection(params) {
    // select all section inside .main_content
    const array = document.querySelectorAll('.main_content > div');

    // hide all section using .hiden class by foreach loop
    array.forEach((element) => {
        element.classList.add('hiden')

    // build the id from parameter like as "home" -> homeSection
        const targetId = params + 'Section'
        const target = document.getElementById(targetId);

    // if target section exists, show it
        if (target) {
            target.classList.remove('hiden')
        }
        // if section not found, show this
        else{
            "No data found Named: ", targetId;
        }
    });
}

*/

// class 60 school settings and notice settings
// setting section

var schoolName = document.getElementById("school_name");
var sidebarName = document.getElementById("sideSchool_name");
var sideSlogan = document.getElementById("side_slogan");

window.onload = function () {
  var schoolSetting = JSON.parse(localStorage.getItem("schoolSetting"));
  // console.log(schoolSetting);

  if (schoolSetting) {
    schoolName.textContent = schoolSetting.schoolName;
    sidebarName.textContent = schoolSetting.sidebarName;
    sideSlogan.textContent = schoolSetting.sideSlogan;
  } else {
    schoolName.textContent = "Our School";
    sidebarName.textContent = "Your School";
    sideSlogan.textContent = "Read by the Name of God";
  }

  var schoolSettings = document.getElementById("schoolSettings");
  schoolSettings.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(e);

    var inputSchoolName = document.getElementById("inputSchoolName").value;
    var schoolSlogan = document.getElementById("schoolSlogan").value;
    var logoUrl = document.getElementById("logoUrl").value;

    var settingData = {
      schoolName: inputSchoolName,
      sidebarName: schoolSlogan,
      logoUrl: logoUrl,
    };

    localStorage.setItem("schoolSetting", JSON.stringify(settingData));

    schoolName.textContent = inputSchoolName;
    sidebarName.textContent = inputSchoolName;
    sideSlogan.textContent = schoolSlogan;
  });
};
// end of setting section

// notice section

var noticeList = document.getElementById("noticesList");
var noticeForm = document.getElementById("noticeForm");

window.addEventListener("DOMContentLoaded", function () {
  renderNotices();

})

noticeForm.addEventListener('submit',function (e) {
    e.preventDefault();
    var noticeTitle = document.getElementById("noticeTitle").value.trim();
    var noticeContent = document.getElementById("noticeContent").value.trim();
    
    var newNotice = {
      id: Date.now(),
      title: noticeTitle,
      content: noticeContent,
    };
    // console.log(newNotice);
    
    var existingNotices =
      JSON.parse(localStorage.getItem("schoolNotices")) || [];
    existingNotices.unshift(newNotice);
    
    localStorage.setItem("schoolNotices", JSON.stringify(existingNotices));
    noticeForm.reset();
    renderNotices();
})

function renderNotices() {
  var savedNotices = JSON.parse(localStorage.getItem("schoolNotices")) || [];

  if (savedNotices.length === 0) {
    noticeList.innerHTML = "<p> No Notices Available </p>";
  }

  savedNotices.forEach(function (element) {
    // console.log(element);
    var newDiv = document.createElement("div");
    newDiv.classList.add("notice_item");

        // curent date in dd/ mm/ yyyy format
        var now = new Date();
        var day = String(now.getDate()).padStart(2, '0');
        var month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        var year = now.getFullYear();
        var formattedDate = "" + (day) + " / " + (month) + " / " + (year) + "";

        // Format time in HH:MM AM/PM
        var hours = now.getHours();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var formattedTime = "" + (hours) + ":" + (minutes) + " " + (ampm) + "";

    newDiv.innerHTML = "
        <h3> " + (element.title) + "</h3>
        <p> " + (element.content) + "</p>
        <h5> Date: " + (formattedDate) + "</h5>
        <h5> Time: " + (formattedTime) + "</h5>
        ";
    noticeList.appendChild(newDiv);
  });
}


// notice section
function renderNotices() {
  var savedNotices = JSON.parse(localStorage.getItem("schoolNotices")) || [];

  // Clear the current list
  noticeList.innerHTML = '';

  if (savedNotices.length === 0) {
    noticeList.innerHTML = "<p>No Notices Available</p>";
    return;
  }

  savedNotices.forEach(function (element) {
    var newDiv = document.createElement("div");
    newDiv.classList.add("notice_item");

    var today = new Date(element.id);
    var date = today.toLocaleDateString();
    var time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    newDiv.innerHTML = "
      <h3>" + (element.title) + "</h3>
      <p>" + (element.content) + "</p>
      <h5>Date: " + (date) + "</h5>
      <h5>Time: " + (time) + "</h5>
    ";

    noticeList.appendChild(newDiv);
  });
}

// admit student section

// DOM Elements
var admitForm = document.getElementById("admitForm");
var studentTable = document.querySelector(".student_table tbody");
var totalStudents = document.querySelector(".total_students");

// Handle Navigation Between Sections
function showSection(sectionId) {
  var sections = document.querySelectorAll(".main_content > div");
  sections.forEach(function section {
    if (section.id === sectionId + "Section") {
      section.classList.remove("hiden");
    } else {
      section.classList.add("hiden");
    }
  });
}

// Handle Form Submission
admitForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  var name = document.querySelectorAll("#studentName")[0].value.trim();
  var cls = document.querySelectorAll("#studentName")[1].value.trim();
  var roll = document.querySelectorAll("#studentName")[2].value.trim();

  if (!name || !cls || !roll) {
    alert("Please fill out all fields.");
    return;
  }

  // Create student object
  var student = {
    id: Date.now(),
    name,
    class: cls,
    roll
  };

  // Store in localStorage
  var existingStudents = JSON.parse(localStorage.getItem("students")) || [];
  existingStudents.unshift(student);
  localStorage.setItem("students", JSON.stringify(existingStudents));

  admitForm.reset();
  showSection("students");
  renderStudents();
});

// Render Students in Table
function renderStudents() {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  studentTable.innerHTML = ""; // Clear existing

  students.forEach(function (student, index) {
    var row = document.createElement("tr");

    row.innerHTML = "
      <td>" + (index + 1) + "</td>
      <td>" + (student.name) + "</td>
      <td>" + (student.class) + "</td>
      <td>" + (student.roll) + '</td>
      <td><button onclick="deleteStudent(' + (student.id) + ')" class="btn">Delete</button></td>
    ';

    studentTable.appendChild(row);
  });

  // Update total student count
  totalStudents.textContent = students.length;
}

// Delete Student
function deleteStudent(id) {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  students = students.filter(function student { return student.id !== id; });
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}

// Initial load
window.addEventListener("DOMContentLoaded", function () {
  renderStudents();
});

function renderStudents() {
  var studentTable = document.querySelector(".student_table tbody");
  studentTable.innerHTML = ""; // Clear existing rows

  var students = JSON.parse(localStorage.getItem("students")) || [];

  students.forEach(function (student, index) {
    var row = document.createElement("tr");

    row.innerHTML = "
      <td>" + (student.id) + "</td>
      <td>" + (student.name) + "</td>
      <td>" + (student.className) + "</td>
      <td>" + (student.roll) + '</td>
      <td>
        <button onclick="editStudent(' + (index) + ')" class="edit_btn">Edit</button>
        <button onclick="deleteStudent(' + (index) + ')" class="delete_btn">Delete</button>
      </td>
    ';

    studentTable.appendChild(row);
  });
}

// Render students on DOM load
window.addEventListener("DOMContentLoaded", function () {
  renderStudents();
});

// Admit form handler
document.getElementById("admitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var name = document.getElementById("studentName").value;
  var className = document.getElementById("studentClass").value;
  var roll = document.getElementById("studentRoll").value;

  var students = JSON.parse(localStorage.getItem("students")) || [];

  var editingIndex = this.dataset.editingIndex;

  if (editingIndex !== undefined) {
    students[editingIndex] = {
      ...students[editingIndex],
      name,
      className,
      roll,
    };
    delete this.dataset.editingIndex;
  } else {
    students.push({
      id: Date.now(),
      name,
      className,
      roll,
    });
  }

  localStorage.setItem("students", JSON.stringify(students));
  this.reset();
  renderStudents();
  showSection("students"); // Optionally go back to student list
});

// Render all students
function renderStudents() {
  var studentTable = document.querySelector(".student_table");
  var tbody = studentTable.querySelector("tbody") || studentTable.appendChild(document.createElement("tbody"));
  tbody.innerHTML = "";

  var students = JSON.parse(localStorage.getItem("students")) || [];

  students.forEach(function (student, index) {
    var row = document.createElement("tr");
    row.innerHTML = "
      <td>" + (student.id) + "</td>
      <td>" + (student.name) + "</td>
      <td>" + (student.className) + "</td>
      <td>" + (student.roll) + '</td>
      <td>
        <button onclick="editStudent(' + (index) + ')" class="edit_btn">Edit</button>
        <button onclick="deleteStudent(' + (index) + ')" class="delete_btn">Delete</button>
      </td>
    ';
    tbody.appendChild(row);
  });
}

// Edit button functionality
function editStudent(index) {
  var students = JSON.parse(localStorage.getItem("students")) || [];
  var student = students[index];

  showSection("admit");

  document.getElementById("studentName").value = student.name;
  document.getElementById("studentClass").value = student.className;
  document.getElementById("studentRoll").value = student.roll;

  document.getElementById("admitForm").dataset.editingIndex = index;
}

// Delete button functionality
function deleteStudent(index) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  var students = JSON.parse(localStorage.getItem("students")) || [];
  students.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}


// update dashboard

function updateDashboard() {
  // Get students from localStorage
  var students = JSON.parse(localStorage.getItem("students")) || [];
  // Get notices from localStorage
  var notices = JSON.parse(localStorage.getItem("schoolNotices")) || [];

  // Update total students count
  var totalStudentsElem = document.querySelector(".total_students");
  if (totalStudentsElem) {
    totalStudentsElem.textContent = students.length;
  }

  // Update latest notice in dashboard
  var dashboardNoticeElem = document.querySelector(".dashboard_notice");
  if (dashboardNoticeElem) {
    if (notices.length === 0) {
      dashboardNoticeElem.innerHTML = "<p>No notices available</p>";
    } else {
      // Assuming notices are ordered newest first
      var latest = notices[0];

      // Format date from id timestamp
      var dateObj = new Date(latest.id);
      var day = String(dateObj.getDate()).padStart(2, '0');
      var month = String(dateObj.getMonth() + 1).padStart(2, '0');
      var year = dateObj.getFullYear();
      var formattedDate = "" + (day) + " / " + (month) + " / " + (year) + "";

      dashboardNoticeElem.innerHTML = "
        <h4>" + (latest.title) + "</h4>
        <p>" + (latest.content) + "</p>
        <small>Date: " + (formattedDate) + "</small>
      ";
    }
  }
}

// Call this function once your app loads and whenever students or notices change
window.addEventListener("DOMContentLoaded", function () {
  updateDashboard();
});