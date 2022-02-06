const getFormField = (name, validators=[], type="text") => {
    return {
        name,
        value: undefined,
        errors: [],
        type,
        validate() {
            this.resetErrors()
            return validators.map(validator => validator(this))
                .every(validator => validator)
        },
        resetErrors() {
            this.errors = []
        }
    }
}

const validateLength = (maxLength=32, minLength=1) => ({value, errors, name}) => {
    if(value===undefined || value.length < minLength) {
        errors.push(`${name} must not be ${minLength===1 ? "empty" : `shorter than ${minLength}`}`)
        return false

    } else if(value.length > maxLength) {
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
    mapFormFields
}
