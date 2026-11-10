var Platform = require('react-native').Platform;

// app
var Alert = require('./app/alert.svg');
var ArrowRight = require('./app/arrow-right.svg');
var BackAndroid = require('./app/back-android.svg');
var BackIOS = require('./app/back-ios.svg');
var Bluetooth = require('./app/bluetooth.svg');
var Close = require('./app/close.svg');
var Notification = require('./app/notification.svg');
var ShareAndroid = require('./app/share-android.svg');
var ShareIOS = require('./app/share-ios.svg');
var Success = require('./app/success.svg');

// bubble
var BubbleCases = require('./bubble/cases.svg');
var BubbleCheckIn = require('./bubble/check-in.svg');
var BubbleDeaths = require('./bubble/deaths.svg');
var BubbleHospital = require('./bubble/hospital.svg');
var BubbleICU = require('./bubble/icu.svg');
var BubbleMapPin = require('./bubble/map-pin.svg');
var BubblePhoneCall = require('./bubble/phone-call.svg');
var BubbleShield = require('./bubble/shield.svg');
var BubbleSurvey = require('./bubble/survey.svg');
var BubbleSymptom = require('./bubble/symptom.svg');

// tab-bar
var Updates = require('./tab-bar/updates.svg');
var CheckIn = require('./tab-bar/check-in.svg');
var ContactTracingOff = require('./tab-bar/contact-tracing-off.svg');
var ContactTracingOn = require('./tab-bar/contact-tracing-on.svg');
var ContactTracingUnknown = require('./tab-bar/contact-tracing-unknown.svg');
var SettingsAndroid = require('./tab-bar/settings-android.svg');
var SettingsIOS = require('./tab-bar//settings-ios.svg');

// icons
var CheckMark = require('./check-mark.svg');
var CheckMarkMultiSelect = require('./check-mark-multiselect.svg');
var Logo = require('./logo.svg');
var Privacy = require('./privacy.svg');

const AppIcons = {
  Alert,
  ArrowRight,
  Back: Platform.OS === 'ios' ? BackIOS : BackAndroid,
  Bluetooth,
  Close,
  Notification,
  Share: Platform.OS === 'ios' ? ShareIOS : ShareAndroid,
  Success
};

const BubbleIcons = {
  Cases: BubbleCases,
  CheckIn: BubbleCheckIn,
  Deaths: BubbleDeaths,
  Hospital: BubbleHospital,
  ICU: BubbleICU,
  MapPin: BubbleMapPin,
  PhoneCall: BubblePhoneCall,
  Shield: BubbleShield,
  Survey: BubbleSurvey,
  Symptom: BubbleSymptom
};

const TabBarIcons = {
  Updates,
  CheckIn,
  ContactTracing: {
    Off: ContactTracingOff,
    On: ContactTracingOn,
    Unknown: ContactTracingUnknown
  },
  Settings: Platform.OS === 'ios' ? SettingsIOS : SettingsAndroid
};

module.exports = {;
  CheckMark,
  CheckMarkMultiSelect,
  Logo,
  Privacy
};
