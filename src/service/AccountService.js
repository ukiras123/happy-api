const axios = require('axios');

const { MOODY_API_BASE_URL } = process.env;
const TOTAL_RETRIES_PER_API = 20;
// 15, 31,
async function getAccountsFromMoodyAPI(size, pageNum) {
  const result = [];
  let retries = 0;

  // If we were to query from a list of array (like DB), following would be start and end index
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
  let isFirst = true;
  const skipOnFirst = startIndex % 10;

  while (result.length < size && retries < TOTAL_RETRIES_PER_API) {
    const MOODY_URL = `${MOODY_API_BASE_URL}/page/${moodyAPIPageNumber}`;
    try {
      // Adding timeout here so that we can fail early and recover if we encounter longer timeout
      // Selecting timeout as 1000 ms since Moody API has average response time as 700 ms
      const response = await axios.get(MOODY_URL, {
        timeout: 1000,
      });
      const { message } = response.data;

      // Check if an object is empty on response message
      const hasEmptyObj = !!message.find((obj) => Object.keys(obj).length === 0).length > 0;
      if (hasEmptyObj) {
        throw new Error('Empty Object Found');
      }

      // On the first API call, we might need to skip few elements before capturing to result
      if (isFirst) {
        result.push(...message.slice(skipOnFirst));
      } else {
        result.push(...message);
      }

      // Go To Next Page
      moodyAPIPageNumber += 1;

      // If first API was success, changing retries to 0 for the next page API call
      retries = 0;

      // Since we are moving to next page on Moody API, changing isFirst to false
      isFirst = false;
    } catch (error) {
      console.error(`Request error: ${MOODY_URL}`, error.message);

      // Looks like Moody API only has 5000 records i.e. supports page till 500
      // We want to break from loop gracefully and not retry if we met this condition.
      if (error.response) {
        const { data } = error.response;
        if (data?.message === 'page number value not accepted') {
          break;
        }
      }
      retries += 1;
      console.log(`Retrying: ${retries}`);
    }
  }
  /* Finally, result might have some extra items at the end so skipping that.
     Example:
     If a user is requesting 1st page with size 15
     we need to remove the last 5 items from the result
     */
  return result.slice(0, endIndex - startIndex);
}

module.exports = {
  getAccountsFromMoodyAPI,
};
