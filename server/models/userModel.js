const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { default: validator } = require("validator");

const createHashedToken = () => {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  return {
    token: randomBytes,
    hashedToken: crypto.createHash("sha256").update(randomBytes).digest("hex"),
  };
};

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: [true, "User name is required for an account."],
    unique: true,
  },
  displayName: {
    type: String,
    trim: true,
    required: [true, "Display name is required for an account."],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required for an account."],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email.",
    },
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  profilePicture: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    select: false,
    minlength: 6,
    maxlength: 25,
    required: [true, "Password is required for an account"],
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "You have to confirm your password."],
    validate: {
      validator: function (pConfirm) {
        return (this.password == pConfirm);
      },
      message: "Confirm password must be match with password.",
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isVerifiedEmail: {
    type: Boolean,
    default: false,
    select: false,
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

UserSchema.methods.checkPasswordChanged = function (jwtTimeStamp) {
  const jwtTimeStampMili = jwtTimeStamp * 1000;

  if (!this.passwordChangedAt) {
    return false;
  }

  return this.passwordChangedAt.getTime() >= jwtTimeStampMili;
};

UserSchema.methods.checkPasswordCorrect = async function (
  candidatePassword,
  actualPassword
) {
  return await bcrypt.compare(candidatePassword, actualPassword);
};

UserSchema.methods.createVerificationToken = function () {
  const { token, hashedToken } = createHashedToken();
  this.verificationToken = hashedToken;
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

UserSchema.methods.createPasswordResetToken = function () {
  const { token, hashedToken } = createHashedToken();
  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    return next();
  }
  next();
});

UserSchema.pre("save", async function (next) {
  if (!this.isNew && this.isModified("password")) {
    this.passwordChangedAt = Date.now() - 1000;
    return next();
  }
  next();
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
