var _import = require('react');
var useAppSelector = require('../../app/hooks').useAppSelector;
var getProducts = require('../../app/api').getProducts;
var Product = require('../../app/api').Product;
var styles = require('./Products.module.css');

function Products() {
  const products = useAppSelector(function (state) { return state.products.products; });
  //   var [products, setProducts] = useState<Product[]>([]);
  //   useEffect(() => {
  //     getProducts().then((products) => {
  //       setProducts(products);
  //     });
  //   }, []);
  return (
    <main className="page">
      <ul className={styles.products}>
        {Object.values(products).map(function (product) { return (
          <li key={product.id}>
            <article className={styles.product}>
              <figure>
                <img src={product.imageURL} alt={product.imageAlt} />
                <figcaption className={styles.caption}>
                  {product.imageCredit}
                </figcaption>
              </figure>
              <div>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button>Add to Cart 🛒</button>
              </div>
            </article>
          </li>
        ); })}
      </ul>
    </main>
  );
}
