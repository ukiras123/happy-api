const logger = require('../utils/logger');
const { AccountService } = require('../service');

async function getAccounts(req, res) {
  logger.info('Getting Accounts');

  const { pageSize, pageNumber } = req.params;
  const size = parseInt(pageSize, 10);
  const pageNum = parseInt(pageNumber, 10);
  try {
    const result = await AccountService.getAccountsFromMoodyAPI(size, pageNum);
    res.json(result);
  } catch (e) {
    console.error('Error:', e.message);
    res.status(e.statusCode || 400).send({ message: `Something went wrong. ${e}` });
  }
}

module.exports = {
  getAccounts,
};
