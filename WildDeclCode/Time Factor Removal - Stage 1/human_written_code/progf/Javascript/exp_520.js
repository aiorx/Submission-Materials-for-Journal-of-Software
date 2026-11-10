var React = require('react');
var PropTypes = require('prop-types');
var Modal = require('react-native').Modal;
var TouchableWithoutFeedback = require('react-native').TouchableWithoutFeedback;
var View = require('react-native').View;
var Animatable = require('react-native-animatable');

const AnimatableTouchableWithoutFeedback = Animatable.createAnimatableComponent(TouchableWithoutFeedback);
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(37, 8, 10, 0.78)',
  },
  innerContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  }
};

class Overlay extends React.Component {
  state = {
    visible: this.props.visible,
    animationType: this.props.animationType,
    overlayAnimationType: 'fadeIn'
  };
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    animationType: PropTypes.string,
    animationOutType: PropTypes.string,
    easing: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    closeOnTouchOutside: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    childrenWrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    animationDuration: PropTypes.number,
    accessible: PropTypes.bool,
  }
  static defaultProps = {
    children: null,
    animationType: 'fadeIn',
    animationOutType: 'fadeOut',
    easing: 'ease',
    visible: false,
    closeOnTouchOutside: false,
    onClose: function () { },
    animationDuration: 500,
    accessible: true,
  }

  static getDerivedStateFromProps(props) {
    return { visible: props.visible, animationType: props.animationType };
  }

  _hideModal = function () {
    var animationOutType = this.props.animationOutType;
var animationDuration = this.props.animationDuration;
var onClose = this.props.onClose;
    this.setState({ animationType: animationOutType, overlayAnimationType: animationOutType });
    let timer = setTimeout(() => {
      onClose();
      clearTimeout(timer);
      this.setState({ overlayAnimationType: 'fadeIn' });
    }, animationDuration - 100);
  }

  _stopPropagation = function (e) { return e.stopPropagation()


  render() {
    var closeOnTouchOutside = this.props.closeOnTouchOutside;
var animationDuration = this.props.animationDuration;
var children = this.props.children;
var accessible = this.props.accessible;
var containerStyle = this.props.containerStyle;
var childrenWrapperStyle = this.props.childrenWrapperStyle;
var easing = this.props.easing;
    return (
      <Modal
        transparent
        visible={this.state.visible}
        onRequestClose={this._hideModal}
        onDismiss={this._hideModal}
        {...extraProps} animationType='none'>
        <TouchableWithoutFeedback onPress={closeOnTouchOutside ? this._hideModal : null} accessible={accessible}>
          <Animatable.View animation={this.state.overlayAnimationType} duration={animationDuration} easing={easing}
            useNativeDriver style={[styles.container, containerStyle]}>
            <AnimatableTouchableWithoutFeedback accessible={accessible} animation={this.state.animationType} easing={easing}
              duration={animationDuration} useNativeDriver onPress={this._stopPropagation}>
              <View style={[styles.innerContainer, childrenWrapperStyle]}>
                {children instanceof Function ? children(this._hideModal, this.state) : children}
                {/* Passing this reference in render prop so that the parent component can access all the children's methods */}
              </View>
            </AnimatableTouchableWithoutFeedback>
          </Animatable.View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }; }}

module.exports = Overlay;
