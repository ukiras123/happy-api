const router = require('express').Router();

const { AccountController } = require('../controller');
const { joiMiddleware: { reqParamMiddleware }, joiSchema } = require('../middleware');

router.get(
  '/pageSize/:pageSize/page/:pageNumber',
  reqParamMiddleware(joiSchema.accounts.param),
  AccountController.getAccounts,
);

module.exports = router;
