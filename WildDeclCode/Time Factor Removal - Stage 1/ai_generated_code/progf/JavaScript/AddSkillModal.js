// Designed with routine coding tools 4.0

var _import = require('react');

var AddSkillModal = function ({ onClose, onSave, contacts }) {
  var [newSkill, setNewSkill] = useState({
    name: '',
    rating: '',
    reference: '' // Initially no contact is selected
  });

  var handleChange = (e) => {
    var name = e.target.name;
var value = e.target.value;
    setNewSkill({ ...newSkill, [name]: value });
  };

  var handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...newSkill,
      // Ensure the reference is sent as null if "N/A" is selected
      reference: newSkill.reference || null
    });
    onClose(); // Close the modal after save
  };

  return (
    <div className="skills-page__modal-backdrop">
      <div className="skills-page__modal skills-page__modal--add" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <form onSubmit={handleSubmit} className="skills-page__modal-form">
          <div className="skills-page__modal-header">
            <h2 id="modalTitle">Add New Skill</h2>
          </div>
          <div className="skills-page__modal-body">
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" name="name" value={newSkill.name} onChange={handleChange} required />
  
            <label htmlFor="rating">Rating:</label>
            <input id="rating" type="number" name="rating" min="1" max="5" value={newSkill.rating} onChange={handleChange} required />
  
            <label htmlFor="reference">Reference:</label>
            <select 
              id="reference" 
              name="reference" 
              value={newSkill.reference} 
              onChange={handleChange}
            >
              <option value="">N/A</option> {/* Ensures option for no reference */}
              {contacts.map(contact => (
                <option key={contact._id} value={contact._id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>
          <div className="skills-page__modal-footer">
            <button type="submit" className="skills-page__button--add-new">Add</button>
            <button type="button" className="skills-page__button--cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );  
};

module.exports = AddSkillModal;




