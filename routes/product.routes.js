const { Router } = require('express');
const {
  findProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findProduct,
} = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validProductById } = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');
const { validations } = require('../middlewares/validations.middleware');
const { upload } = require('../utils/multer');

const router = Router();

router.get('/', findProducts);

router.get('/:id', validProductById, findProduct);

router.use(protect);

router.post(
  '/',
  upload.array('productImgs', 3),
  validations,
  validateFields,
  restrictTo('admin'),
  createProduct
);

router.patch(
  '/:id',
  validations,
  validateFields,
  validProductById,
  restrictTo('admin'),
  updateProduct
);

router.delete('/:id', validProductById, deleteProduct, restrictTo('admin'));

module.exports = {
  productRouter: router,
};
