// NOTE: this whole section was Formed using common GitHub development resources
// it is contrary to what I suspected but was recommend by copilot and chatGPT
// there is supposed to be a popup when clicking on the information button
// the popup should disappear when clicking anywhere else on the page
// but this doesn't work because of the way React handles events and windows events
// the solution is to use useEffect to add and remove the event listener
// I suspect the error is because of useEffect
import React, {useState, useEffect} from 'react';
import './FileNamer.css';

export default function FileNamer() {
  const [name, setName] = useState(''); // [state, setState
  const [alert, setAlert] = useState(false);

  // this doesn't work 
  useEffect(() => {
    const handleWindowClick = () => setAlert(false)
    if(alert) {
      window.addEventListener('click', handleWindowClick);
    } else {
      window.removeEventListener('click', handleWindowClick)
    }
    return () => window.removeEventListener('click', handleWindowClick);
  }, [alert, setAlert]);
  
  const validate = e => {
    if(/[*]/.test(name)) { // regex test
      // if (value.includes('*')) { // also works
      e.preventDefault();
      setAlert(true);
      e.stopPropagation();
    } else {
      setAlert(false);
      // setName(value);
    }
  }

  return(
    <div className="wrapper">
      <div className="preview">
        <h2>Preview: {name}.js</h2>
      </div>
      <form>
        <label>
          <p>Name:</p>
          <input 
            name="name" 
            onChange={e => setName(e.target.value)}
            // onFocus={e => setAlert(true)}
            // onBlur={e => setAlert(false)}
            autoComplete='off'
          />
        </label>
        <div className="information-wrapper">
          <button
            className="information"
            onClick={() => setAlert(true)}
            // onMouseOver={() => setAlert(true)}
            // onMouseLeave={() => setAlert(false)}
            // onFocus={() => setAlert(true)}
            // onBlur={() => setAlert(false)}
            type="button"
          >
            more information
          </button>
          {alert && 
            <div className='popup'> 
            <span role="img" aria-label="allowed">✅</span> Alphanumeric Characters
            <br />
            <span role="img" aria-label="not allowed">⛔️</span> *</div>}
        </div>
        <div>
          <button onClick={validate}>Save</button>
        </div>
      </form>
    </div>
  )
}