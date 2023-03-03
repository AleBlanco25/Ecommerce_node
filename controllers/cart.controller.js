const Cart = require('../models/cart.model');
const Order = require('../models/orders.model');
const Product = require('../models/product.model');
const ProductsInCart = require('../models/productsInCart.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  const newProductInCart = await ProductsInCart.create({
    cartId: cart.id,
    productId,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    message: 'The product has been added',
    newProductInCart,
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;
  const { productInCart } = req;

  if (newQty < 0) {
    return next(new AppError('the quantity must be bigger than 0', 400));
  }

  if (newQty === 0) {
    await productInCart.update({ quantity: newQty, status: 'removed' });
  } else {
    await productInCart.update({ quantity: newQty, status: 'active' });
  }
  res.status(201).json({
    status: 'success',
    message: 'The product has been updated',
  });
});

exports.removeProductToCart = catchAsync(async (req, res, next) => {
  const { productInCart } = req;

  await productInCart.update({ quantity: 0, status: 'removed' });

  res.status(200).json({
    status: 'success',
    message: 'the product has been removed from the cart',
  });
});

exports.buyProductOnCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  //1. buscar el carrito del usuario

  const cart = await Cart.findOne({
    attributes: ['id', 'userId'],
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: ProductsInCart,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
          status: 'active',
        },
        include: [
          {
            model: Product,
            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
          },
        ],
      },
    ],
  });

  if (!cart) {
    return next(new AppError('there is no products in cart ', 404));
  }
  //2. calcular el precio total a pagar
  let totalPrice = 0;

  console.log(cart);
  cart.productsInCarts.forEach(productInCart => {
    totalPrice += productInCart.quantity * productInCart.product.price;
  });

  //3. vamos a actualizar el stock o cantidad del modelo Product
  const purchasedProductPromises = cart.productsInCarts.map(
    async productInCart => {
      const product = await Product.findOne({
        where: {
          id: productInCart.productId,
        },
      });

      //!TODO

      const newStock = product.quantity - productInCart.quantity;

      return await product.update({ quantity: newStock });
    }
  );

  await Promise.all(purchasedProductPromises);

  //crear la constante que se le va a asginar al map
  const statusProductInCartPromises = cart.productsInCarts.map(
    async productInCart => {
      const productInCartFound = await ProductsInCart.findOne({
        where: {
          id: productInCart.id,
          status: 'active',
        },
      });

      return await productInCartFound.update({ status: 'purchased' });
    }
  );

  await Promise.all(statusProductInCartPromises);

  await cart.update({ status: 'purchased' });

  const order = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });

  res.status(201).json({
    message: 'the order has been generated successfully',
    order,
  });
});
