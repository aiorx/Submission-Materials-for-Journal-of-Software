var BlobItem = require('@azure/storage-blob').BlobItem;
var _import = require('react');
var tap = require('rxjs/operators').tap;
import {
  DeletesViewStateContext,
  DownloadsViewStateContext,
  SharedViewStateContext
} from '../contexts/viewStateContext';

const ItemsList: React.FC = function () {
  const sharedContext = useContext(SharedViewStateContext);
  const downloadsContext = useContext(DownloadsViewStateContext);
  const deletesContext = useContext(DeletesViewStateContext);
  const [items, setItems] = useState<BlobItem[]>([]);

  const getContainerItemsEffect = () => {
    const sub = sharedContext.itemsInContainer$
      .pipe(tap(items => setItems(items)))
      .subscribe();

    return () => sub.unsubscribe();
  };
  useEffect(getContainerItemsEffect, []);

  return (
    <div className="items-list">
      {items.map((item, i) => (
        <div key={i}>
          <span>{item.name}</span>
          <span>{item.properties.contentLength}</span>
          <span>{item.properties.lastModified.toISOString()}</span>
          <div>
            <button onClick={() => downloadsContext.downloadItem(item.name)}>
              Download
            </button>
            <button onClick={() => deletesContext.deleteItem(item.name)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

module.exports = ItemsList;
