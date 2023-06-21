const allowedCharacters = /^[\*\/\[0-9\]\+\-\(\)\%\s\.]+$/

function doMath(expression, percent) {
    if (!allowedCharacters.test(expression)) throw new Error('One of your characters is invalid!');
    const parsed = expression
        .replace(
            /\d+%/g,
            (term) => term.includes('%') ? parseFloat(term) / 100 : term,
        );
    
    if (percent === true) return ((new Function(`return ${parsed}`))() * 100) + '%'
    return (new Function(`return ${parsed}`))()
}

module.exports = {
    doMath
}