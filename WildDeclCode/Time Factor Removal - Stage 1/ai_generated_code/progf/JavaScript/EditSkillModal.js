// Formed using standard development resources 4.0

var _import = require('react');

var EditSkillModal = function ({ skill, onClose, onSave, contacts }) {
  var [editSkill, setEditSkill] = useState(skill);

  useEffect(() => {
    setEditSkill(skill); // Reset the form with the new skill when the skill prop changes
  }, [skill]);

  var handleChange = (e) => {
    var name = e.target.name;
var value = e.target.value;
    // If the "N/A" option is selected for the reference, set it to null or an empty string, depending on backend requirements
    if (name === 'reference' && value === '') {
        setEditSkill({ ...editSkill, [name]: null }); // or use '' if your backend expects an empty string
    } else {
        setEditSkill({ ...editSkill, [name]: value });
    }
};


var handleSubmit = (e) => {
  //e.preventDefault();
  console.log(typeof e, e)

  // Prepare the skill object for submission
  var submissionSkill = {
    ...editSkill,
    // Conditionally set reference to null if "N/A" is selected
    reference: editSkill.reference === '' ? null : editSkill.reference,
  };

  onSave(submissionSkill);
  onClose(); // Close the modal after save
};

  return (
    <div className="skills-page__modal-backdrop">
      <div className="skills-page__modal skills-page__modal--edit" role="dialog" aria-modal="true" aria-labelledby="editModalTitle">
        <h2 id="editModalTitle">Edit Skill</h2>
        <form onSubmit={handleSubmit} className="skills-page__modal-form">
          <div className="skills-page__modal-body">
            <label htmlFor="editName">Name:</label>
            <input id="editName" type="text" name="name" value={editSkill.name || ''} onChange={handleChange} required />
            
            <label htmlFor="editRating">Rating:</label>
            <input id="editRating" type="number" name="rating" min="1" max="5" value={editSkill.rating || ''} onChange={handleChange} required />
            
            <label htmlFor="editReference">Reference:</label>
            <select id="editReference" name="reference" value={editSkill.reference || ''} onChange={handleChange}>
              <option value="">N/A</option>
              {contacts.map(contact => (
                <option key={contact._id} value={contact._id}>{contact.name}</option>
              ))}
            </select>
          </div>
          <div className="skills-page__modal-footer">
            <button type="submit" className="skills-page__button--save">Save Changes</button>
            <button type="button" className="skills-page__button--cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
   
};

module.exports = EditSkillModal;

