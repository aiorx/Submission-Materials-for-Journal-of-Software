var React = require('react');
var Linking = require('react-native').Linking;
var Text = require('react-native').Text;
var View = require('react-native').View;
var TouchableOpacity = require('react-native-gesture-handler').TouchableOpacity;
var globalStyles = require('@styles').globalStyles;
var themeStyles = require('@styles').themeStyles;


function ProfileNotCompletedComponent() {

    return <View style={[
        globalStyles.profileNotCompletedContainer,
        { backgroundColor: themeStyles.containerColorSub.backgroundColor }
    ]}>
        <Text style={
            [globalStyles.profileNotCompletedText,
            { color: themeStyles.fontColorMain.color }
            ]}
        >Your profile has not been completed yet. Please visit the official website to update your profile.</Text>
        <TouchableOpacity
            style={globalStyles.profileNotCompletedButton}
            onPress={function () { return Linking.openURL('https://bitclout.com/'); }}>
            <Text style={{ color: 'white' }}>Go to Website</Text>
        </TouchableOpacity>
    </View>
}
