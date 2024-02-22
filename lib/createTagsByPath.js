const requestMethod = ['post', 'get', 'delete', 'put', 'patch', 'options', 'head']

function createTagsByPath(paths) {
    const res = Object.keys(paths).map((key) => {
        const path = paths[key];
        let item;
        for (let i = 0; i < requestMethod.length; i++) {
            if(path[requestMethod[i]]) {
                item = path[requestMethod[i]];
                break;
            }
        }
        return item.tags[0]
    })
    return [...new Set(res)]
}

module.exports = createTagsByPath