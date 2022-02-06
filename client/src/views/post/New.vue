<template>
    <div>
        <h1 class="title has-text-centered">add post</h1>
        <form @submit.prevent="add">
            <span v-if="error" class="error">{{error}}</span>

            <FormFieldErrors :field="post.text"/>
            <FormTextarea :field="post.text" v-model="post.text.value"/>

            <FormFieldErrors :field="post.access"/>
            <select v-model="post.access.value" class="select is-normal">
                <option v-for="access in postAccessEnumValues" :key="access" :value="access">{{access}}</option>
            </select>

            <FormFieldErrors :field="post.links"/>
            <FormTextarea :field="post.links" v-model="post.links.value"/>

            <FormFieldErrors :field="post.images"/>
            <FormTextarea :field="post.images" v-model="post.images.value"/>

            <input type="submit" value="add" class="button is-info">
        </form>
    </div>
</template>

<script>
import {mapActions} from "vuex"
import { ADD_POST } from '../../store/types/actions'
import {POST_ACCESS_ENUM} from "../../utils/types"
import FormFieldErrors from '../../components/form/FormFieldErrors.vue'
import FormTextarea from '../../components/form/FormTextarea.vue'
import { getFormField, mapFormFields, validateEnum, validateFormFields, validateLength, validateUrls } from '../../utils/functions'

export default {
    data(){
        return {
            post: {
                access: getFormField("access", [validateEnum(POST_ACCESS_ENUM)], "select", POST_ACCESS_ENUM.PUBLIC),
                text: getFormField("text", [validateLength(1024)], "textarea"),
                links: getFormField("links", [validateLength(16384, 0), validateUrls], "textarea"),
                images: getFormField("images", [validateLength(16384, 0), validateUrls], "textarea")
            },
            error: ""
        }
    },
    components: {
        FormFieldErrors,
        FormTextarea
    },
    computed: {
        postAccessEnumValues(){
            return Object.values(POST_ACCESS_ENUM).sort()
        }
    },
    methods: {
        ...mapActions({
            addPost: ADD_POST
        }),
        add(){
            this.error = ""

            if(!validateFormFields(this.post)) {
                return
            }

            const {access, links, images} = this.post
            this.addPost({
                ...mapFormFields(this.post),
                links: links.valueParsed,
                images: images.valueParsed

            }).then(() => {
                this.$router.push({name: access.value===POST_ACCESS_ENUM.PRIVATE ? "WallPrivate" : "WallPublic", params: {id:"me"}})

            }).catch(error => {
                this.error = error.response ? error.response.data.message : "connection error"
            })
        }
    }
}
</script>

<style scoped>
form {
    width: 800px;
    margin-left: auto;
    margin-right: auto;
}
</style>
