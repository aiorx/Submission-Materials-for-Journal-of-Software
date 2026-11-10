var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home');

class GirishApp extends HTMLElement {
  connectedCallback() {
    const employeeId = this.getAttribute('employee-id');
    console.log('GirishApp connected with employee ID:', employeeId); // Debugging log
    ReactDOM.render(<Home employeeId={employeeId} />, this);
  }
}

customElements.define('girish-app', GirishApp);

// Aided with basic GitHub coding tools
