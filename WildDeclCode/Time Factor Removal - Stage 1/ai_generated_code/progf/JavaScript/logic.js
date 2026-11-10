// Developed by PREETish Ranjan
// https://pritishranjan.com

//function to call recursively for schema generation
function prepare_from_object(obj) {
  // console.log("Parsing ", obj, "Typs is: ", typeof obj);
  if (typeof obj == "string") {
    return "StringType()";
  } else if (typeof obj == "number") {
    return "IntegerType()";
  } else if (typeof obj != "object") {
    return null;
  } else if (obj == null) {
    return "StringType()";
  }
  var schema = "StructType([0])";
  var fieldNames = Object.keys(obj);
  var schema_str = [];
  fieldNames.forEach(function (v, i) {
    var fieldName;
    if (lower_case.checked == true) {
      fieldName = v.toLowerCase();
    } else {
      fieldName = v;
    }
    if (typeof obj[v] == "string") {
      schema_str.push("StructField('" + (fieldName) + "',StringType(),True)");
    } else if (typeof obj[v] == "boolean") {
      schema_str.push("StructField('" + (fieldName) + "',BooleanType(),True)");
    } else if (typeof obj[v] == "number") {
      schema_str.push("StructField('" + (fieldName) + "',IntegerType(),True)");
    } else if (Array.isArray(obj[v])) {
      var array_schema = "StructField('" + (fieldName) + "',ArrayType(0),True)";
      var get_new_schema = prepare_from_object(obj[v][0]);
      array_schema = array_schema.replace("0", get_new_schema);
      schema_str.push(array_schema);
    } else if (typeof obj[v] == "object") {
      var obj_schema = prepare_from_object(obj[v]);
      var obj_schema_inside_struct_field = "StructField('" + (fieldName) + "'," + (obj_schema) + ",True)";
      schema_str.push(obj_schema_inside_struct_field);
    }
  });

  schema = schema.replace("0", schema_str.join(","));

  return schema;
}
// generate string only schema from CSV
function generate_string_only_schema(columns) {
  var schema = [];
  var colName;
  columns.forEach(function (val) {
    if (lower_case.checked == true) {
      colName = val.trim().toLowerCase();
    } else {
      colName = val.trim();
    }

    schema.push("StructField('" + (colName) + "',StringType(),True),");
  });
  var schema_cols = schema.join("\n");
  var schema_string = "StructType([" + (schema_cols) + "])";
  return "schema = " + schema_string;
}
// get column details from a CSV
// This is Assisted with basic coding tools 3.5
// Modified by Me
function get_column_details(csvData) {
  var lines = csvData.trim().split("\n");

  var header = lines[0].split(",");

  var columnDataTypes = header.map(function (columnName, columnIndex) {
    columnName = columnName.trim();

    var columnValues = lines
      .slice(1)
      .map((line) => line.split(",")[columnIndex].trim());

    var isNumeric = columnValues.every((value) => !isNaN(value));

    var isDate = columnValues.every((value) => !isNaN(Date.parse(value)));

    if (isNumeric) {
      return { name: columnName, type: "numeric" };
    } else if (isDate) {
      return { name: columnName, type: "date" };
    } else {
      return { name: columnName, type: "string" };
    }
  });
  console.log(
    "Column Names and Data Types:",
    typeof columnDataTypes,
    columnDataTypes
  );
  return columnDataTypes;
}

// Generate schema by refering the types
function generate_type_based_schema(columnDetails) {
  console.log("Column Details: ", typeof columnDetails);
  var schema = [];
  var colName;
  columnDetails.forEach(function (val) {
    if (lower_case.checked == true) {
      colName = val.name.trim().toLowerCase();
    } else {
      colName = val.name.trim();
    }
    var colName = val.name.trim().toLowerCase();
    schema.push("StructField('" + (colName) + "'," + (get_spark_type(val.type)) + ",True),");
  });
  var schema_cols = schema.join("\n");
  var schema_string = "StructType([" + (schema_cols) + "])";
  return "schema = " + schema_string;
}

