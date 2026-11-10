var _import = require('react');
var Slider = require('@material-ui/core/Slider');
var Typography = require('@material-ui/core/Typography');

function valuetext(value: number) {
  return "" + (value) + "";
}

// updates the number of messages per second
const MessageSlider: FC<any> = function (props:any) {
  var messagesPerSecond = props.messagesPerSecond;
var setMessagesPerSecondHandler = props.setMessagesPerSecondHandler;

  return(
    <div>
      <Typography id="discrete-slider" gutterBottom>
        Messages per Second
      </Typography>
      <Slider 
        value={messagesPerSecond}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={10}
        onChange={setMessagesPerSecondHandler}
      />
    </div>
  )
}