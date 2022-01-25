<template>
    <div>
        <h1>login</h1>
        <form @submit.prevent="login">
            <span v-if="error" class="error">{{error}}</span>

            <div v-if="user.username.errors">
                <span v-for="(error, index) in user.username.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="text" v-model="user.username.value" :placeholder="user.username.name">

            <div v-if="user.password.errors">
                <span v-for="(error, index) in user.password.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="password" v-model="user.password.value" :placeholder="user.password.name">

            <input type="submit" value="log in">
        </form>
    </div>
</template>

<script>
import {LOGIN} from "../store/types/actions"
import {mapActions} from "vuex"

const defaultValue = name => ({
    name,
    value: "",
    errors: []
})
const maxLength = 32
export default {
    data() {
        return  {
            user: {
                username: defaultValue("username"),
                password: defaultValue("password")
            },
            error: ""
        }
    },
    methods: {
        resetErrors() {
            Object.entries(this.user).forEach(entry => {
                const {errors} = entry[1]
                errors.splice(0, errors.length)
            })
            this.error = ""
        },
        login() {
            this.resetErrors()

            const userEntries = Object.entries(this.user)

            userEntries.forEach(entry => {
                const {value, errors, name} = entry[1]
                if(value.length===0) {
                    errors.push(`${name} must not be empty`)

                } else if(value.length > maxLength) {
                    errors.push(`${name} must not be longer than ${maxLength} characters`)
                }
            })

            const {
                username,
                password
            } = this.user

            if(userEntries.some(([_, {errors}]) => errors.length)) {
                return
            }

            this.loginStore(Object.entries({username, password}).reduce((object, [key, value]) => {
                object[key]=value.value
                return object

            }, {})).then(() => {
                this.$router.push({
                    name: 'Home'
                })

            }).catch(error => {
                this.error = error.response ? error.response.data.message : "connection error"
            })
        },
        ...mapActions({
            loginStore: LOGIN
        })
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
