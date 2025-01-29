//  simulate a database for users using the localStorage
const DB_NAME = "users";

function getUsers() {
  return JSON.parse(localStorage.getItem(DB_NAME)) || [];
}

function getUser(name) {
  return getUsers().find((u) => u.name === name);
}

function postUser(user) {
  let users = getUsers();
  users.push(user);
  localStorage.setItem(DB_NAME, JSON.stringify(users));
}

function putUser(user, name) {
  let users = getUsers();
  let index = users.findIndex((u) => u.name === name);
  if (index === -1) {
    return false;
  }
  users[index] = user;
  localStorage.setItem(DB_NAME, JSON.stringify(users));

  return true;
}

function deleteUser(name) {
  let users = getUsers();
  let index = users.findIndex((u) => u.name === name);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  localStorage.setItem(DB_NAME, JSON.stringify(users));

  return true;
}

const users = {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
};


export { users };
