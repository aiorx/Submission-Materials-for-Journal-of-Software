```javascript
const getCartId = () => {
  axios.post(`${baseURL}/store/carts`).then((res) => {
    AsyncStorage.setItem("cart_id", res.data.cart.id);
  });
};
```