const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // This filter is used to get a specific tour ID and the reviews for that tour
    const filter = req.params.tourId ? { tour: req.params.tourId } : {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // The explain() function provides additional info about the query
    // const docs = await features.query.explain();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const document = popOptions
      ? await Model.findById(req.params.id).populate(popOptions)
      : await Model.findById(req.params.id);

    if (!document) {
      return next(
        new AppError(
          `No ${Model.collection.collectionName} with ${req.params.id} ID found!`,
          404
        )
      );
    }

    res.status(200).json({
      status: 'success',
      data: { document }
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const savedDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: savedDoc
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedDoc) {
      return next(
        new AppError(
          `No ${Model.collection.collectionName} with ${req.params.id} ID found!`,
          404
        )
      );
    }

    res.status(200).json({
      status: 'success',
      data: { updatedDoc }
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new AppError(
          `No ${Model.collection.collectionName} with ${req.params.id} ID found!`,
          404
        )
      );
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
