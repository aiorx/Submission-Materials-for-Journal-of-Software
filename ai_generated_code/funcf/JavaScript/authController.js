const updateUserCoordinate = asyncHandler(async (req, res) => {
  console.log("updateUserProfile arrived on server");

  const { email, coordinate } = req.body;

  // find user by email
  const user = await User.findOne({ email });

  if (user) {

    // update user coordinate - generated using Github Copilot
    user.coordinate = coordinate;

    await user.save();

    res.status(200).json({
      _id: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        coordinate: user.coordinate
      },
      token: "dummy_token" // generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

})