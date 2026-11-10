package org.acme;

import java.util.List;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
// import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
// import jakarta.ws.rs.PATCH;
// import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
// import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/signup")
public class LoginResource {
    
    public static class userEntity {
        private String name;
        private String email;
        private String password;

        public String getName() { return name; }
        public void setName(String name) {
            this.name = name;
        }
        public String getEmail() { return email; }
        public void setEmail(String email) {
            this.email = email;
        }
        public String getPassword() { return password; }
        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Validates user input and creates a new user account using JSON body parameters
    @POST
    @Transactional
    @Produces(MediaType.TEXT_PLAIN)
    public Response signup(userEntity u) {
        List<User> userList = User.listAll();
        if (u.getName() == "" || u.getEmail() == "" || u.getPassword() == "") {
            return Response.status(Response.Status.BAD_REQUEST).entity("Please fill in all fields.").build();
        }
        for (User userData : userList) {
            if (userData.getName().equals(u.getName())) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Username is already in use.").build();
            }
            if (userData.getEmail().equals(u.getEmail())) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Email is already in use.").build();
            }
            if (userData.getPassword().equals(u.getPassword())) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Password is not available").build();
            }
        }
        if (u.getPassword().length() < 8) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Password must be at least 8 characters long.").build();
        }
        User user = new User(u.getName(), u.getEmail(), u.getPassword());
        user.persist();
        return Response.status(Response.Status.CREATED).entity("Account created successfully.").build();
    }

    // Logs in a user using JSON body parameters
    @Path("/login")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public Response login(userEntity u) {
        List<User> userList = User.listAll();
        if (userList.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("No users found.").build();
        }
        if (u.getName().equals("") || u.getPassword().equals("")) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Please fill in all fields.").build();
        }
        for (User userData : userList) {
            if (userData.getName().equals(u.getName()) && userData.getPassword().equals(u.getPassword())) {
                return Response.status(Response.Status.OK).entity("Login successful.").build();
            }
        }
        return Response.status(Response.Status.BAD_REQUEST).entity("Invalid username or password.").build();
    }

    // Returns a list of all users in the database (not implemented in the frontend...for obvious reasons;)
    @Path("/read")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public List<User> read() {
        return User.listAll();
    }
}

// THE OLD GREETINGS RESOURCE CODE :)) Cause I didn't want to delete it. Call me sentimental. Or lazy. Or both. Actually, this is really for reference purposes. I'm not sentimental. I'm just lazy. (I'm kidding. I'm sentimental. And lazy. And both. And neither. I'm just a person. A person who's writing a lot of comments. I should stop now. I'm stopping now. Bye. I'm done. I'm really done. I'm not kidding *(some of these were Assisted using common GitHub development utilities.. so it's Copilot calling me lazy XD **(good job reading this long line of comment...why? Why did you just take the time to read all of this? That's kinda weird you know.. ¯\_(ツ)_/¯)** )*)

// @Path("/hello")
// public class GreetingResource {

//     //Create
//     @Path("/name/{name}")
//     @POST
//     @Produces(MediaType.TEXT_PLAIN)
//     @Transactional
//     public String helloName(@PathParam("name") String name) {
//         UserName userName = new UserName(name);
//         userName.persist();
//         return "Hello " + name + "! Your name has been stored in the database.";
//     }

//     //Read
//     @Path("/name/list")
//     @GET
//     @Produces(MediaType.TEXT_PLAIN)
//     public String helloNameList() {
//         return UserName.listAll().toString().length() < 3 ? "No names stored in the database." : UserName.listAll().toString();
//     }

//     //Update
//     @Path("/name/update/{name}/{new}")
//     @PATCH
//     @Produces(MediaType.TEXT_PLAIN)
//     @Transactional
//     public String helloNameUpdate(@PathParam("name") String name, @PathParam("new") String newName) {
//         if (UserName.find("name", name).list().isEmpty()) {
//             return String.format("Sorry %s, the name %s does not exist in the database.", newName, name);
//         }
//         UserName userName = UserName.find("name", name).firstResult();
//         userName.name = newName;
//         userName.persist();
//         return "Hello " + newName + "! Your name has been updated in the database.";
//     }

//     //Delete
//     @Path("/name/remove/{name}") 
//     @DELETE
//     @Produces(MediaType.TEXT_PLAIN)
//     @Transactional
//     public String helloNameDelete(@PathParam("name") String name) {
//         if (UserName.find("name", name) == null) {
//             return String.format("The name '%s'does not exist in the database.", name);
//         }
//         UserName userName = UserName.find("name", name).firstResult();
//         userName.delete();
//         return String.format("The name %s has been deleted from the database.", name);
//     }
    
//     @POST
//     @Produces(MediaType.TEXT_PLAIN)
//     @Path("/name")
//     public String helloPost(Person p) {
//         return "Hello " + p.getFirst() + " " + p.getLast();
//     }

//     public static class Person {
//         private String first;
//         private String last;

//         public String getFirst() { return first; }
//         public void setFirst(String first){
//             this.first = first;
//         }
//         public String getLast() { return last; }
//         public void setLast(String last){
//             this.last = last;
//         }
//     }
// }
