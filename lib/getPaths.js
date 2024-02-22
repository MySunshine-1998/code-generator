function getPaths(tag, paths) {
    let tagPaths = [];
    Object.keys(paths).forEach(path => {
        Object.keys(paths[path]).forEach(method => {
            if(paths[path][method] && paths[path][method].tags && paths[path][method].tags[0] == tag) {
                const tmp = paths[path][method];
                const functionName = ['delete'].includes(tmp.operationId)?tmp.operationId + capitalizeFirstLetter(path.split('/{')[0].split('/').pop()):tmp.operationId
                let tagPath = {
                    ...tmp,
                    url: path,
                    method,
                    functionName
                }
                tagPaths.push(tagPath)
            }
        })
    });
    return tagPaths;
}


// 字符串首字母大写
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = getPaths;