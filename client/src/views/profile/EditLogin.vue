<template>
    <div>
        <h1>login data</h1>
        <router-link :to="{name: 'MyProfile'}">cancel</router-link>
        <form @submit.prevent="update">
            <span v-if="error" class="error">{{error}}</span>

            <div v-if="user.passwordOld.errors">
                <span v-for="(error, index) in user.passwordOld.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="password" v-model="user.passwordOld.value" :placeholder="user.passwordOld.name">

            <div v-if="user.password.errors">
                <span v-for="(error, index) in user.password.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="password" v-model="user.password.value" :placeholder="user.password.name">
            <input type="password" v-model="user.passwordRepeat.value" :placeholder="user.passwordRepeat.name">

            <input type="submit" value="update">
        </form>
    </div>
</template>

<script>
import {mapActions} from "vuex"
import actions from "../../store/types/actions"

const defaultValue = (name, type="text", value=undefined) => ({
    name,
    value,
    errors: [],
    type
})
const maxLength = 32
const validateLength = ({value, name, errors}) => {
    if(value===undefined || value.length===0) {
        errors.push(`${name} must not be empty`)

    } else if(value!==undefined && (value.length > maxLength)) {
        errors.push(`${name} must not be longer than ${maxLength} characters`)
    }
}
const mapFields = fields => Object.entries(fields).reduce((object, [key, value]) => {
    object[key]=value.value
    return object
}, {})

export default {
    data() {
        return  {
            user: {
                password: defaultValue("new password", "password"),
                passwordRepeat: defaultValue("repeat new password", "password"),
                passwordOld: defaultValue("old password", "password")
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
        update() {
            this.resetErrors()

            const fields = Object.values(this.user)

            const {
                password,
                passwordRepeat,
                passwordOld
            } = this.user

            validateLength(password)
            validateLength(passwordOld)
            validateLength(passwordRepeat)

            if(password.value!==passwordRepeat.value){
                password.errors.push("passwords don't match")
            }

            if(fields.some(({errors}) => errors.length)) {
                return
            }

            this.updateUserLogin(mapFields({password, passwordOld})).then(() => this.$router.push({
                name: 'MyProfile'
            })).catch(error => {
                    this.error = error.response ? error.response.data.message : "connection error"
                })
        },
        ...mapActions({
            updateUserLogin: actions.UPDATE_USER_LOGIN
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
