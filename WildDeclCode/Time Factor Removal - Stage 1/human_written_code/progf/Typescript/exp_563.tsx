var React = require('react');

var api = require('./api');

var useTenant = require('~/tenant/hooks').useTenant;
var CURRENCIES = require('~/i18n/constants').CURRENCIES;
var Variant = require('~/product/types').Variant;
var Product = require('~/product/types').Product;
var getVariantsString = require('~/product/selectors').getVariantsString;
var getVariantsPrice = require('~/product/selectors').getVariantsPrice;
var getTotal = require('~/cart/selectors').getTotal;
var CartItem = require('~/cart/types').CartItem;

interface Context {
  actions: {
    log: {
      addToCart: function (product: Product, variants: Variant[], count: number) { return void; };
      removeFromCart: function (product: Product, variants: Variant[], count: number) { return void; };
      viewCart: function (items: CartItem[]) { return void; };
      viewFields: function (items: CartItem[]) { return void; };
      checkout: function (orderId: string, items: CartItem[]) { return void; };
      share: function (product: Product, method: string) { return void; };
      viewProduct: function (product: Product) { return void; };
    };
  };
}

const AnalyticsContext = React.createContext({} as Context);

const AnalyticsProvider: React.FC = function ({children}) {
  const tenant = useTenant();

  function addToCart(product: Product, variants: Variant[], count: number) {
    api.log("add_to_cart", {
      content_id: tenant.slug,
      items: [
        {
          quantity: count,
          item_category: product.category,
          item_id: product.id,
          item_variant: getVariantsString(variants),
          item_name: product.title,
          price: (product.price + getVariantsPrice(variants)) * count,
        },
      ],
      currency: CURRENCIES[tenant.country],
      value: product.price,
    });
  }

  function removeFromCart(product: Product, variants: Variant[], count: number) {
    api.log("remove_from_cart", {
      content_id: tenant.slug,
      items: [
        {
          quantity: count,
          item_category: product.category,
          item_id: product.id,
          item_variant: getVariantsString(variants),
          item_name: product.title,
          price: (product.price + getVariantsPrice(variants)) * count,
        },
      ],
      currency: CURRENCIES[tenant.country],
      value: product.price,
    });
  }

  function viewCart(items: CartItem[]) {
    api.log("begin_checkout", {
      checkout_option: "overview",
      value: getTotal(items),
      currency: CURRENCIES[tenant.country],
      items,
    });
  }

  function viewFields(items: CartItem[]) {
    api.log("checkout_progress", {
      checkout_option: "fields",
      value: getTotal(items),
      currency: CURRENCIES[tenant.country],
      items,
    });
  }

  function checkout(orderId: string, items: CartItem[]) {
    api.log("purchase", {
      transaction_id: orderId,
      value: getTotal(items),
      currency: CURRENCIES[tenant.country],
      items,
    });
  }

  function share(product: Product, method: string) {
    api.log("share", {
      content_id: tenant.slug,
      content_type: "product",
      screen_name: product.title,
      method,
    });
  }

  function viewProduct(product: Product) {
    api.log("view_item", {
      items: [product],
    });
  }

  const actions: Context["actions"] = {
    log: {
      viewCart,
      viewFields,
      addToCart,
      removeFromCart,
      checkout,
      share,
      viewProduct,
    },
  };

  return <AnalyticsContext.Provider value={{actions}}>{children}</AnalyticsContext.Provider>;
};

module.exports.AnalyticsProvider = AnalyticsProvider;
module.exports.as = as;
module.exports.Provider = Provider;
module.exports.AnalyticsContext = AnalyticsContext;
module.exports.as = as;
module.exports.default = default;
