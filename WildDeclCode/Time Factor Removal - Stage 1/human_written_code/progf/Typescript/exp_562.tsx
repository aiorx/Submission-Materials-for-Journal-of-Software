var _import = require('react');
var Button = require('@chakra-ui/react').Button;
var VisuallyHidden = require('@chakra-ui/react').VisuallyHidden;

var ArrowUp = require('components/icons').ArrowUp;
var SCROLL_BUTTON_POSITION = require('lib/constants').SCROLL_BUTTON_POSITION;

interface Props {
  limit: number;
  right?: number | string | object;
  bottom?: number | string | object;
  translateY?: string;
  accessibilityContent?: string;
}

const ScrollTopButton: React.FC<Props> = function ({
  limit,
  right = SCROLL_BUTTON_POSITION.RIGHT,
  bottom = SCROLL_BUTTON_POSITION.BOTTOM,
  translateY = "30px",
  accessibilityContent = "Volver al inicio",
}) {
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const handleScroll = useCallback((): void => {
    if (!hasScrolled && window.scrollY >= limit) {
      setHasScrolled(true);
    } else if (hasScrolled && window.scrollY < limit) {
      setHasScrolled(false);
    }
  }, [limit, hasScrolled]);

  const handleScrollTop = useCallback((): void => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <Button
      backgroundColor="primary.500"
      bottom={bottom}
      height={68}
      opacity={hasScrolled ? "1" : "0"}
      pointerEvents={hasScrolled ? "initial" : "none"}
      position="fixed"
      right={right}
      rounded="full"
      transform={!hasScrolled ? "translateY(" + (translateY) + ")" : ""}
      width={68}
      onClick={handleScrollTop}
    >
      <ArrowUp />
      <VisuallyHidden>{accessibilityContent}</VisuallyHidden>
    </Button>
  );
};

module.exports = ScrollTopButton;
