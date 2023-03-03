const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ProductImg = require('../models/productsImgs.model');
const ProductsInCart = require('../models/productsInCart.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: {
      id,
      status: true,
    },
    include: [
      {
        model: ProductImg,
      },
    ],
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  req.product = product;
  next();
});

exports.validBodyProductById = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findOne({
    where: {
      id: productId,
      status: true,
    },
  });

  if (!productId) {
    return next(new AppError('Product not found'), 404);
  }
  req.product = product;
  next();
});

exports.validIfExistProductsInStock = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { quantity } = req.body;

  if (product.quantity < quantity) {
    return next(new AppError('there is not enough products in stock', 404));
  }

  next();
});

exports.validIfExistProductsInStockForUpdate = catchAsync(
  async (req, res, next) => {
    const { product } = req;
    const { newQty } = req.body;

    if (newQty > product.quantity) {
      return next(new AppError('there is not enough products in stock', 404));
    }

    next();
  }
);

exports.validIfExistProductIdByParams = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findOne({
    where: {
      id: productId,
      status: true,
    },
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  next();
});
