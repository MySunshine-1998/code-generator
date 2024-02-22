const axios = require('axios');

const getApiData = async function(url) {
    return axios.get(url).then((res) => {
        console.log('获取swagger数据成功')
        return res;
    }).catch(() => {
        console.log('获取swagger数据失败')
    });
}

module.exports = getApiData;