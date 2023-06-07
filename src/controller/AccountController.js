const logger = require('../utils/logger');
const {AccountService} = require("../service");

function HTTPError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function  getAccounts(req, res) {
    logger.info('Getting Accounts');

    const { pageSize, pageNumber } = req.params;
    const size = parseInt(pageSize); // 15
    const pageNum = parseInt(pageNumber); // 3

    try {
        // Calculate the range of objects to retrieve based on page size and number


        // Make the necessary requests to the Moody API to get the desired objects
        const objects = await AccountService.getAccountsFromMoodyAPI(size, pageNum);

        // Return the objects as a response to the client
        res.json(objects);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAccounts,
};
