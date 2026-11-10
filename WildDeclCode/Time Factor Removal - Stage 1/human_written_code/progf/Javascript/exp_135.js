module.exports = async function (token) {
    var params = token.params;
var headers = token.headers;
    let result = ((await axios({
        method: 'get',
        url: 'https://maicai.api.ddxq.mobi/cart/allCheck',
        params: {
            ...params,
            is_check: 1,
            is_load: 1,
        },
        headers: headers,
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg || result.data.message);
    }
};