var _import = require('react');
import {
  Modal,
  ModalProps,
  //@ts-ignore
  Pressable,
  StyleSheet,
} from 'react-native';
var ANIMATION_DURATION = require('../constants').ANIMATION_DURATION;

// On iOS, Modal orientations need to be manually specified
const IOS_MODAL_SUPPORTED_ORIENTATIONS: ModalProps['supportedOrientations'] = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
];

module.exports = function Backdrop({;
  children,
  onPress,
  visible,
}: BackdropProps) {
  const [delayedVisible, setDelayedVisible] = useState(visible);

  useEffect(function () {
    // When `Modal.visible` changes, the inner view gets hidden
    // immediately. This gives no time to `Popover` to animate
    // when `visible` becomes `false`. By delaying the `visible`
    // property, it gives extra time for the popover to animate,
    // then hide the modal
    if (visible) {
      setDelayedVisible(true);
    } else {
      setTimeout(() => setDelayedVisible(false), ANIMATION_DURATION);
    }
  }, [visible]);

  return (
    <Modal
      visible={delayedVisible}
      onRequestClose={onPress}
      hardwareAccelerated
      transparent
      supportedOrientations={IOS_MODAL_SUPPORTED_ORIENTATIONS}
    >
      <Pressable onPress={onPress} style={styles.pressable}>
        {children}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
});
