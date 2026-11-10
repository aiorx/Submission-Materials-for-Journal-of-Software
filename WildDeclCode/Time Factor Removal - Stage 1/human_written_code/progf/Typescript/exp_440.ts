var useCallback = require('react').useCallback;
var useEffect = require('react').useEffect;
var useMemo = require('react').useMemo;
var useState = require('react').useState;
var Product = require('./product').Product;

const STORAGE_KEY = "minimart:cart";

type CartItem = {
  product: Product;
  quantity: number;
};

function addToCart(product: Product): void {
  const cartItems: CartItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const item = cartItems.find(function (item) { return item.product.id === product.id; });

  if (item) {
    item.quantity++;
  } else {
    cartItems.push({ product, quantity: 1 });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
}

function clearCart(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function useCartItemCount(): { cartItemCount: number; updateCartItemCount: function () { return void; }} {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(function () {
    setCartItemCount(getCartItemCount());
  }, []);

  const updateCartItemCount = useCallback(function () {
    setCartItemCount(getCartItemCount());
  }, []);

  return { cartItemCount, updateCartItemCount };
}

type NextQuantity = function (currentQuantity: number) { return number; };
type UpdateQuantity = function (item: CartItem, nextQuantity: NextQuantity) { return void; };

function useCartItems(): { cartItems: CartItem[]; updateQuantity: UpdateQuantity; amount: number } {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const amount = useMemo(function () {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const updateQuantity = useCallback(
    (item: CartItem, nextQuantity: NextQuantity): function void {
      const nextCartItems = cartItems.map((_item) => {
        if (_item.product.id === item.product.id) {
          const quantity = nextQuantity(item.quantity);
          return { ...item, quantity };
        } else {
          return _item;
        }
      });
      setCartItems(nextCartItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCartItems));
    },
    [cartItems]
  );

  useEffect(function () {
    setCartItems(getCartItems());
  }, []);

  return { cartItems, amount, updateQuantity };
}

function getCartItemCount(): number {
  const cartItems: CartItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return cartItems.reduce(function (sum, item) { return sum + item.quantity; }, 0);
}

function getCartItems(): CartItem[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
