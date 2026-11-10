export default function EditLocation() {
  const navigate = useNavigate();
  const { id } = useParams(); // Extracts the id from the URL, allowing the component to access specific route parameter
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [triggerData, setTriggerData] = useState(null);
  const { quill, quillRef } = useQuill();

  const location = useLocation();
  const projectId = location.state

  // Monitor the value of the location content, and return the value of the specified field
  const location_content = watch('location_content');

  //UseEffect hook listens for changes in the quill object and logs it to delta. Code from Stakeoverflow, "How to console-log on change"
  useEffect(() =>{
    if (quill) {
      quill.on('text-change', (delta) => {
        console.log('Delta', delta);
        console.log("innerHTML", quill.root.innerHTML)
      });
    }
  }, [quill]);

  // Handle form submission. Code inspired by React Hook Form documentation
  const onSubmit = async (data) => {
    try {
      // newLocation object to store the data from the form
      const newLocation = {
        location_name: data.location_name,
        location_trigger: triggerData,
        location_position: data.location_position,
        location_content: quill.root.innerHTML,   // Stores HTML content in the location_content field
        clue: data.clue,
        score_points: data.score_points,
        project_id: projectId
      };

      // Console logs the new location data
      if (id) {
        const updatedLocation = await updateLocation(id, newLocation);
        console.log('Project updated:', updatedLocation);
      } else {
        const createdLocation = await createLocation(newLocation);
        console.log('Project created:', createdLocation);
      }

      navigate(`/locations`, {state: projectId}); // Redirect to the projects page
      reset()
    } catch (error) {
      console.error('Error submitting location:', error.message);
    }
  };

  {/*Form to create or edit a location with datanames from the api/locations errorhandling on latitute and lognitude plus points
    is Aided with basic GitHub coding tools*/}
  return (
    <div className="flex flex-col justify-between space-x-4">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="flex flex-col space-x-2 p-2">
          <label className="font-medium" htmlFor="location_name">Location Name</label>
          <input {...register('location_name', { required: true })} />
          {/*Handles error if the user does not enter the required data*/} 
          {errors.location_name && <p className="text-red-500">Location name is required</p>}
          <h2 className="font-light text-gray-400">The name of the location</h2>
        </div>

        <div className="flex flex-col space-x-2 p-2">
          <label className="font-medium" htmlFor="location_trigger">Location Trigger</label>
          <select 
            {...register('location_trigger', { required: true })} 
            onChange={(e) => setTriggerData(e.target.value)} // Update state when selected
          >
            {/*Drop down option*/} 
            <option value="">Select scoring value</option>
            <option value="qrCodes">QR-code scan</option>
            <option value="locationEntry">Location entry</option>
            <option value={"locationEntry, qrCodes"}>Both</option>
          </select>
          <h2 className="font-light text-gray-400">Select how participants will be scored in this project</h2>
        </div>

        <div className="flex flex-col space-x-2 p-2"> 
        <label htmlFor="location_position bg-white">Location Position (Latitude, Longitude)</label>
        <input
          id="location_position"
          {...register('location_position', {
            required: 'Location position is required',
            pattern: {
              value: /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/,
              message: 'Please enter the correct format: Latitude, Longitude'
            }
          })}
          className="border p-2 rounded"
        /> 
        {errors.location_position && (
          <p className="text-red-500">{errors.location_position.message}</p> 
        )}
        </div>

        <div className="flex flex-col space-x-2 p-2">
        <label className="font-medium" htmlFor="score_points">Points for Reaching Location</label>
        <input
          id="score_points"
          {...register('score_points', {
            required: 'Points are required',
            pattern: {
              value: /^\d+$/,
              message: 'Please enter a valid number of points'
            }
          })}
          className="border p-2 rounded"
          />
          {errors.score_points && (
            <p className="text-red-500">{errors.score_points.message}</p>
          )}
          <h2 className="font-light text-gray-400">Points awarded for visiting this location</h2>
        </div>

        <div className="flex flex-col space-x-2 p-2">
          <label className="font-medium" htmlFor="clue">Clue</label>
          <input {...register('clue')} />
          <h2 className="font-light text-gray-400">Optional clue for participants at this location</h2>
        </div>

        <div className="flex flex-col space-x-2 p-2">
          <label className="font-medium" htmlFor="location_content">Location Content</label>
          {/*Handles error if the user does not enter the required data*/} 
          {errors.location_content && <p className="text-red-500">Content for the location is required</p>}
          <h2 className="font-light text-gray-400">Content to display at the location</h2>
          <div className="bg-white">
           <div ref={quillRef} />
         </div>
        </div>

        <div className="flex flex-col space-x-2 p-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}