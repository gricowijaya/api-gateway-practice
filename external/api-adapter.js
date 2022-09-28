const axios = require('axios');

module.exports = (baseUrl) => {
    return axios.create({
        baseURL: baseUrl,     // URL nya pada keynya harus besar
        timeout: 60000        // bila request lama maka akan dikembalikan error dalam ms
    });
}
