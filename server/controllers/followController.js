const Follow = require("../models/followModel");
const handlerFactory = require("./handlerFactory");

exports.createFollow = handlerFactory.createOne(Follow);
exports.deleteFollow = handlerFactory.deleteOne(Follow);
