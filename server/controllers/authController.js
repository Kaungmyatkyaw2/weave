const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");
const AppError = require("../utils/appError");

const signJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendJWT = (user, statusCode, res) => {
  const token = signJWT(user._id);
  user.password = undefined;

  const cookieConfig = {
    expires: new Date(
      Date.now() + process.env.COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // httpOnly: true,
  };

  res.cookie("jwt", token, cookieConfig);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const sendVerificationEmail = async (token, user, req, res, next) => {
  try {
    if (user.verifiedEmail) {
      return next(new AppError("Email is already verified.", 400));
    }

    const url = `${req.headers.origin}/verifyEmail?token=${token}`;

    await new Email(user, url).sendVerifyEmailLink();

    res.status(201).json({
      status: "success",
      message: "Have sent verification link. Check your email!",
    });
  } catch (error) {
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    next(new AppError("Error while sending verification email.", 400));
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 203));
  }

  const user = await User.findOne({ email }).select(
    "+password +isVerifiedEmail"
  );
  if (!user) {
    return next(new AppError("Invaid Email!", 401));
  }

  const isPasswordCorrect = await user.checkPasswordCorrect(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid Password!", 401));
  }

  if (!user.isVerifiedEmail) {
    return next(
      new AppError(
        "The user haven't verified the email.Please verify first. ",
        401
      )
    );
  }

  createSendJWT(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const userData = {
    userName: req.body.userName,
    displayName: req.body.displayName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    profilePicture: req.body.profilePicture,
  };

  const user = await User.create(userData);
  const token = user.createVerificationToken();
  await user.save({ validateBeforeSave: false });
  await sendVerificationEmail(token, user, req, res, next);
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const verifyToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: verifyToken,
    verificationTokenExpires: { $gte: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or already expired.", 401));
  }

  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  user.isVerifiedEmail = true;

  await user.save({ validateBeforeSave: false });

  createSendJWT(user, 200, res);
});

exports.checkValidEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return next(new AppError("Please provide email!", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user is found!", 404));
  }

  req.user = user;

  next();
});

exports.getEmailVerification = catchAsync(async (req, res, next) => {
  const user = req.user;

  const token = user.createVerificationToken();
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(token, user, req, res, next);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = req.user;

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const url = `${req.headers.origin}/resetPassword?token=${resetToken}`;

    await new Email(user, url).sendResetPasswordLink();

    res.status(200).json({
      status: "success",
      message:
        "The password reset link is already sent to your email. Please Check the email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    next(new AppError("Error while sending verification email.", 400));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return next(
      new AppError("Please provide password and confirm password.", 400)
    );
  }

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpires: { $gte: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or already expired.", 401));
  }

  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save({ validateBeforeSave: true });

  createSendJWT(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { password, passwordConfirm, oldPassword } = req.body;

  const currentUser = await User.findById(userId).select("+password");

  if (!currentUser) {
    return next(new AppError("This user is no longer exist.", 400));
  }

  const isPasswordCorrect = await currentUser.checkPasswordCorrect(
    oldPassword,
    currentUser.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid old password.", 401));
  }

  currentUser.password = password;
  currentUser.passwordConfirm = passwordConfirm;

  await currentUser.save();

  createSendJWT(currentUser, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return next(new AppError("You aren't logged in.", 401));
  }

  token = req.headers.authorization.split(" ")[1].trim();

  const decodedJWT = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedJWT.id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token is no longer exist.", 401)
    );
  }

  const isPasswordChange = user.checkPasswordChanged(decodedJWT.iat);

  if (isPasswordChange) {
    return next(
      new AppError(
        "The user have changed his password. Please login again.",
        401
      )
    );
  }

  req.user = user;

  next();
});
