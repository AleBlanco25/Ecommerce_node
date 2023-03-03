const { check } = require('express-validator');

exports.validations = [
  //!Create & Update Product
  check('title', 'The title is required').not().isEmpty(),
  check('description', 'The description is required').not().isEmpty(),
  check('quantity', 'The quantity is required').not().isEmpty(),
  check('quantity', 'The quantity must be a number').isNumeric(),
  check('price', 'The price is required').not().isEmpty(),
  check('price', 'The price must be a number').isNumeric(),
  check('categoryId', 'The categoryId is required').not().isEmpty(),
  check('categoryId', 'The categoryId must be a number').isNumeric(),
  check('userId', 'The userId is required').not().isEmpty(),
  check('userId', 'The userId must be a number').isNumeric(),
  //! Register, login & Update User
  check('username', 'The username must be mandatory').not().isEmpty(),
  check('email', 'The email must be mandatory').not().isEmpty(),
  check('email', 'The email must be a correct format').isEmail(),
  check('password', 'The password must be mandatory').not().isEmpty(),
  //! Create & update Cart
  check('productId', 'the productId is required').not().isEmpty(),
  check('productId', 'the productId must be a number').isNumeric(),
  check('newQty', 'the quantity is required').not().isEmpty(),
  check('newQty', 'the quantity must be a number').isNumeric(),
];
