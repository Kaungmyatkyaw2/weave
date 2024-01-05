const Follow = require("../models/followerModel");
const handlerFactory = require("./handlerFactory");

exports.creteFollow = handlerFactory.createOne(Follow);
