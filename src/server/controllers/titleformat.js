exports.format = ((name) => {
    let splitting = name.split('_');
    let newstring = '';
    for (let i = 0; i < splitting.length; i++) {
        newstring += splitting[i].charAt(0).toUpperCase() + splitting[i].slice(1) + ' ';
    }
    return newstring.slice(0, newstring.length-1);
});