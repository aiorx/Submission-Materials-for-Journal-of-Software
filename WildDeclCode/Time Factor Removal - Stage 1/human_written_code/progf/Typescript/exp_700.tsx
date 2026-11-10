var useContext = require('react').useContext;
var UnControlled = require('react-codemirror2').UnControlled;
var styled = require('styled-components');

var getStyles = require('../utils/getStyles').getStyles;
var QuestionContext = require('./Question').QuestionContext;
var QuestionData = require('./types').QuestionData;

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  require("codemirror/mode/javascript/javascript");
}

const CodeMirror: React.FC = function props {
  const { question }: QuestionData = useContext(QuestionContext);

  return (
    question?.code && (
      <StyledCodeMirror
        {...props}
        value={question?.code}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: false,
          readOnly: true
        }}
      />
    )
  );
};

module.exports = CodeMirror;

const StyledCodeMirror = styled(UnControlled)"
  " + (({ theme }) => `
  ${getStyles([theme.fonts.code, theme.colors.code, theme.dim.code])};
    .CodeMirror {
      ${getStyles([theme.colors.code])};
      direction: ltr;
      height: auto;
      width: auto;
    }
    
    .CodeMirror-line {
      ${getStyles([theme.fonts.code])};
    }
   `) + "
";
