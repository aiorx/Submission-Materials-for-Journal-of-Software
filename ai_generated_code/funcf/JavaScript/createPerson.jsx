const CreatePerson = ({
  personForm,
  setPersonForm,
  handleCreatePerson,
  handleCancel,
  formType,
}) => {
  // This form is Assisted using common GitHub development utilities
  return (
    <div className="w-50 bg-secondary text-white fs-4 p-4 rounded-4 w-auto d-flex flex-column gap-3">
      <input
        placeholder="Name"
        className="p-1 rounded-4 w-50 m-auto"
        value={personForm.name}
        onChange={(e) => {
          setPersonForm({ ...personForm, name: e.target.value });
        }}
        type="text"
      />
      <div className="w-50 m-auto">
        <span className="">Favorite Color: </span>
        <input
          placeholder="Favorite Color"
          className="rounded-2 w-full m-auto"
          value={personForm.favoriteColor}
          onChange={(e) => {
            console.log(e.target.value);
            setPersonForm({
              ...personForm,
              favoriteColor: e.target.value,
            });
          }}
          type="color"
        />
      </div>
      <input
        placeholder="Favorite Food"
        className="p-1 rounded-4 w-50 m-auto"
        value={personForm.favoriteFood}
        onChange={(e) => {
          setPersonForm({
            ...personForm,
            favoriteFood: e.target.value,
          });
        }}
        type="text"
      ></input>
      <div className="w-50 m-auto d-flex justify-content-between">
        <button
          onClick={handleCreatePerson}
          className="bg-light text-black px-3 p-1 rounded-pill m-auto"
        >
          {formType === "create" ? "Create" : "Update"}
        </button>
        <button
          onClick={handleCancel}
          className="bg-light text-black px-3 p-1 rounded-pill m-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};