const router = require('express').Router();

const { AccountController } = require('../controller');

router.get('/pageSize/:pageSize/page/:pageNumber', AccountController.getAccounts);

module.exports = router;
