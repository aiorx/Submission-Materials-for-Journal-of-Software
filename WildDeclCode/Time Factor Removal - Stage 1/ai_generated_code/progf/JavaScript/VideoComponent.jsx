//code Assisted with basic coding tools 3.5
var _import = require('react');

var VideoComponent = function ({ videoURL  }) {
  var videoRef = useRef(null);


  return (
    <div>
      <iframe
        ref={videoRef}
        width="560"
        height="315"
        src={videoURL}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube Video"
      ></iframe>
      <div>
      </div>
    </div>
  );
};

module.exports = VideoComponent;
