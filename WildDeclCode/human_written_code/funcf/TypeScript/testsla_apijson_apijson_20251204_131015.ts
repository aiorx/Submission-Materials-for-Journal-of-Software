```typescript
const GetOrder = (where: any) => {
    let result = where[ORDER]
    if (result) {
        result = result.split(',')
        Reflect.deleteProperty(where, ORDER)
        let _result = {}
        for (let item of result) {
            if (item.endsWith('+')) {
                _result[item.replace('+', '')] = 'ASC'
            } else if (item.endsWith('-')) {
                _result[item.replace('-', '')] = 'DESC'
            } else {
                _result[item] = 'ASC'
            }
        }
        return _result
    } else {
        return null
    }
}
```