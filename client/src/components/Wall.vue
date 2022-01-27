<template>
    <div>
        <h2>{{isPrivate ? "private" : "public"}} wall</h2>
        <PostList :posts="posts"/>
    </div>
</template>

<script>
import {POST_ACCESS_ENUM} from "../utils/types"
import {mapGetters, mapState} from "vuex"
import { LOGGED_IN } from '../store/types/getters'
import PostList from "./post/PostList.vue"
import { USER } from '../store/types/state'

export default {
    name: "Wall",
    props: {
        isPrivate: {
            type: Number,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            loggedIn: LOGGED_IN
        }),
        ...mapState({
            userStore: USER
        }),
        posts(){
            return (this.user.posts ?? []).filter(post => post.access!== (this.isPrivate ? POST_ACCESS_ENUM.PUBLIC : POST_ACCESS_ENUM.PRIVATE))
        }
    },
    created() {
        if(this.isPrivate===1 && !(this.loggedIn && this.userStore._id===this.user._id || this.userStore.friends.some(friend => friend._id===this.user._id))) {
            this.$router.replace({name: "WallPublic"})
        }
    },
    components: {
        PostList
    }
}
</script>
<style scoped>
.multiline {
    white-space: pre-wrap;
}
</style>
