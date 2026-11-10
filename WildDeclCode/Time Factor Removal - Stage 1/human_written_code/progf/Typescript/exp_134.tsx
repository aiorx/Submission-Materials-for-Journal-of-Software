var useWindowSize = require('react-use/lib/useWindowSize');
var ReactConfetti = require('react-confetti').default;
var useContext = require('react').useContext;
var QuestionContext = require('./Question').QuestionContext;

interface WindowDimensions {
  width: number;
  height: number;
}

const Confetti: React.FC = function () {
  var state = useContext.state;(QuestionContext);
  const { width, height }: WindowDimensions = useWindowSize();

  return (
    state?.correct && (
      <ReactConfetti width={width} height={height} recycle={false} />
    )
  );
};

module.exports = Confetti;
