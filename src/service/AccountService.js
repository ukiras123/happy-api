const axios = require('axios');
const logger = require('../utils/logger');

const { MOODY_API_BASE_URL } = process.env;
const TOTAL_RETRIES_PER_API = 20;
// 15, 31,
async function getAccountsFromMoodyAPI(size, pageNum) {
  const result = [];
  let retries = 0;

  // Setting start and end index if we were to query create pagination from a list
  const startIndex = (pageNum - 1) * size;
  const endIndex = startIndex + size;

  /* Since Moody API only gives back 10 items per page, need to figure out
   the page number to begin with.
   If a user is requesting page size less than 10 then check the first page */
  let moodyAPIPageNumber = Math.ceil((startIndex + 1) / 10) || 1;

  /* We might need to skip few items in the beginning
     Example:
     If a user is requesting 4th page with size 5
     we need to start with moodyPageNumber 2 but skip the first 5 items */
  let skipItems = startIndex % 10;

  // Run the loop until retry count does not exceed and result is captured
  while (result.length < size && retries < TOTAL_RETRIES_PER_API) {
    const MOODY_URL = `${MOODY_API_BASE_URL}/page/${moodyAPIPageNumber}`;
    try {
      // Adding timeout here so that we can fail early and recover if we encounter longer timeout
      // Selecting timeout as 1000 ms since Moody API has average response time as 700 ms
      const response = await axios.get(MOODY_URL, {
        timeout: 1000,
      });
      const { message } = response.data;

      // Check if an object is empty.
      // Find method will not iterate all the item if empty object found
      // If Found, throw the error so it will go to retry logic
      const hasEmptyObj = !!message.find((obj) => Object.keys(obj).length === 0);
      if (hasEmptyObj) {
        throw new Error('Empty Object Found');
      }

      // On the first API call, we might need to skip few elements before capturing to result
      result.push(...message.slice(skipItems));

      // Go to next page
      moodyAPIPageNumber += 1;
      // No need to skip any items from Next API call. Only skip on first iteration
      skipItems = 0;
      // Changing retries to 0 for the next page API call to begin with 0 retries
      retries = 0;
    } catch (error) {
      logger.error(`Request error: ${MOODY_URL} -> ${error.message}.`);
      // Looks like Moody API only has 5000 records i.e. supports page till 500
      // Tomorrow it can be of any page size.
      // We want to break from loop gracefully and not retry if we met this condition.
      // SLA: Looking at error message to determine if MoodyAPI has any value
      if (error.response) {
        const { data } = error.response;
        if (data?.message === 'page number value not accepted') {
          break;
        }
      }

      // Retry again if failed
      // It catches all the errors:
      // 1. Array with empty object
      // 2. 500 error from moody
      // 3. Timeout. Fail Early strategy
      retries += 1;
      logger.info(`Retrying: ${MOODY_URL}, retry #: ${retries}`);
    }
  }
  /* Finally, result might have some extra items at the end so skipping that.
     Example:
     If a user is requesting 1st page with size 15
     we need to remove the last 5 items from the result.
     This is because of the default page size of 10 from MoodyAPI
     */
  return result.slice(0, endIndex - startIndex);
}

module.exports = {
  getAccountsFromMoodyAPI,
};
