<template>
    <div>
        <h1>user data</h1>
        <router-link :to="{name: 'Profile', params: {id: 'me'} }">cancel</router-link>
        <form @submit.prevent="update">
            <span v-if="error" class="error">{{error}}</span>

            <div v-if="user.firstName.errors">
                <span v-for="(error, index) in user.firstName.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="text" v-model="user.firstName.value" :placeholder="user.firstName.name">

            <div v-if="user.lastName.errors">
                <span v-for="(error, index) in user.lastName.errors" :key="index" class="error">{{error}}</span>
            </div>
            <input type="text" v-model="user.lastName.value" :placeholder="user.lastName.name">

            <input type="submit" value="update">
        </form>
    </div>
</template>

<script>
import {mapState, mapActions} from "vuex"
import state from "../../store/types/state"
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
        update() {
            this.resetErrors()

            const fields = Object.values(this.user)

            const {
                firstName,
                lastName
            } = this.user

            validateLength(firstName)
            validateLength(lastName)

            if(fields.some(({errors}) => errors.length)) {
                return
            }
            
            this.updateUserData(mapFields(this.user)).then(() => this.$router.push({
                name: 'Profile', params: {id: "me"}
            })).catch(error => {
                console.log(error);
                this.error = error.response ? error.response.data.message : "connection error"
            })
        },
        ...mapActions({
            updateUserData: actions.UPDATE_USER_DATA
        })
    },
    computed: {
        ...mapState({
            userStore: state.USER
        })
    },
    created() {
        const {
            firstName: firstNameStore,
            lastName: lastNameStore
        } = this.userStore
        const {firstName, lastName} = this.user
        firstName.value = firstNameStore
        lastName.value = lastNameStore
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
