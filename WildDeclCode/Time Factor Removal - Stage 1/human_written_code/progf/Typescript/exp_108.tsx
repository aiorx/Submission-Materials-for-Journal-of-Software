/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var React = require('react');
var View = require('react-native').View;
var Text = require('react-native').Text;
var StyleSheet = require('react-native').StyleSheet;

type Props = {
  imageIndex: number;
  imagesCount: number;
};

var ImageFooter = function ({ imageIndex, imagesCount }: Props) { return (
  <View style={styles.root}>
    <Text style={styles.text}>{"" + (imageIndex + 1) + " / " + (imagesCount) + ""}</Text>
  </View>
); };

var styles = StyleSheet.create({
  root: {
    height: 64,
    backgroundColor: "#00000077",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 17,
    color: "#FFF"
  }
});

module.exports = ImageFooter;
