<template>
    <div>
        <h1 class="title has-text-centered">edit data</h1>
        <div class="center-content">
            <router-link :to="{name: 'Profile', params: {id: 'me'} }" class="button is-info">cancel</router-link>
        </div>
        <form @submit.prevent="update" class="box">
            <span v-if="error" class="error">{{error}}</span>

            <!-- <FormFieldErrors :field="user.username"/>
            <FormField :field="user.username" v-model="user.username.value"/> -->

            <FormFieldErrors :field="user.firstName"/>
            <FormField :field="user.firstName" v-model="user.firstName.value"/>

            <FormFieldErrors :field="user.lastName"/>
            <FormField :field="user.lastName" v-model="user.lastName.value"/>

            <input type="submit" value="update" class="button is-info">
        </form>
    </div>
</template>

<script>
import {mapState, mapActions} from "vuex"
import {USER} from "../../store/types/state"
import {UPDATE_USER_DATA} from "../../store/types/actions"
import { getFormField, mapFormFields, validateFormFields, validateLength } from '../../utils/functions'
import FormFieldErrors from "../../components/form/FormFieldErrors.vue"
import FormField from "../../components/form/FormField.vue"

export default {
    data() {
        return  {
            user: {
                // username: getFormField("username", [validateLength()]),
                firstName: getFormField("last name", [validateLength()]),
                lastName: getFormField("last name", [validateLength()])
            },
            error: ""
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
            
            this.updateUserData(mapFormFields(this.user)).then(() => this.$router.push({
                name: 'Profile',
                params: {id: "me"}

            })).catch(error => {
                this.error = error.response ? error.response.data.message : "connection error"
            })
        },
        ...mapActions({
            updateUserData: UPDATE_USER_DATA
        })
    },
    computed: {
        ...mapState({
            userStore: USER
        })
    },
    created() {
        const {
            firstName: firstNameStore,
            lastName: lastNameStore,
            // username: usernameStore
        } = this.userStore

        const {
            firstName,
            lastName,
            // username
        } = this.user

        firstName.value = firstNameStore
        lastName.value = lastNameStore
        // username.value = usernameStore
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
