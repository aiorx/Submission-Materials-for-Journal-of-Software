```javascript
const convertHttpResponse = (response, type, resource, params) => {
    const { headers, json } = response;

    switch (type) {
        case GET_LIST:
        case GET_MANY_REFERENCE:
            if ('count' in json){
                return { data: json.results, total: json.count }
            } else if (headers.has('content-range')) {
                return {
                    data: json,
                    total: parseInt(
                        headers
                        .get('content-range')
                        .split('/')
                        .pop(),
                        10
                    ),
                };
            } else if ('detail' in json && json.detail === 'Invalid page.') {
                return { data: [], total: 0 }
            } else {
                throw new Error(
                    'The total number of results is unknown. The DRF data provider ' +
                    'expects responses for lists of resources to contain this ' +
                    'information to build the pagination. If you\'re not using the ' +
                    'default PageNumberPagination class, please include this ' +
                    'information using the Content-Range header OR a "count" key ' +
                    'inside the response.'
                );
            }
        case CREATE:
            return { data: { ...params.data, id: json.id } };
        case DELETE:
            return { data: params.previousData };
        default:
            return { data: json };
    }
}
```