<template>
    <div>
        <h1>register</h1>
        <form @submit.prevent="register">
            <span v-if="error" class="error">{{error}}</span>

            <div v-if="user.username.errors">
                <span v-for="(error, index) in user.username.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="text" v-model="user.username.value" :placeholder="user.username.name">

            <div v-if="user.password.errors">
                <span v-for="(error, index) in user.password.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="password" v-model="user.password.value" :placeholder="user.password.name">
            <input type="password" v-model="user.passwordRepeat.value" :placeholder="user.passwordRepeat.name">

            <div v-if="user.firstName.errors">
                <span v-for="(error, index) in user.firstName.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="text" v-model="user.firstName.value" :placeholder="user.firstName.name">

            <div v-if="user.lastName.errors">
                <span v-for="(error, index) in user.lastName.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="text" v-model="user.lastName.value" :placeholder="user.lastName.name">

            <input type="submit" value="register">
        </form>
    </div>
</template>

<script>
import Api from "../servies/Api"

const defaultValue = (name, noCheck) => ({
    name,
    value: "",
    errors: !noCheck && []
})
const maxLength = 32
export default {
    data() {
        return  {
            user: {
                username: defaultValue("username"),
                password: defaultValue("password"),
                passwordRepeat: defaultValue("repeat password", true),
                firstName: defaultValue("first name"),
                lastName: defaultValue("last name")
            },
            error: ""
        }
    },
    methods: {
        resetErrors() {
            Object.entries(this.user).forEach(entry => {
                const {errors} = entry[1]
                if(!errors){
                    return
                }
                errors.splice(0, errors.length)
            })
            this.error = ""
        },
        register() {
            this.resetErrors()

            const userEntries = Object.entries(this.user)

            userEntries.forEach(entry => {
                const {value, errors, name} = entry[1]
                if(!errors){
                    return
                }
                if(value.length===0) {
                    errors.push(`${name} must not be empty`)

                } else if(value.length > maxLength) {
                    errors.push(`${name} must not be longer than ${maxLength} characters`)
                }
            })

            const {
                username,
                password,
                passwordRepeat,
                firstName,
                lastName
            } = this.user

            if(password.value!==passwordRepeat.value) {
                password.errors.push("passwords don't match")
            }

            if(userEntries.some(entry => entry[1].errors.length)) {
                return
            }
            
            Api.register(...[
                username,
                password,
                firstName,
                lastName
            ].map(field => field.value)).then(() => {
                this.$router.push({
                    name: 'Home'
                })

            }).catch(error => {
                this.error = error.response ? error.response.data.message : "server error"
            })
        }
    }
}
</script>

<style scoped>
    input {
        display: block;
    }
    .error {
        display: block;
        color: red;
    }
</style>
