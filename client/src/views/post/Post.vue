<template>
    <div>
        <h1>post</h1>
        <Post :post="post"/>
        <form @submit.prevent="addComment">
            <textarea v-model="comment.text" placeholder="text"></textarea>
            <input type="submit" value="send">
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

export default {
    data() {
        return {
            comment: {
                text: ""
            }
        }
    },
    components: {
        Post,
        Comment
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
            const {text} = this.comment
            this.commentCurrentPost({_id: this.post._id, text, isPrivate: !this.post.commentsPublic}).then(() => {
                this.comment.text = ""
            }).catch(err => console.error(err))
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
        this.getPost({_id: this.id, isPrivate}).catch(() => this.$router.push({name: "NotFound", params: {path: this.$route.fullPath.slice(1).split("/")}}))
    },
    unmounted(){
        this.clearCurrentPost()
    }
}
</script>
