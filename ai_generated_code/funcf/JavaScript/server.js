```js
function hashPassword(password) {
  //Code genretated by ChatGPT - BEGIN
  //(ChatGPT, 2024, "how to make one part of my code wait until a certain function is carried out?", https://chatgpt.com/)
  return new Promise((resolve, reject) => {
    //Promise so that the function returns the hash as a useable value
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.log("---> Error encrypting the given password: ", err);
        reject(err); //reject promise with error
      } else {
        console.log("---> Hashed password: ", hash);
        resolve(hash); //resolve the promise with hashed password
      }
    });
  });
  //Code Assisted with basic coding tools -END
}
```

```js
//Code Assisted with basic coding tools - BEGIN
//(ChatGPT, 2024, "How can I get only the value of a cell in an sql table and nothing else ?",https://chatgpt.com/)
bcrypt.compare(password, cell.upassword, (err, result) => {
  //Code Assisted with basic coding tools - END
  //compare user input & saved password
  if (err) {
    //error during comparison
    const model = {
      error: "Error while comparing passwords: " + err,
      message: "",
    };
    res.render("login", model);
  }

  if (result) {
    //user input &  password are the same
    //save in session
    req.session.isLoggedIn = true;
    req.session.name = username;
    console.log("Session info: " + JSON.stringify(req.session));
    res.redirect("/");
  } else {
    //user input is not the admin password
    const model = {
      error: "Wrong password, I'm afraid...",
      message: "",
    };
    res.status(400).render("login", model);
  }
});
```

```js
// Code Assisted with basic coding tools - BEGIN
// (CHatGPT, 2024, "how to make one part of my code wait until a certain function is carried out?", https://chatgpt.com/)
async function newUser() {
  try {
    //hash given password
    password = await hashPassword(password);
    console.log("hashed password after await: " + password);

    //check if admin is registering a user (userRole has been selected)
    if (req.body.userRole) {
      role = req.body.userRole;
    }

    //insert user + hasehd password into users table
    db.run(
      "INSERT INTO users (uname, upassword, urole) values (?, ?, ?)",
      [username, password, role],
      (error) => {
        if (error) {
          //error log
          console.log("ERROR: " + error);
        } else {
          console.log("New user added to users!");
          const model = {
            error: "",
            message: "Account created successfully!",
          };
          return res.render("register", model);
        }
      }
    );
  } catch (err) {
    console.log("Failed to hash password: " + err);
    res.redirect("/home");
  }
}
//add new user + hashed password to users table
newUser();
// Code genereated by ChatGPT - END
```