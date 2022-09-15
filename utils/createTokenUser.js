const createTokenUser = (user) => {
  return {
    userId: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
    profile: user.profile,
  };
};

module.exports = createTokenUser;
