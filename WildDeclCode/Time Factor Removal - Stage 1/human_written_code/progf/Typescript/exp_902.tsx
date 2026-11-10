var React = require('react');
var Animated = require('react-native').Animated;
var View = require('react-native').View;
var StyleSheet = require('react-native').StyleSheet;
var ViewStyle = require('react-native').ViewStyle;
import {
  getInterpolatedColor,
  commonDefaultProps,
  startAnimationHelper,
  THeightType,
  TWidthType,
  CommonProps
} from './shared';

const AVATAR_SIZE = {
  default: 20,
  large: 30,
  small: 25
};
interface Props extends CommonProps {
  /**
   * Used to determine the height of the main title
   */
  tHeight: THeightType,
  /**
   * Used to determine the width of the main title
   */
  tWidth: TWidthType,
  /**
   * add additinal avatarstyles or overwrite previous ones
   */
  avatarStyles?: ViewStyle
}
class ContentLoader extends React.PureComponent<Props> {
  static defaultProps: Props;
  state = {
      animation: new Animated.Value(0)
  }

  componentDidMount() {
    var active = this.props.active;
    if (active) {
      this.startAnimation();
    }
  }

  componentDidUpdate(prevProps) {
    var loading = this.props.loading;
    if (prevProps.loading !== loading) {
      if (loading) {
        this.startAnimation();
      }
    }
  }

  startAnimation = function () {
    var animation = this.state.animation;
    var animationDuration = this.props.animationDuration;
    startAnimationHelper(animation, animationDuration);
  };

  render() {
    var tHeight = this.props.tHeight;
var tWidth = this.props.tWidth;
var titleStyles = this.props.titleStyles;
var aShape = this.props.aShape;
var aSize = this.props.aSize;
var avatarStyles = this.props.avatarStyles;
var reverse = this.props.reverse;
var containerStyles = this.props.containerStyles;
var loading = this.props.loading;
var listSize = this.props.listSize;
var primaryColor = this.props.primaryColor;
var secondaryColor = this.props.secondaryColor;
var children = this.props.children;
    var animation = this.state.animation;

    const interpolatedBackground = getInterpolatedColor(animation, primaryColor, secondaryColor);

    if (loading === false) {
      return children || null;
    }

    const titleInitialStyles = {
      height: tHeight,
      width: tWidth
    };
    const avatarInitialStyles = {
      height: AVATAR_SIZE[aSize] || aSize,
      width: AVATAR_SIZE[aSize] || aSize,
      borderRadius: aShape === 'circle' ? AVATAR_SIZE[aSize] / 2 || (aSize as any) / 2 : 3,
      marginRight: reverse ? 0 : 5,
      marginLeft: reverse ? 5 : 0
    };
    return [...Array(listSize)].map(function (_, index) { return (
      <View key={index} style={{ width: '100%', marginVertical: 8 }}>
        <View
          style={[
            styles.container,
            { flexDirection: reverse ? 'row-reverse' : 'row' },
            containerStyles
          ]}
        >
          <Animated.View
            style={[
              styles.avatar,
              avatarInitialStyles,
              avatarStyles,
              { backgroundColor: interpolatedBackground }
            ]}
          />

          <View style={styles.content}>
            <Animated.View
              style={[
                styles.title,
                titleInitialStyles,
                titleStyles,
                { backgroundColor: interpolatedBackground }
              ]}
            />
          </View>
        </View>
      </View>
    ); });
  }
}

ContentLoader.defaultProps = {
  ...commonDefaultProps,
  tWidth: '80%',
  tHeight: 10
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  content: {
    flex: 1,
    marginLeft: 10
  },
  avatar: {
    borderRadius: 2
  },
  title: {
    borderRadius: 3
  },
  paragraph: {
    marginVertical: 5,
    borderRadius: 3
  }
});
module.exports = ContentLoader;
