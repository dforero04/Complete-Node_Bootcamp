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
