const axios = require("axios");

const { MOODY_API_BASE_URL } = process.env;


// 15, 31,
async function getAccountsFromMoodyAPI(size, pageNum) {
    let result = [];
    const startIndex = (pageNum - 1) * size;
    const endIndex = startIndex + size;
    let retries = 0;
    let isFirst = true;
    let initialPage = Math.floor(startIndex / 10) || 1; // Each page just give us 10 values (3.x)
    while (result.length < size && retries < 20) {
        const GET_MOODY_URL = `${MOODY_API_BASE_URL}/page/${initialPage}`
        try {
            const response = await axios.get(GET_MOODY_URL, {
                timeout: 1000
            });
            const { message } = response.data;

            // Filter out any empty objects
            const hasEmptyObj = message.filter(obj => Object.keys(obj).length === 0).length > 0;
            if(hasEmptyObj){
                throw new Error(`Empty Object Found`)
            }

            if(isFirst){
                result.push(message.slice(startIndex));
            }else{

            }

            initialPage += 1;
            retries = 0;
            isFirst = false;
        } catch (error) {
            console.error('Request error:', error.message);
            retries++;
            console.log(`${GET_MOODY_URL}, Retrying: ${retries}`)
        }
    }

    return result.slice(0, endIndex - startIndex);
}

module.exports = {
    getAccountsFromMoodyAPI,
};
