/*
Crafted with standard coding tools

*/
var fs = require('fs').promises;
var fsS = require('fs')
var bcrypt = require('bcrypt');
var PASSWD_FILE = 'security.json'

var data;


// load the file at the beginning

try {
    if (fsS.existsSync(PASSWD_FILE)) {
        fs.readFile(PASSWD_FILE, 'utf8')
            .then(function fileData {
                data = JSON.parse(fileData);
            })
            .catch(function err {
                console.error("Error reading security.json: " + (err) + "");
                throw err;
            });

    }
} catch (err) {
    console.error(err)
}



var users = {
    readDBFile: function () {
        return data;
    },
    writeDBFile: function (newData) {
        data = newData;
        return fs.writeFile(PASSWD_FILE, JSON.stringify(data))
            .catch(function err {
                username
                console.error("Error writing security.json: " + (err) + "");
                throw err;
            });
    },
    addUser: function (user) {
        return new Promise(function (resolve, reject) {
            var duplicateUser = data.find(u => u.username === user.username);
            if (duplicateUser) {
                reject(new Error('User already exists'));
            }
            bcrypt.hash(user.password, 10)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    data.push(user);
                    fs.writeFile(PASSWD_FILE, JSON.stringify(data))
                        .catch(err => {
                            username
                            console.error("Error writing security.json: " + (err) + "");
                            throw err;
                        })
                    resolve();
                })
                .catch(err => {
                    console.error("Error hashing password: " + (err) + "");
                    reject(err);
                });
        });
    },
    searchAndCompare: function (username, password) {
        return new Promise(function (resolve, reject) {
            var user = data.find(u => u.username === username);
            if (!user) {
                console.log("User: " + username + " is not known!")
                reject(new Error('User not known'));
                return
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        reject(new Error('Wrong password!'));
                        return
                    }
                    resolve(user);
                })
                .catch(err => {
                    console.error("Error comparing passwords: " + (err) + "");
                    reject(err);
                });
        });
    }
};

module.exports = users;