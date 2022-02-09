<template>
    <div>
        <PostList :posts="mainWallPosts" :isPrivate="-1"/>
    </div>
</template>

<script>
import PostList from "../components/post/PostList.vue"
import { mapActions, mapMutations, mapState } from 'vuex'
import { GET_MAIN_WALL_POSTS } from '../store/types/actions'
import { MAIN_WALL_POSTS } from '../store/types/state'
import { CLEAR_MAIN_WALL_POSTS, SET_MAIN_WALL_POSTS } from '../store/types/mutations'

export default {
    created(){
        this.getMainWallPosts().catch(() => {})
    },
    methods: {
        ...mapActions({
            getMainWallPosts: GET_MAIN_WALL_POSTS
        }),
        ...mapMutations({
            setMainWallPosts: SET_MAIN_WALL_POSTS,
            clearMainWallPosts: CLEAR_MAIN_WALL_POSTS
        })
    },
    computed: {
        ...mapState({
            mainWallPosts: MAIN_WALL_POSTS
        })
    },
    components: {
        PostList
    },
    unmounted() {
        this.clearMainWallPosts()
    }
}
</script>
