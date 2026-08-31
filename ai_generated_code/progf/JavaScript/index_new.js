import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';

class GirishApp extends HTMLElement {
  connectedCallback() {
    const employeeId = this.getAttribute('employee-id');
    console.log('GirishApp connected with employee ID:', employeeId); // Debugging log
    ReactDOM.render(<Home employeeId={employeeId} />, this);
  }
}

customElements.define('girish-app', GirishApp);

// Aided with basic GitHub coding tools
