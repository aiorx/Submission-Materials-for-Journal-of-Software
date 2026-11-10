var React = require('react');
var Form = require('./Form').Form;
var IFields = require('./Form').IFields;
var required = require('./Form').required;
var isEmail = require('./Form').isEmail;
var maxLength = require('./Form').maxLength;
var Field = require('./Field').Field;

const ContactUsForm: React.SFC = function () {
  const fields: IFields = {
    name: {
      id: "name",
      label: "Name",
      validation: { rule: required }
    },
    email: {
      id: "email",
      label: "Email",
      validation: { rule: isEmail }
    },
    reason: {
      id: "reason",
      label: "Reason",
      editor: "dropdown",
      options: ["", "Marketing", "Support", "Feedback", "Jobs"],
      validation: { rule: required }
    },
    notes: {
      id: "notes",
      label: "Notes",
      editor: "multilinetextbox",
      validation: { rule: maxLength, args: 1000 }
    }
  };
  return (
    <Form
      action="http://localhost:4351/api/contactus"
      fields={fields}
      render={() => (
        <React.Fragment>
          <div className="alert alert-info" role="alert">
            Enter the information below and we'll get back to you as soon as we
            can.
          </div>
          <Field {...fields.name} />
          <Field {...fields.email} />
          <Field {...fields.reason} />
          <Field {...fields.notes} />
        </React.Fragment>
      )}
    />
  );
};
