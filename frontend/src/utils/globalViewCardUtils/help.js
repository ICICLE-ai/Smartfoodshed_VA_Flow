const KEYS = ['embedding', 'visualConstrains']
const contentForceKey = 'embedding'
function globalViewInputChecker(input) {
    let validatedInput = {
        embedding: null, 
        visualConstrains: null,
        ans_embeddings: null, 
    }
    if (input == null ||
        !lengthCheck(input, KEYS) ||
        !keysCheck(input, KEYS) || 
        !contentNonEmptyCheck(input)) {
        return {status: false, validatedInput} 
    } else {
        console.log("---!!!!!!---")
        console.log(input.inputData)
        let output = {status: true, validatedInput: {
            embedding: input.embedding, 
            visualConstrains: input.visualConstrains, 
        }}
        input.ans_embeddings && input.ans_embeddings.length > 0 
            ? output.validatedInput.ans_embeddings = input.ans_embeddings 
            : -1
        input.categories 
            ? output.validatedInput.categories = input.categories
            : -1
        input.data?(output.validatedInput.data = input.data):1
        input.tableNames?output.validatedInput.tableNames = input.tableNames:1
        return output
    }
}

function lengthCheck(input, bench) {
    if (Object.keys(input).length < bench.length) {
        console.log("lengthCheck fail")
        return false
    } else {
        return true
    }
}

function keysCheck(input, bench) {
    const keySet = Object.keys(input)
    for (let key of bench) {
        if (!keySet.includes(key)) {
            console.log("keysCheck")
            return false
        }
    }
    return true
}

function contentNonEmptyCheck(input) {
    if (input[contentForceKey] == null) {
        return false
    } else {
        return true
    }
}


function getSubsetOutputWithSelected(output, selected) {
    if (output.tableNames && output.data) {
        const tabName = output.tableNames[0]
        const dataFull = output.data[tabName]
        let returnedObj = {
            ...output 
        }
        returnedObj.data = {
            [tabName]: dataFull.filter(doc => selected.includes(doc.id || doc.cord_uid))
        }
        returnedObj.embedding? (returnedObj.embedding = returnedObj.embedding.filter(d => selected.includes(d.id || d.cord_uid))): 1
        return returnedObj
    }else {
        alert('output from globalview error')
        return output
    }
}
export {globalViewInputChecker, getSubsetOutputWithSelected}