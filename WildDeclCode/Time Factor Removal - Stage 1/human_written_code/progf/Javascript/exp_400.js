const express = require("express");
const app = express();
var bodyParser = require('body-parser');
var getUserList = require('./user').getUserList;
var findUserById = require('./user').findUserById;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
const userList = getUserList(); // assume for now this is your database

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');



// GET Call for all users
app.get("/users", function (req, res) {
  return res.status(200).send({
    success: "true",
    message: "users",
    users: userList,
  });
});

app.get("/", function (req, res) {
  return res.status(200).send({
    success: "true",
    message: "users",
    users: userList,
  });
});

//  POST call - Means you are adding new user into database 

app.post("/addUser", function (req, res) {

  if (!req.body.name) {
    return res.status(400).send({
      success: "false",
      message: "name is required",
    });
  } else if (!req.body.companies) {
    return res.status(400).send({
      success: "false",
      message: "companies is required",
    });
  }
  const user = {
    id: userList.length + 1,
    isPublic: req.body.isPublic,
    name:  req.body.name,
    companies: req.body.companies,
    books:  req.body.books
  };
  userList.push(user);
  return res.status(201).send({
    success: "true",
    message: "user added successfully",
    user,
  });
});

//  PUt call - Means you are updating new user into database 

app.put("/user/:userId", function (req, res) {
  console.log(req.params)
  const id = parseInt(req.params.userId, 10);
  const userFound=findUserById(id)
  

  if (!userFound) {
    return res.status(404).send({
      success: 'false',
      message: 'user not found',
    });
  }

  const updatedUser= {
      id: id,
      isPublic: req.body.isPublic || userFound.body.isPublic,
      name:req.body.name || userFound.body.name,
      companies: req.body.companies || userFound.body.companies,
      books: req.body.books || userFound.body.books
   
  };

  if (!updatedUser.name) {
    return res.status(400).send({
      success: "false",
      message: "name is required",
    });
  } else if (!updatedUser.companies) {
    return res.status(400).send({
      success: "false",
      message: "companies is required",
    });
  }

  for (let i = 0; i < userList.length; i++) {
      if (userList[i].id === id) {
          userList[i] = updatedUser;
          return res.status(201).send({
            success: 'true',
            message: 'user updated successfully',
            updatedUser
          
          });
      }
  }
  return  res.status(404).send({
            success: 'true',
            message: 'error in update'
           
     });
})

//  Delete call - Means you are deleting new user from database 

app.delete("/user/:userId", function (req, res) {
  console.log(req.params)
  const id = parseInt(req.params.userId, 10);
  console.log(id)
  for(let i = 0; i < userList.length; i++){
      if(userList[i].id === id){
           userList.splice(i,1);
           return res.status(201).send({
            success: 'true',
            message: 'user deleted successfully'
          });
      }
  }
  return res.status(404).send({
              success: 'true',
              message: 'error in delete'   
    });
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8000, function () {
  console.log("server listening on port 8000!");
});
