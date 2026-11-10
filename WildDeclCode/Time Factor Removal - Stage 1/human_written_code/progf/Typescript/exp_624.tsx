/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var _import = require('react');
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
var get = require('lodash/get');
var memoize = require('lodash/memoize');

var ImageViewing = require('../src/ImageViewing');
var ImageList = require('./components/ImageList');
var ImageHeader = require('./components/ImageHeader');
var ImageFooter = require('./components/ImageFooter');

var architecture = require('./data/architecture').architecture;
var travel = require('./data/travel').travel;
var city = require('./data/city').city;
var food = require('./data/food').food;

var ImageSource = require('../src/@types').ImageSource;

module.exports = function App() {;
  var [currentImageIndex, setImageIndex] = useState(0);
  var [images, setImages] = useState(architecture);
  var [isVisible, setIsVisible] = useState(false);

  var onSelect = function (images, index) {
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
  };

  var onRequestClose = function () { return setIsVisible(false); };
  var getImageSource = memoize((images): ImageSource[] =>
    images.map(function (image) { return typeof image.original === "number"
        ? image.original
        : { uri: image.original as string }; })
  );
  var onLongPress = function (image) {
    Alert.alert("Long Pressed", image.uri);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ImageList
        images={travel.map(function (image) { return image.thumbnail; })}
        onPress={function (index) { return onSelect(travel, index); }}
        shift={0.25}
      />
      <ImageList
        images={architecture.map(function (image) { return image.thumbnail; })}
        onPress={function (index) { return onSelect(architecture, index); }}
        shift={0.75}
      />
      <View style={styles.about}>
        <Text style={styles.name}>[ react-native-image-viewing ]</Text>
      </View>
      <ImageViewing
        images={getImageSource(images)}
        imageIndex={currentImageIndex}
        presentationStyle="overFullScreen"
        visible={isVisible}
        onRequestClose={onRequestClose}
        onLongPress={onLongPress}
        HeaderComponent={
          images === travel
            ? function ({ imageIndex }) {
                var title = get(images, "" + (imageIndex) + ".title");
                return (
                  <ImageHeader title={title} onRequestClose={onRequestClose} />
                );
              }
            : undefined
        }
        FooterComponent={function ({ imageIndex }) { return (
          <ImageFooter imageIndex={imageIndex} imagesCount={images.length} />
        ); }}
      />
      <ImageList
        images={food.map(function (image) { return image.thumbnail; })}
        onPress={function (index) { return onSelect(food, index); }}
        shift={0.5}
      />
      <ImageList
        images={city.map(function (image) { return image.thumbnail; })}
        onPress={function (index) { return onSelect(city, index); }}
        shift={0.75}
      />
    </SafeAreaView>
  );
}

var styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
      default: null,
    }),
  },
  about: {
    flex: 1,
    marginTop: -12,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "200",
    color: "#FFFFFFEE",
  },
});
