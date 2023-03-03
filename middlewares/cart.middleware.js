const Cart = require('../models/cart.model');
const ProductsInCart = require('../models/productsInCart.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validExistCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  let cart = await Cart.findOne({
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
  });

  if (!cart) {
    cart = await Cart.create({ userId: sessionUser.id });
  }

  req.cart = cart;
  next();
});

exports.validIfExistProductInCart = catchAsync(async (req, res, next) => {
  const { product, cart } = req;

  //También podemos traer el productId de la req.body, en ese caso, en el where
  //se coloca productId
  // const {productId} = req.body

  const productInCart = await ProductsInCart.findOne({
    where: {
      cartId: cart.id,
      productId: product.id,
    },
  });

  if (productInCart && productInCart.status === 'removed') {
    await productInCart.update({ status: 'active', quantity: 1 });
    return res.status(200).json({
      status: 'success',
      message: 'Product added successfuly',
    });
  }
  if (productInCart) {
    return next(new AppError('This product already exists in the cart', 400));
  }
  req.productInCart = productInCart;
  next();
});

exports.validIfExistProductInCartForUpdate = catchAsync(
  async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.body;
    const cart = await Cart.findOne({
      where: {
        userId: sessionUser.id,
        status: 'active',
      },
    });
    const productInCart = await ProductsInCart.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!productInCart) {
      return next(new AppError('the product does not exist in the cart', 400));
    }
    req.productInCart = productInCart;
    next();
  }
);

exports.validExistProductInCartByParamsForUpdate = catchAsync(
  async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.params;

    const cart = await Cart.findOne({
      where: {
        userId: sessionUser.id,
        status: 'active',
      },
    });
    const productInCart = await ProductsInCart.findOne({
      where: {
        cartId: cart.id,
        productId,
        status: 'active',
      },
    });

    if (!productInCart) {
      return next(new AppError('the product does not exist in the cart', 400));
    }
    req.productInCart = productInCart;
    next();
  }
);
