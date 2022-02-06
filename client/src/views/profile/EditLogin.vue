<template>
    <div>
        <h1 class="title has-text-centered">edit password</h1>
        <div class="center-content">
            <router-link :to="{name: 'Profile', params:{id:'me'} }" class="button is-info">cancel</router-link>
        </div>
        <form @submit.prevent="update" class="box">
            <span v-if="error" class="error">{{error}}</span>

            <FormFieldErrors :field="user.passwordOld"/>
            <FormField :field="user.passwordOld"/>

            <FormFieldErrors :field="user.password"/>
            <FormField :field="user.password"/>
            <FormField :field="passwordRepeat"/>

            <input type="submit" value="update" class="button is-info">
        </form>
    </div>
</template>

<script>
import {mapActions} from "vuex"
import {UPDATE_USER_LOGIN} from "../../store/types/actions"
import { getFormField, mapFormFields, validateFormFields, validateLength, validatePasswordsMatch } from '../../utils/functions'
import FormFieldErrors from "../../components/form/FormFieldErrors.vue"
import FormField from "../../components/form/FormField.vue"

export default {
    data() {
        const passwordRepeat = getFormField("repeat password", [], "password")
        return  {
            user: {
                password: getFormField("new password", [validateLength(256), validatePasswordsMatch(passwordRepeat)], "password"),
                passwordOld: getFormField("old password", [validateLength(256)], "password")
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
        update() {
            this.error = ""
            
            if(!validateFormFields(this.user)) {
                return
            }

            this.updateUserLogin(mapFormFields(this.user)).then(() => this.$router.push({
                name: 'Profile',
                params:{id:'me'}

            })).catch(error => {
                this.error = error.response ? error.response.data.message : "connection error"
            })
        },
        ...mapActions({
            updateUserLogin: UPDATE_USER_LOGIN
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
    .center-content {
        display: flex;
        justify-content: center;
    }
</style>
