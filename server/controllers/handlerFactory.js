const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
exports.getAll = (Model, popuOpt, isForComment) =>
  catchAsync(async (req, res, next) => {
    let orgQuery = Model.find();

    if (popuOpt instanceof Array) {
      popuOpt.forEach((opt) => {
        orgQuery = orgQuery.populate(opt);
      });
    } else {
      orgQuery = orgQuery.populate(popuOpt);
    }

    if (isForComment) {
      orgQuery = orgQuery.find({ isReply: false });
    }

    const query = new ApiFeatures(orgQuery, req.query)
      .filter()
      .select()
      .sort()
      .paginate();

    const documents = await query.query;

    res.status(200).json({
      status: "success",
      result: documents.length,
      data: {
        data: documents,
      },
    });
  });

exports.getOne = (Model, popuOpt) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    let orgQuery = Model.findById(id);

    if (popuOpt instanceof Array) {
      popuOpt.forEach((opt) => {
        orgQuery = orgQuery.populate(opt);
      });
    } else {
      orgQuery = orgQuery.populate(popuOpt);
    }

    const query = new ApiFeatures(orgQuery, req.query).select();

    const document = await query.query;

    if (!document) {
      return next(new AppError("No data are found with this id.", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model, popuOpt, isForFollow) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.create({ ...req.body, createdAt: Date.now() });

    if (popuOpt) {
      query = query.populate(popuOpt);
    }

    const data = await query;

    const parsed = JSON.parse(JSON.stringify(data));

    res.status(201).json({
      status: "success",
      data: {
        data: isForFollow
          ? {
              ...parsed,
              followingUser: { ...parsed.followingUser, followId: parsed._id },
            }
          : data,
      },
    });
  });

exports.updateOne = (Model, popuOpt) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const document = await Model.findById(id);

    if (!document) {
      return next(new AppError("No data are found with this id.", 400));
    }

    const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate(popuOpt);

    res.status(200).json({
      status: "success",
      data: {
        data: updatedDocument,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const delData = await Model.findByIdAndDelete(req.params.id);
    if (!delData) {
      return next(new AppError("No data are found with this id.", 400));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
