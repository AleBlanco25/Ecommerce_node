const { Router } = require('express');
const {
  addProductToCart,
  updateCart,
  removeProductToCart,
  buyProductOnCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validExistCart,
  validIfExistProductInCart,
  validExistProductInCartByParamsForUpdate,
  validIfExistProductInCartForUpdate,
} = require('../middlewares/cart.middleware');
const {
  validBodyProductById,
  validIfExistProductsInStock,
  validIfExistProductsInStockForUpdate,
  validIfExistProductIdByParams,
} = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');
const { validations } = require('../middlewares/validations.middleware');

const router = Router();

router.use(protect);

router.post(
  '/add-product',
  validations,
  validateFields,
  validBodyProductById,
  validIfExistProductsInStock,
  validExistCart,
  validIfExistProductInCart,
  addProductToCart
);
router.patch(
  '/update-cart',
  validations,
  validateFields,
  validBodyProductById,
  validIfExistProductsInStockForUpdate,
  validIfExistProductInCartForUpdate,
  updateCart
);
router.delete(
  '/:productId',
  validIfExistProductIdByParams,
  validExistProductInCartByParamsForUpdate,
  removeProductToCart
);
router.post('/purchase', buyProductOnCart);

module.exports = {
  cartRouter: router,
};
