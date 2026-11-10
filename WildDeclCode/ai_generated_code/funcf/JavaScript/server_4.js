```js
      const areAdmin = listOfUsers.map((user) => {
        return {
          ...user,
          isAdmin: user.uname === "Emma",
        };
      });
      model = { users: areAdmin };
      res.render("users.handlebars", model);
```