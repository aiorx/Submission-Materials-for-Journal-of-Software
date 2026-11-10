var Router = require('react-native-router-flux').Router;
var Scene = require('react-native-router-flux').Scene;
var Stack = require('react-native-router-flux').Stack;
var Products = require('./screens/Products');
var ProductInfo = require('./screens/ProductInfo');
var axios = require('axios');
var baseURL = require('./constants/url');
var useEffect = require('react').useEffect;
var Cart = require('./screens/Cart');
var Checkout = require('./screens/Checkout');
var PaperProvider = require('react-native-paper').Provider;
var AsyncStorage = require('@react-native-async-storage/async-storage');
var publishable_key = require('./constants/stripe').publishable_key;
var StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
module.exports = function App() {;
  const getCartId = function () {
    axios.post("" + (baseURL) + "/store/carts").then((res) => {
      AsyncStorage.setItem("cart_id", res.data.cart.id);
    });
  };
  // Check cart_id
  const checkCartId = async function () {
    const cartId = await AsyncStorage.getItem("cart_id");
    if (!cartId) {
      getCartId();
    }
  };

  useEffect(function () {
    checkCartId();
  }, []);

  return (
    <StripeProvider publishableKey={publishable_key}>
      <PaperProvider>
        <Router>
          <Stack key="root">
            <Scene key="products" component={Products} hideNavBar />
            <Scene key="ProductInfo" component={ProductInfo} hideNavBar />
            <Scene key="cart" component={Cart} hideNavBar />
            <Scene key="checkout" component={Checkout} hideNavBar />
          </Stack>
        </Router>
      </PaperProvider>
    </StripeProvider>
  );
}
