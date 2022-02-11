<template>
    <div>
        <h1 class="title">users</h1>
        <form @submit.prevent="filterByUsername" class="box">
            <FormFieldErrors :field="user.username"/>
            <FormField :field="user.username" v-model="user.username.value"/>

            <input type="submit" value="filter" class="button is-info">
        </form>
        <UserList :users="users"/>
    </div>
</template>

<script>
import api from "../services/api"
import UserList from "../components/UserList.vue"
import { getFormField, validateFormFields, validateLength } from '../utils/functions'
import FormFieldErrors from "../components/form/FormFieldErrors.vue"
import FormField from "../components/form/FormField.vue"

export default {
    data() {
        return {
            users: [],
            user: {
                username: getFormField("username", [validateLength(32, 0)])
            }
        }
    },
    components: {
        UserList,
        FormFieldErrors,
        FormField
    },
    methods: {
        getUsers(username){
            api.getUsers(username).then(response => {
                this.users = response.data.users
            }).catch(() => {})
        },
        filterByUsername() {
            if(!validateFormFields(this.user)) {
                return
            }
            this.getUsers(this.user.username.value)
        }
    },
    created() {
        this.getUsers()
    }
}
</script>

<style scoped>
    h1 {
        text-align: center;
    }
    form {
        width: 500px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
