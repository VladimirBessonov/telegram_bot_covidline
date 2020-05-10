function listToMatrixKeyboard(list, elementsPerSubArray, cb) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(cb(...list[i]));
    }
    return matrix;
}

 async function asyncForEach(array, callback) {
    let arr =[]
    for (let index = 0; index < array.length; index++) {
        let value = await callback(array[index], index, array);
        arr.push(value)
    }
    return arr
}

// async function asyncForEach(array, callback) {
//     let arr =[]
//     for (let index = 0; index < array.length; index++) {
//         let value = await callback(array[index], index, array);
//         arr.push(value)
//     }
//     return arr
// }

function capitalize(str) {
        console.log(str)
        const words = []
        for (let word of str.split(' ')) {
            console.log(word)
            words.push( word[0] ? word[0].toUpperCase() + word.slice(1) : '')
        }
        return words.join(' ')
}


module.exports = {
    listToMatrixKeyboard,
    asyncForEach,
    capitalize
}


