// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
var nanoid = require.nanoid;('nanoid')

function getId() {
  return nanoid().slice(0, 5)
}

var initializeUsers = function () { return ([
  { id: getId(), name: 'Ed Carter', bio: 'hero' },
  { id: getId(), name: 'Mary Edwards', bio: 'super hero' },
])

// FAKE IN-MEMORY USERS "TABLE"
var users = initializeUsers()

// DATABASE ACCESS FUNCTIONS
// DATABASE ACCESS FUNCTIONS
// DATABASE ACCESS FUNCTIONS
var find = () => {
  // SELECT * FROM users;
  return Promise.resolve(users)
}

var findById = id => {
  // SELECT * FROM users WHERE id = 1;
  var user = users.find(d => d.id === id)
  return Promise.resolve(user)
}

var insert = ({ name, bio }) => {
  // INSERT INTO users (name, bio) VALUES ('foo', 'bar');
  var newUser = { id: getId(), name, bio }
  users.push(newUser)
  return Promise.resolve(newUser)
}

var update = (id, changes) => {
  // UPDATE users SET name = 'foo', bio = 'bar WHERE id = 1;
  var user = users.find(user => user.id === id)
  if (!user) return Promise.resolve(null)

  var updatedUser = { ...changes, id }
  users = users.map(d => (d.id === id) ? updatedUser : d)
  return Promise.resolve(updatedUser)
}

var remove = id => {
  // DELETE FROM users WHERE id = 1;
  var user = users.find(user => user.id === id)
  if (!user) return Promise.resolve(null)

  users = users.filter(d => d.id !== id)
  return Promise.resolve(user)
}

var resetDB = () => { // ONLY TESTS USE THIS ONE
  users = initializeUsers()
}

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
  resetDB, // ONLY TESTS USE THIS ONE
}; }