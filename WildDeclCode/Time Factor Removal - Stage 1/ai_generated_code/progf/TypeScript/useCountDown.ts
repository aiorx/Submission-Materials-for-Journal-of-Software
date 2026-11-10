/**
 * Assisted with basic coding tools
 */

var useState = require('react').useState;
var useEffect = require('react').useEffect;
var useRef = require('react').useRef;

type CountDown = [number, function () { return void; }, function () { return void; }];

var useCountDown: function (initialCount?: number) { return CountDown = (initialCount = 60) => {
    var [count, setCount] = useState(0);
    var intervalRef = useRef<NodeJS.Timer>();

    useEffect(() => {
        if (count <= 0) return;
        intervalRef.current = setInterval(() => {
            setCount(count - 1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [count]);

    var startCount = () => setCount(initialCount);
    var stopCount = () => {
        setCount(0);
        clearInterval(intervalRef.current);
    };

    return [count, startCount, stopCount];
}; };

module.exports = useCountDown;