// It returns the Spark type of a value
// Not much types are supported now.
// This is to be improved for more types support
function get_spark_type(type_name) {
  switch (type_name) {
    case "numeric":
      return "IntegerType()";
    case "date":
      return "TimestampType()";
    case "string":
      return "StringType()";
    default:
      return "StringType()";
  }
}

// Default Values for JSON
var default_json = [
  "{",
  '"id":21,',
  '"name":"PREETish",',
  '"project":"PySpark Schema Generator",',
  '"details":',
  "{",
  '"link":"https://preetranjan.github.io/pyspark-schema-generator/",',
  '"developer":"Pritish Ranjan"',
  "}",
  "}",
];
var default_csv = ["id,name,address,mobile"];
// https://stackoverflow.com/questions/9236314/how-do-i-synchronize-the-scroll-position-of-two-divs/9236351

//HTML Element References
var isSyncingLeftScroll = false;
var isSyncingRightScroll = false;
var leftDiv = document.getElementById("left");
var rightDiv = document.getElementById("right");

// Input Type Options
var input_type_select = document.getElementById("input_type");
var output_type_select = document.getElementById("output_type");
var header_only = document.getElementById("headerOnly");
var has_data = document.getElementById("hasData");
var string_only = document.getElementById("string_only");
var infer_types = document.getElementById("infer_types");

var original_case = document.getElementById("original");
var lower_case = document.getElementById("lower_case");

var additional_message = document.getElementById("additional_message");

//Variable for Bootstrap Modal
//This is for Schema Generation Options
var options_modal = new bootstrap.Modal(
  document.getElementById("staticBackdrop"),
  {
    backdrop: "static",
  }
);
has_data.addEventListener("change", function () {
  console.log(has_data.checked);
  if (has_data.checked == false) {
    string_only.checked = true;
    infer_types.checked = false;
  } else {
    string_only.checked = false;
    infer_types.checked = true;
    additional_message.textContent = "";
  }
});

infer_types.addEventListener("change", function () {
  if (has_data.checked == false && infer_types.checked == true) {
    string_only.checked = true;
    infer_types.checked = false;
    additional_message.textContent = "Can not refer types for header only CSV.";
  } else if (has_data.checked == true && infer_types.checked == true) {
    additional_message.textContent = "";
  } else {
    additional_message.textContent = "";
  }
});

var isJson = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    //Error
    //JSON is not okay
    return false;
  }

  return true;
};
//Generate button
var generate_button = document.getElementById("btn-generate");
generate_button.addEventListener("click", function () {
  var input_json = editor.getValue();
  if (isJson(input_json) && input_type_select.value == "CSV") {
    throw Error(
      "Seems like you have given a JSON and selected CSV as input type. Please select JSON as Input Type."
    );
    return;
  }
  if (input_type_select.value == "JSON" && output_type_select.value == "PYS") {
    var input_json_object = JSON.parse(input_json);
    var generated_schema = prepare_from_object(input_json_object);
    var tryFormat = generated_schema.split("True),").join("True),  \n");
    outputEditor.getModel().setValue(tryFormat);
  } else if (
    input_type_select.value == "CSV" &&
    output_type_select.value == "PYS"
  ) {
    // console.log(
    //   "Has Data: ",
    //   has_data.checked,
    //   "Header Only: ",
    //   header_only.checked,
    //   "String Only: ",
    //   string_only.checked,
    //   "Infer Types: ",
    //   infer_types.checked
    // );
    var generated_schema = "";
    if (header_only.checked == true && has_data.checked == false) {
      var csv_cols = input_json.split("\n")[0].split(",");
      console.log(csv_cols);
      generated_schema = generate_string_only_schema(csv_cols);
    } else if (header_only.checked == true && has_data.checked == true) {
      var csv_cols = input_json.split("\n")[0].split(",");
      console.log(csv_cols);
      var col_details = get_column_details(input_json);
      generated_schema = generate_type_based_schema(col_details);
    }
    console.log(generated_schema);
    outputEditor.getModel().setValue(generated_schema);
    //throw Error("CSV Schema generation is coming soon!");
  } else if (
    input_type_select.value == "CSV" &&
    output_type_select.value == "PYS" &&
    header_only.checked == true &&
    has_data.checked == true
  ) {
  } else {
    throw Error("Feature Coming Soon!");
  }
});

