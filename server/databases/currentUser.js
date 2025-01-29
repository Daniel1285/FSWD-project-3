function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return JSON.parse(user);
}

function postCurrentUser(data) {
  localStorage.setItem("currentUser", JSON.stringify(data));
}

function logoutUser() {
  localStorage.removeItem("currentUser");
}

const currentUser = {
  getCurrentUser,
  postCurrentUser,
  logoutUser,
};

export { currentUser };
