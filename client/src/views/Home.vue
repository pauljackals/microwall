<template>
    <div>
        <PostList :posts="mainWallPosts" :isPrivate="-1"/>
        <button v-if="!last && !clicked" class="button is-info is-centered" @click="getMorePosts">load more</button>
    </div>
</template>

<script>
import PostList from "../components/post/PostList.vue"
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { GET_MAIN_WALL_POSTS, GET_MAIN_WALL_POSTS_MORE } from '../store/types/actions'
import { MAIN_WALL_POSTS } from '../store/types/state'
import { CLEAR_MAIN_WALL_POSTS } from '../store/types/mutations'
import { MAIN_WALL_POSTS_LAST } from '../store/types/getters'

export default {
    data(){
        return {
            last: true,
            clicked: false
        }
    },
    created(){
        this.getMainWallPosts().then(last => this.last=last)
            .catch(() => {})
    },
    methods: {
        ...mapActions({
            getMainWallPosts: GET_MAIN_WALL_POSTS,
            getMainWallPostsMore: GET_MAIN_WALL_POSTS_MORE
        }),
        ...mapMutations({
            clearMainWallPosts: CLEAR_MAIN_WALL_POSTS
        }),
        getMorePosts() {
            this.clicked=true
            const {_id} = this.mainWallPostsLast
            this.getMainWallPostsMore({_id}).then(last => {
                this.last=last
                this.clicked=false

            }).catch(() => {})
        }
    },
    computed: {
        ...mapState({
            mainWallPosts: MAIN_WALL_POSTS
        }),
        ...mapGetters({
            mainWallPostsLast: MAIN_WALL_POSTS_LAST
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

<style scoped>
.button {
    margin-left: auto;
    margin-right: auto;
    display: block;
}
</style>
