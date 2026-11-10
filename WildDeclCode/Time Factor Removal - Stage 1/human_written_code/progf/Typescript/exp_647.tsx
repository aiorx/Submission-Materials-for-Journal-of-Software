var useEffect = require('react').useEffect;
var styles = require('./App.module.css');
var AppHeader = require('./components/AppHeader/AppHeader');
var MapFilter = require('./components/MapFilter/MapFilter');
var ResizeBorder = require('./components/ResizeBorder/ResizeBorder');
var useRouter = require('./components/Router/Router').useRouter;
var WorldMap = require('./components/WorldMap/WorldMap');
var useMarkers = require('./contexts/MarkersContext').useMarkers;

function App(): JSX.Element {
  const router = useRouter();
  var markers = useMarkers.markers;();

  useEffect(function () {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        router.go('/', true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.container}>
      <AppHeader />
      <MapFilter />
      <WorldMap markers={markers} />
      <ResizeBorder />
    </div>
  );
}

module.exports = App;
