<template>
    <div>
        <h1>post</h1>
        <Post :post="post"/>
        <ul>
            <li v-for="comment in (post.commentsPublic ?? post.commentsPrivate)"  :key="comment._id">
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
import { GET_POST } from '../../store/types/actions'
import { CLEAR_CURRENT_POST } from '../../store/types/mutations'

export default {
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
            getPost: GET_POST
        }),
        ...mapMutations({
            clearCurrentPost: CLEAR_CURRENT_POST
        })
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
