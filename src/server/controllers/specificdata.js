exports.data = ((table, type) => {
    let arr = []
    for (let i in table) {
        if (table[i].indexOf(`${type}_`) >= 0) {
            arr.push(table[i].replace(`${type}_`, ''));
        }
    }
    return arr;
});