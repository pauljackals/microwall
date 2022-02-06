<template>
    <div>
        <h1 class="title has-text-centered">post</h1>
        <Post :post="post" class="post"/>

        <form @submit.prevent="addComment">
            <span v-if="error" class="error">{{error}}</span>

            <FormFieldErrors :field="comment.text"/>
            <FormTextarea :field="comment.text" v-model="comment.text.value"/>

            <input type="submit" value="send" class="button is-info">
        </form>

        <ul>
            <li v-for="comment in (post.commentsPublic ?? post.commentsPrivate)" :key="comment._id">
                <Comment :comment="comment"/>
            </li>
        </ul>
    </div>
</template>

<script>
import Post from "../../components/post/Post.vue"
import Comment from "../../components/Comment.vue"
import {mapActions, mapState, mapMutations} from "vuex"
import { CURRENT_POST } from '../../store/types/state'
import { COMMENT_CURRENT_POST, GET_POST } from '../../store/types/actions'
import { CLEAR_CURRENT_POST } from '../../store/types/mutations'
import { getFormField, mapFormFields, validateFormFields, validateLength } from '../../utils/functions'
import FormFieldErrors from '../../components/form/FormFieldErrors.vue'
import FormTextarea from '../../components/form/FormTextarea.vue'

export default {
    data() {
        return {
            comment: {
                text: getFormField("text", [validateLength(256)], "textarea")
            },
            error: ""
        }
    },
    components: {
        Post,
        Comment,
        FormFieldErrors,
        FormTextarea
    },
    computed: {
        ...mapState({
            post: CURRENT_POST
        })
    },
    methods: {
        ...mapActions({
            getPost: GET_POST,
            commentCurrentPost: COMMENT_CURRENT_POST
        }),
        ...mapMutations({
            clearCurrentPost: CLEAR_CURRENT_POST
        }),
        addComment() {
            this.error = ""

            if(!validateFormFields(this.comment)) {
                return
            }
            
            this.commentCurrentPost({
                ...mapFormFields(this.comment),
                _id: this.post._id,
                isPrivate: !this.post.commentsPublic

            }).then(() => {
                this.comment.text.reset()

            }).catch(error => {
                this.error = error.response ? error.response.data.message : "connection error"
            })
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },
        access: {
            type: String
        }
    },
    created() {
        const isPrivate = this.access==="public" ? false : (this.access==="private" ? true : undefined)
        this.getPost({_id: this.id, isPrivate}).catch(() =>
            this.$router.push({name: "NotFound", params: {path: this.$route.fullPath.slice(1).split("/")}})
        )
    },
    unmounted(){
        this.clearCurrentPost()
    }
}
</script>
<style scoped>
.post {
    width: 800px;
    margin-left: auto;
    margin-right: auto;
}
form {
    width: 600px;
    margin: 20px auto
}
ul {
    width: 600px;
    margin-left: auto;
    margin-right: auto;
}
.error {
    display: block;
    color: red;
}
</style>