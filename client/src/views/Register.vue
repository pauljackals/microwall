<template>
    <div>
        <h1 class="title has-text-centered">register</h1>
        <form @submit.prevent="register" class="box">
            <span v-if="error" class="error">{{error}}</span>

            <FormFieldErrors :field="user.username"/>
            <FormField :field="user.username" v-model="user.username.value"/>

            <FormFieldErrors :field="user.password"/>
            <FormField :field="user.password" v-model="user.password.value"/>
            <FormField :field="passwordRepeat" v-model="passwordRepeat.value"/>

            <FormFieldErrors :field="user.firstName"/>
            <FormField :field="user.firstName" v-model="user.firstName.value"/>

            <FormFieldErrors :field="user.lastName"/>
            <FormField :field="user.lastName" v-model="user.lastName.value"/>

            <input type="submit" value="register" class="button is-info">
        </form>
    </div>
</template>

<script>
import api from "../services/api"
import {getFormField, validateLength, validateFormFields, validatePasswordsMatch, mapFormFields} from "../utils/functions"
import FormFieldErrors from "../components/form/FormFieldErrors.vue"
import FormField from "../components/form/FormField.vue"

export default {
    data() {
        const passwordRepeat = getFormField("repeat password", [], "password")
        return {
            user: {
                username: getFormField("username", [validateLength()]),
                password: getFormField("password", [validateLength(256), validatePasswordsMatch(passwordRepeat)], "password"),
                firstName: getFormField("first name", [validateLength()]),
                lastName: getFormField("last name", [validateLength()])
            },
            error: "",
            passwordRepeat
        }
    },
    components: {
        FormFieldErrors,
        FormField
    },
    methods: {
        register() {
            this.error = ""

            if(!validateFormFields(this.user)) {
                return
            }

            const {
                username,
                password,
                firstName,
                lastName
            } = mapFormFields(this.user)

            api.register(username, password, firstName, lastName).then(() => {
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
    .error {
        display: block;
        color: red;
    }
    form {
        width: 500px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
