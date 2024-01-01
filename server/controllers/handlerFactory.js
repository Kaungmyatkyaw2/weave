const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.getAll = (Model, popuOpt) =>
  catchAsync(async (req, res, next) => {
    const query = new ApiFeatures(Model.find().populate(popuOpt), req.query)
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

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const query = new ApiFeatures(Model.findById(id), req.query).select();

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

exports.createOne = (Model, popuOpt) =>
  catchAsync(async (req, res, next) => {
    let query = (
      await Model.create({ ...req.body, createdAt: Date.now() })
    ).populate(popuOpt);

    const data = await query;

    res.status(201).json({
      status: "success",
      data: {
        data,
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
