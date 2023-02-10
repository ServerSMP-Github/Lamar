const { readdir } = require('fs').promises;

async function getFileList(dirName, filter) {
    let number = 0;
    let files = [];
    const items = await readdir(dirName, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory() && filter.recursively === true) {
            if (number++ >= filter.maxRecursion) break;
            files = [
                ...files,
                ...(await getFileList(`${dirName}/${item.name}`, filter)),
            ];
        } else if (item.name.endsWith(filter.type)) files.push(`${dirName}/${item.name}`);
    }

    return files;
}

module.exports = {
    getFileList
}