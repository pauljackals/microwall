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
import api from "../services/api"

const defaultValue = (name, type="text", exclude) => ({
    name,
    value: undefined,
    errors: [],
    exclude,
    type
})
const maxLength = 32
export default {
    data() {
        return  {
            user: {
                username: defaultValue("username"),
                password: defaultValue("password", "password"),
                passwordRepeat: defaultValue("repeat password", "password", true),
                firstName: defaultValue("first name"),
                lastName: defaultValue("last name")
            },
            error: ""
        }
    },
    methods: {
        resetErrors() {
            Object.values(this.user).forEach(field => {
                field.errors = []
            })
            this.error = ""
        },
        register() {
            this.resetErrors()

            const fields = Object.values(this.user)

            fields.forEach(({value, errors, name, exclude}) => {
                if(exclude){
                    return
                }
                if(value===undefined || value.length===0) {
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

            if(fields.some(({errors, exclude}) => !exclude && errors.length)) {
                return
            }
            
            api.register(...[
                username,
                password,
                firstName,
                lastName
            ].map(field => field.value)).then(() => {
                this.$router.push({
                    name: 'Login'
                })

            }).catch(error => {
                this.error = error.response ? error.response.data.message : "connection error"
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
