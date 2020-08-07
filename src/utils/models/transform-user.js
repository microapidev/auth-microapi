const transformUser = (doc, user) => {
  user.id = user._id.toString();
  delete user._id;
  delete user.__v;
  delete user.password;
};

module.exports = transformUser;
