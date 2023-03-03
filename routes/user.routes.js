const { Router } = require('express');
const { check } = require('express-validator');
const {
  updateUser,
  deleteUser,
  findUsers,
  findUser,
  updatePassword,
  getOrders,
  getOrder,
} = require('../controllers/users.controllers');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middleware');
const { validIfExistUser } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');
const { validations } = require('../middlewares/validations.middleware');

const router = Router();

router.get('/', findUsers);

router.get('/orders', protect, getOrders);

router.get('/orders/:id', protect, getOrder);

router.get('/:id', validIfExistUser, findUser);

router.use(protect);

router.patch(
  '/:id',
  validations,
  validateFields,
  validIfExistUser,
  protectAccountOwner,
  updateUser
);

router.patch(
  '/password/:id',
  [
    check('currentPassword', 'The current password must be mandatory')
      .not()
      .isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),
    validateFields,
    validIfExistUser,
    protectAccountOwner,
  ],
  updatePassword
);

router.delete('/:id', validIfExistUser, protectAccountOwner, deleteUser);

module.exports = {
  usersRouter: router,
};
