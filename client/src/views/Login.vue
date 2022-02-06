<template>
    <div>
        <h1 class="title has-text-centered">login</h1>
        <form @submit.prevent="login" class="box">
            <span v-if="error" class="error">{{error}}</span>

            <FormFieldErrors :field="user.username"/>
            <FormField :field="user.username"/>

            <FormFieldErrors :field="user.password"/>
            <FormField :field="user.password"/>

            <input type="submit" value="log in" class="button is-info">
        </form>
    </div>
</template>

<script>
import {LOGIN} from "../store/types/actions"
import {mapActions} from "vuex"
import { getFormField, mapFormFields, validateFormFields, validateLength } from '../utils/functions'
import FormFieldErrors from "../components/form/FormFieldErrors.vue"
import FormField from "../components/form/FormField.vue"

export default {
    data() {
        return  {
            user: {
                username: getFormField("username", [validateLength()]),
                password: getFormField("password", [validateLength(256)], "password"),
            },
            error: ""
        }
    },
    components: {
        FormFieldErrors,
        FormField
    },
    methods: {
        login() {
            this.error = ""

            if(!validateFormFields(this.user)) {
                return
            }

            this.loginStore(mapFormFields(this.user)).then(() => {
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
