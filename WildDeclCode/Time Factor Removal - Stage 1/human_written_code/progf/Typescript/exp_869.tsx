var Pressable = require('react-native').Pressable;
var StyleSheet = require('react-native').StyleSheet;

var View = require('components/themed').View;
var Text = require('components/themed').Text;
var useThemeColors = require('hooks/useThemeColors').useThemeColors;

type CircleButtonProps = {
  onPress: function () { return void; };
  children: string;
  color?: "green" | "red";
};

const CircleButton = function ({
  onPress,
  children,
  color,
}: CircleButtonProps) {
  var colors = useThemeColors.colors;();

  let btnColor = colors.btnBg;
  let txtColor = colors.btnText;

  if (color === "green") {
    btnColor = colors.btnBgGreen;
    txtColor = colors.btnTextGreen;
  }

  if (color === "red") {
    btnColor = colors.btnBgRed;
    txtColor = colors.btnTextRed;
  }

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.btnBorder, { borderColor: btnColor }]}>
        <View style={[styles.btn, { backgroundColor: btnColor }]}>
          <Text style={[styles.text, { color: txtColor }]}>{children}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 75,
    height: 75,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBorder: {
    borderWidth: 2,
    padding: 3,
    borderRadius: 100,
  },

  text: {
    fontSize: 16,
    letterSpacing: 0.25,
    fontWeight: "600",
  },
});