//Generate Button in the Modal
var generate_button_2 = document.getElementById("btn-gen");
generate_button_2.addEventListener("click", function () {
  options_modal.hide();
  generate_button.click();
});

//Copy Button for copying the data into clipboard
var copyButton = document.getElementById("btncopy");
copyButton.addEventListener("click", function (event) {
  var inputJson = document.getElementById("input-area").value;
  navigator.clipboard.writeText(inputJson);
  console.log(event.target.innerText);
  event.target.innerText = "Copied";
});

//Format the JSON
function formatJsonArea(element) {
  var inputJson = document.getElementById(element);

  var formatedJson = JSON.stringify(JSON.parse(inputJson.value), null, 4);

  inputJson.value = formatedJson;
}

//Function to copy to clipboard
function copyToClipBoard(element) {
  var inputJson = document.getElementById(element).value;
  navigator.clipboard.writeText(inputJson);
}
//toast options
//toast code
var toastEl = document.getElementById("liveToast");
var option = { autohide: true, delay: 2000 };
var toast = new bootstrap.Toast(toastEl, option);
//window error
window.onerror = function (error) {
  console.log(error);
  var el = document.getElementById("toast-body");
  el.innerText = error.toString();
  toast.show();
};
//Code for Monaco editor
//require config
require.config({
  baseUrl:
    "https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/",
});
//editor section
var editor, outputEditor;
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("container"), {
    value: default_json.join("\n"),
    language: "json",
    autoIndent: true,
  });

  //output python editor
  outputEditor = monaco.editor.create(
    document.getElementById("output_container"),
    {
      value: ["# Your Pyspark Schema Will be generated here! \n \n \n \n"].join(
        "\n"
      ),
      language: "python",
    }
  );

  //code
  var outputFormatButton = document.getElementById("btnoutput_format");

  outputFormatButton.addEventListener("click", function () {
    // outputEditor
    //   .getModel()
    //   .setValue(outputEditor.getValue().split("True),").join("True),  \n"));
    // outputEditor.trigger("editor", "editor.action.formatDocument");
    var formattedCode = autoIndentCode(outputEditor.getModel().getValue());
    // console.log(formattedCode.then((data) => console.log(data)));
    console.log(formattedCode);
    // outputEditor.getModel().setValue(formattedCode);
  });
});

var formatButton = document.getElementById("btnformat");

formatButton.addEventListener("click", function () {
  editor.trigger("editor", "editor.action.formatDocument");
});

//generic function to be used later
function formatEditor(editor) {
  //trigger format action
  editor.trigger("editor", "editor.action.formatDocument");
}

var copyButton = document.getElementById("btncopy");
copyButton.addEventListener("click", function (event) {
  var inputJson = editor.getValue();
  navigator.clipboard.writeText(inputJson);
  event.target.innerText = "Copied";
});

var copyButton = document.getElementById("btncopy2");
copyButton.addEventListener("click", function (event) {
  //throw Error("Custom Error Message!");
  var inputJson = outputEditor.getValue();
  navigator.clipboard.writeText(inputJson);
  event.target.innerText = "Copied";
});
window.onload = function () {
  editor.trigger("editor", "editor.action.formatDocument");
};

input_type_select.addEventListener("change", function () {
  var model = editor.getModel();
  var csv_options = document.getElementById("csv_options");
  if (input_type_select.value == "CSV") {
    monaco.editor.setModelLanguage(model, "text");

    csv_options.style.display = "block";

    //SET Default value for CSV
    //editor.getModel().setValue(default_csv.join(", \n"));
  } else if (input_type_select.value == "JSON") {
    monaco.editor.setModelLanguage(model, "json");
    editor.getModel().setValue(default_json.join("\n"));
    editor.trigger("editor", "editor.action.formatDocument");
    csv_options.style.display = "none";
  }
});
