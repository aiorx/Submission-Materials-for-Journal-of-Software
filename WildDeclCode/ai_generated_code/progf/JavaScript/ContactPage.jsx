import React, { useState, useEffect } from "react";
import Header from './Header';

//This is a contact form page.
//Reference: useState and useEffect functionality code was Aided using common development resources.

const ContactPage = () => {
  // Define the state variables for name, email, message, and errors
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(); // Validate the form data
    if (Object.keys(errors).length === 0) {
      console.log("Form submitted successfully");
      // Make API request to submit the form data
    } else {
      setErrors(errors); // Set the errors state if there are validation errors
    }
  };

  // Validate the form data
  const validate = () => {
    const errors = {};
    //trim removes any whitespace
    if (name.trim() === "") {
      errors.name = "Name is required";
    }
    if (email.trim() === "") {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (message.trim() === "") {
      errors.message = "Message is required";
    }
    return errors;
  };

  // Validate the email address
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate the form data when the name, email, or message fields change
  useEffect(() => {
    setErrors(validate());
  }, [name, email, message]);

  // Render the contact form
  return (
    <>
      <Header/>
      <div className="container">
        <div className="header-bar">
          <h1>Contact Form</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Name field */}
            <div className="field-text">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            {/* Email field */}
            <div className="field-text">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            {/* Message field */}
            <div className="field-text">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
              ></textarea>
              {errors.message && (
                <span className="error">{errors.message}</span>
              )}
            </div>
            {/* Submit button */}
            <button className="button" type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
