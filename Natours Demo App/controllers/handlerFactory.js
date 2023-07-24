const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const savedDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: savedDoc
    });
  });
