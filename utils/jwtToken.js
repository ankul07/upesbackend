const sendToken = (info, statusCode, res) => {
  const token = info.getJwtToken();

  // Options for cookies
  //   const options = {
  //     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  //     httpOnly: true,
  //     sameSite: "none",
  //     secure: true,
  //   };
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Token expiration time (e.g., 90 days)
    httpOnly: true, // Ensures that the cookie is only accessible via HTTP(S) and not JavaScript
    secure: true,
    sameSite: "none",
  };
  res.status(statusCode).cookie("token", token, options).json(info);
};

module.exports = sendToken;
