const getFormField = (name, validators=[], type="text", value=undefined) => {
    return {
        name,
        value,
        errors: [],
        type,
        validate() {
            this.errors = []
            return validators.map(validator => validator(this))
                .every(validator => validator)
        },
        reset() {
            this.errors = []
            this.value = undefined
        }
    }
}

const validateLength = (maxLength=32, minLength=1) => ({value, errors, name}) => {
    if(minLength && (value===undefined || value.length < minLength)) {
        errors.push(`${name} must not be ${minLength===1 ? "empty" : `shorter than ${minLength}`}`)
        return false

    } else if(value && value.length > maxLength) {
        errors.push(`${name} must not be longer than ${maxLength}`)
        return false

    } else {
        return true
    }
}

const validatePasswordsMatch = repeatPasswordField => ({value, errors}) => {
    const {value: valueRepeat} = repeatPasswordField

    const excludedValues = [undefined, ""]
    if(excludedValues.includes(value) && excludedValues.includes(valueRepeat)) {
        return true

    } else if(value !== valueRepeat) {
        errors.push("passwords don't match")
        return false

    } else {
        return true
    }
}

const validateUrls = field => {
    const {value, errors, name} = field

    if(value===undefined || value==="") {
        return true
    }

    const urls = value.split("\n")
    const result = urls.every(url => {
        try {
            return !!(new URL(url))
        } catch(err) {
            return false
        }
    })

    if(!result) {
        errors.push(`${name} are invalid`)
    } else {
        field.valueParsed = urls
    }
    return result
}

const validateEnum = enum_ => ({value, errors, name}) => {
    if(!Object.values(enum_).includes(value)) {
        errors.push(`${name} is invalid`)
        return false
    }
    return true
}

const validateFormFields = fields => Object.values(fields)
    .map(field => field.validate())
    .every(field => field)

const mapFormFields = fields => Object.entries(fields).reduce((object, [key, value]) => {
    object[key]=value.value
    return object
}, {})

export {
    getFormField,
    validateLength,
    validateFormFields,
    validatePasswordsMatch,
    mapFormFields,
    validateUrls,
    validateEnum
}
