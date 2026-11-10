//first fetch api is Supported via standard GitHub programming aids, others are written by myself

function dragOverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      document.getElementById('file').files = ev.dataTransfer.files;
      uploadFile(); // Call the upload function
  }
}

function getFormattedTimestamp() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
  var day = String(now.getDate()).padStart(2, '0');
  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  var seconds = String(now.getSeconds()).padStart(2, '0');
  return "" + (year) + "-" + (month) + "-" + (day) + "-" + (hours) + "-" + (minutes) + "-" + (seconds) + "";
}

function startConvertingAll() {
  // Implement the conversion logic here
  // Update the download link after the conversion
  var tableBody = document.getElementById('fileList');
  var rows = tableBody.rows;
  for (var i = 0; i < rows.length-1; i++) {
    var convertButton = rows[i].getElementsByTagName('button')[0];
    startConverting.call(convertButton);
  }
}


function startConverting() {
  // Implement the conversion logic here
  // Update the download link after the conversion
  var outputTypeCell = this.parentElement.nextElementSibling;
  var downloadCell = outputTypeCell.nextElementSibling;
  var statusCell = this.parentElement.previousElementSibling;
  statusCell.innerText = 'Converting';
  var fileName= statusCell.id;
  var formData = new FormData();
  formData.append('fileName', fileName);
  formData.append('outputType', outputTypeCell.firstChild.value);
  // formData.append('Debug', 'This is from startConverting function');
  fetch('/ocr/converting', {
    method: 'POST',
    body: formData,
  })
    .then(function response { return response.json(); })
    .then(function data {
      checkStatus(fileName);
      //验证是否存在下载链接
      if (data.outputFile === undefined) {
        downloadCell.innerHTML = 'Fail to convert';
        return;
      }
      // const baseUrl = window.location.origin; // 获取网站的根URL
      // const fullPath = baseUrl + data.outputFile; // 构造完整的文件URL
      downloadCell.innerHTML = '<a href="/ocr/download/' + (data.outputFile) + '" download>Download File</a>';
      // downloadCell.innerHTML = `<a href="${data.outputFile}" download>Download File</a>`;
    })
}

function uploadFile() {
  // Implement the upload logic here
  // Update the progress bar during the upload
  var fileInput = document.getElementById('file');
  // console.log(fileInput.files.length);
  var filesArray = Array.from(fileInput.files); // 将文件对象转换为数组

  var tableBody = document.getElementById('fileList');

  filesArray.forEach(function (file) {
    var formData = new FormData();
    var newFile = new File([file], "" + (getFormattedTimestamp()) + "_" + (file.name) + "", { type: file.type });
    formData.append('file', newFile);
    // formData.append('Debug', 'This is from uploadFile function');
    fetch('/ocr/upload_files', {
      method: 'POST',
      body: formData,
    })
      .then(() => {
        // 开始轮询检查上传状态
        checkStatus(newFile.name);
      })
      .catch(error => console.error('Error:', error));

    // create a new row
    var row = document.createElement('tr');

    // create a new cell for file name
    var fileNameCell = document.createElement('td');
    fileNameCell.textContent = newFile.name; // 设置文件名
    row.appendChild(fileNameCell);

    // create a new cell for status
    var statusCell = document.createElement('td');
    statusCell.textContent = 'Uploading'; 
    statusCell.id = newFile.name;
    row.appendChild(statusCell);

    // create a new cell for convert button
    var convertCell = document.createElement('td');
    var convertButton = document.createElement('button');
    convertButton.textContent = 'Start Converting';
    // set the click event for the convert button
    convertButton.onclick = startConverting;
    convertCell.appendChild(convertButton);
    row.appendChild(convertCell);

    // create a new cell for output type
    var outputTypeCell = document.createElement('td');
    var outputTypeSelect = document.createElement('select');
    fetch('/ocr/api/supported_output_file_types')
      .then(response => response.json())
      .then(data => {
        data.forEach((outputType) => {
          outputTypeSelect.appendChild(new Option(outputType, outputType));
        });
        outputTypeCell.appendChild(outputTypeSelect);
        row.appendChild(outputTypeCell);

        //  create a new cell for download link
        var downloadCell = document.createElement('td');
        row.appendChild(downloadCell);

        // add the new row to the table before the existing last row
        var tableRowNumber = tableBody.rows.length;
        if (tableRowNumber > 0) {
          tableBody.insertBefore(row, tableBody.rows[tableRowNumber - 1]);
        } else {
          tableBody.appendChild(row);
        }
      });
  });
}

function checkStatus(filename) {
  fetch("/ocr/status/" + (filename) + "")
  .then(function response { return response.json(); })
  .then(function data {
      document.getElementById(filename).innerText = "" + (data.status) + "";
      if (data.status === 'Uploading' || data.status === 'Converting') {
          setTimeout(() => checkStatus(filename), 1000);
      }
  })
  .catch(function error { return console.error('Error:', error); });
}