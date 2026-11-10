/*
  survey.js

  This contains all the necessary logic for updating, submitting, marshalling, and unmarshalling the survey data.

  This is basically all Assisted with basic coding tools, and I really don't care. I hate frontend stuff.
*/

class SelectQuestion {
  constructor(selectedOptions = []) {
    this.selectedOptions = selectedOptions;
  }

  marshal() {
    if (this.selectedOptions.length > 255) {
      throw new Error('Too many options');
    }
    var numOptions = this.selectedOptions.length;
    var bitVectorSize = Math.ceil(numOptions / 8);
    var bitVector = new Uint8Array(bitVectorSize);
    this.selectedOptions.forEach(function (selected, i) {
      if (selected) {
        var byteIndex = Math.floor(i / 8);
        var bitPosition = 7 - (i % 8);
        bitVector[byteIndex] |= 1 << bitPosition;
      }
    });
    var payload = new Uint8Array(1 + bitVectorSize);
    payload[0] = numOptions;
    payload.set(bitVector, 1);
    return payload;
  }

  unmarshal(data) {
    if (!(data instanceof Uint8Array)) {
      throw new Error('Data must be a Uint8Array');
    }
    var offset = 0;
    if (data.length <= offset) {
      throw new Error('No data');
    }
    var numOptions = data[offset++];
    var bitVectorSize = Math.ceil(numOptions / 8);
    if (data.length < offset + bitVectorSize) {
      throw new Error('Invalid payload length');
    }
    var bitVector = data.slice(offset, offset + bitVectorSize);
    this.selectedOptions = new Array(numOptions);
    for (var i = 0; i < numOptions; i++) {
      var byteIndex = Math.floor(i / 8);
      var bitPosition = 7 - (i % 8);
      this.selectedOptions[i] = (bitVector[byteIndex] & (1 << bitPosition)) !== 0;
    }
  }
}

class SelectAllThatApplyQuestion extends SelectQuestion {
  constructor(selectedOptions = []) {
    super(selectedOptions);
  }

  marshal() {
    return super.marshal();
  }

  unmarshal(data) {
    super.unmarshal(data);
  }
}

class MultipleChoiceQuestion extends SelectQuestion {
  constructor(selectedOptions = []) {
    super(selectedOptions);
  }

  marshal() {
    var numSelected = this.selectedOptions.filter(Boolean).length;
    if (numSelected > 1) {
      throw new Error('Multiple options selected');
    }
    return super.marshal();
  }

  unmarshal(data) {
    super.unmarshal(data);
  }
}

class TextEntryQuestion {
  constructor(text = '') {
    this.text = text;
  }

  marshal() {
    var textEncoder = new TextEncoder();
    var textBytes = textEncoder.encode(this.text);
    if (textBytes.length > 255) {
      throw new Error('Text too long');
    }
    var payload = new Uint8Array(1 + textBytes.length);
    payload[0] = textBytes.length;
    payload.set(textBytes, 1);
    return payload;
  }

  unmarshal(data) {
    if (!(data instanceof Uint8Array)) {
      throw new Error('Data must be a Uint8Array');
    }
    var offset = 0;
    if (data.length <= offset) {
      throw new Error('No data');
    }
    var textLength = data[offset++];
    if (data.length < offset + textLength) {
      throw new Error('Invalid payload length');
    }
    var textDecoder = new TextDecoder();
    this.text = textDecoder.decode(data.slice(offset, offset + textLength));
  }
}

class Survey {
  constructor(version = 1, questions = {}) {
    this.version = version;
    this.questions = questions; // { id: Question }
  }

  marshal() {
    var buffers = [];
    buffers.push(Uint8Array.of(this.version));
    var questionIds = Object.keys(this.questions).map(function id { return parseInt(id); });
    buffers.push(Uint8Array.of(questionIds.length));

    questionIds.forEach(function id {
      var question = this.questions[id];
      var questionType;
      var data;

      if (question instanceof MultipleChoiceQuestion) {
        questionType = 0;
        data = question.marshal();
      } else if (question instanceof SelectAllThatApplyQuestion) {
        questionType = 1;
        data = question.marshal();
      } else if (question instanceof TextEntryQuestion) {
        questionType = 2;
        data = question.marshal();
      } else {
        throw new Error("Unknown question type for question ID " + (id) + "");
      }

      if (data.length > 255) {
        throw new Error("Question data too long for question ID " + (id) + "");
      }
      var header = Uint8Array.of(id, questionType, data.length);
      buffers.push(header);
      buffers.push(data);
    });

    var totalLength = buffers.reduce(function (sum, b) { return sum + b.length; }, 0);
    var payload = new Uint8Array(totalLength);
    var offset = 0;
    buffers.forEach(function buffer {
      payload.set(buffer, offset);
      offset += buffer.length;
    });
    return payload;
  }

  unmarshal(data) {
    if (!(data instanceof Uint8Array)) {
      throw new Error('Data must be a Uint8Array');
    }
    if (data.length < 2) {
      throw new Error('Data too short');
    }
    var offset = 0;
    this.version = data[offset++];
    var numQuestions = data[offset++];
    this.questions = {};

    for (var i = 0; i < numQuestions; i++) {
      if (offset + 3 > data.length) {
        throw new Error('Invalid question data header');
      }
      var id = data[offset++];
      var qType = data[offset++];
      var qLen = data[offset++];

      if (offset + qLen > data.length) {
        throw new Error("Question payload is too short for id " + (id) + "");
      }
      var qData = data.slice(offset, offset + qLen);
      offset += qLen;

      var question;
      switch (qType) {
        case 0:
          question = new MultipleChoiceQuestion();
          break;
        case 1:
          question = new SelectAllThatApplyQuestion();
          break;
        case 2:
          question = new TextEntryQuestion();
          break;
        default:
          throw new Error("Unknown question type " + (qType) + "");
      }

      question.unmarshal(qData);
      this.questions[id] = question;
    }
  }
}

function updateSurvey(survey) {
  for (var [id, question] of Object.entries(survey.questions)) {
      var questionID = "question_" + (id) + "";

      if ((question instanceof MultipleChoiceQuestion) || (question instanceof SelectAllThatApplyQuestion)) {
          var inputs = document.getElementsByName(questionID);
          inputs.forEach(function (box, index) {
              box.checked = question.selectedOptions[index] || false;
          });
      } else if (question instanceof TextEntryQuestion) {
          var input = document.getElementsByName(questionID)[0];
          if (input) {
              input.value = question.text;
          }
      }
  }
}

async function submitSurvey() {
  var surveyData = parseSurvey();
  var data = surveyData.marshal();

  try {
      var response = await fetch('/survey/update', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/octet-stream',
          },
          body: data,
      });

      if (response.ok) {
          var responseText = await response.text();
      } else {
          console.error('Server returned an error:', response.statusText);
      }
  } catch (error) {
      console.error('Failed to submit survey:', error);
  }
}
