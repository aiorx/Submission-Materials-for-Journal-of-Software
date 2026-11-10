//Profile form section Supported via standard programming aids 3.5
//Next of Kin, image handling and backend done by me

var Buffer = require('buffer').Buffer;
var _import = require('react');
var ErrorNotification = require('@/Components/Notifications').ErrorNotification;
var SuccessNotification = require('@/Components/Notifications').SuccessNotification;
globalThis.Buffer = Buffer

var UserEditPage = function ({ user }) {
    var [name, setName] = useState(user.name);
    var [email, setEmail] = useState(user.email);
    var [phone, setPhone] = useState((user.phone != null ? user.phone : ''));
    var [avatar, setAvatar] = useState(null);
    var [avatarPreview, setAvatarPreview] = useState(null);
    var [nextOfKin, setNextOfKin] = useState((user.next_of_kin != null ? user.next_of_kin : {name: '', email: '', phone: ''}))

    
    useEffect(() => {
        var getAvatar = async () => {
            var image = await axios.get('/users/'+user.id+'?view=avatar', {responseType: 'arraybuffer'})
            setAvatarPreview(Buffer.from(image.data, 'binary').toString('base64'))
        }
        getAvatar()
    }, []);

    var handleNextOfKinNameChange = (event) =>
        setNextOfKin({ ...nextOfKin, name: event.target.value });
    var handleNextOfKinEmailChange = (event) =>
        setNextOfKin({ ...nextOfKin, email: event.target.value });
    var handleNextOfKinPhoneChange = (event) =>
        setNextOfKin({ ...nextOfKin, phone: event.target.value });


    var handleSubmit = async (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            var response = await axios.post('/users/'+user.id+'?_method=PATCH', formData, {
                headers: { 'content-type': 'multipart/form-data' },
            });
            SuccessNotification('Success', response.data.message)
        } catch (error) {
            ErrorNotification('Error', error)
        }
    };

    var saveNextOfKin = async (e) => {
        e.preventDefault();
        var nokFormData = new FormData();
        nokFormData.append('name', nextOfKin.name);
        nokFormData.append('email', nextOfKin.email);
        nokFormData.append('phone', nextOfKin.phone);

        if(nextOfKin.id) {
            try {
                var res = await axios.patch('/nextOfKin/'+nextOfKin.id, {
                    name: nextOfKin.name,
                    email: nextOfKin.email,
                    phone: nextOfKin.phone
                })            
                SuccessNotification('Success', res.data.message)
                setNextOfKin(res.data.nextOfKin)
            } catch (error) {
                ErrorNotification('Error', error)
            }
        } else {
            try {
                var res = await axios.post('/nextOfKin', nokFormData)
                SuccessNotification('Success', res.data.message)
                setNextOfKin(res.data.nextOfKin)
            } catch (error) {
                ErrorNotification('Error', error)
            }
        }
    }

    function getBase64Preview(file) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            setAvatarPreview(reader.result.split(',')[1])
        }
        reader.onerror = function (error) {
            console.log('Error: ', error)
        }
    }

    var handleAvatarChange = (e) => {
        var file = e.target.files[0];
        if (file) {
            setAvatar(file);
            getBase64Preview(file)
        }
    };

    return (
        <>
            <div className="bg-gray-100 pt-6 sm:pt-12">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                        <div className="text-2xl">
                            My Profile
                        </div>
                        <div className="flex justify-center">
                            <div className="w-40 h-40 rounded-full overflow-hidden">
                                <img src={"data:image/jpeg;charset=utf-8;base64," + (avatarPreview) + ""} alt="avatar" className="w-40 h-40 text-center" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-5 mt-6">
                            <div className="flex space-x-5">
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Name</label>
                                        <input type="text" className="px-4 py-2 border w-full rounded-md focus:outline-none focus:border-indigo-500" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Email</label>
                                        <input type="email" className="px-4 py-2 border w-full rounded-md focus:outline-none focus:border-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Phone Number</label>
                                        <input type="text" className="px-4 py-2 border w-full rounded-md focus:outline-none focus:border-indigo-500" value={(phone != null ? phone : '')} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Avatar</label>
                                        <div className="flex items-center">
                                            <label className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer">
                                                Upload                 
                                                <input type="file" className="hidden" onChange={handleAvatarChange} />
                                            </label>
                                            {avatar && (
                                                <span className="ml-3">{avatar.name}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSubmit}>
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 pb-6">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                        <div className="text-2xl">Next Of Kin</div>
                        <div className="flex flex-col space-y-5 mt-6">
                            <div className="flex space-x-5">
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Name</label>
                                        <input type="text" className="px-4 py-2 border w-full rounded-md focus:outline-none focus:border-indigo-500" value={nextOfKin.name} onChange={(e) => handleNextOfKinNameChange(e)} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Email</label>
                                        <input type="email" className="px-4 py-2 border w-full rounded-md focus:outline-none focus:border-indigo-500" value={(nextOfKin.email != null ? nextOfKin.email : '')} onChange={(e) => handleNextOfKinEmailChange(e)} />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Phone Number</label>
                                        <input type="text" className="px-4 py-2 border w-full rounded-md focus:outline-none focus:border-indigo-500" value={(nextOfKin.phone != null ? nextOfKin.phone : '')} onChange={(e) => handleNextOfKinPhoneChange(e)} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={saveNextOfKin}>
                                    Save Next of Kin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

module.exports = UserEditPage;
