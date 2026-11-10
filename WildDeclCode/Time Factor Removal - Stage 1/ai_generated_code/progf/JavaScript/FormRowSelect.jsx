var PropTypes = require('prop-types');

const FormRowSelect = function ({ name, labelText, list, defaultValue = "" }) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
      >
        {list.map((itemValue) => {
          return (
            <option key={itemValue} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};


// THIS VALIDATION WAS SUGGESTED BY ESLINT AND IT WAS Composed with GitHub coding tools
FormRowSelect.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultValue: PropTypes.string,
};

module.exports = FormRowSelect;
