const Joi = require('joi');

const schemas = {
  accounts: {
    param: Joi.object().keys({
      pageNumber: Joi.number().greater(0).required(),
      pageSize: Joi.number().valid(5, 10, 15, 20).required(),
    }),
  },
};

module.exports = schemas;
