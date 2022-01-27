<template>
    <ul>
        <li v-for="post in posts" :key="post._id">
            <Post :post="post"/>
            <div v-if="loggedIn">
                <div v-if="post.commentsPublic">
                    <router-link :to="{name: 'Post', params: {id: post._id, access: isGeneral(post) ? 'public' : ''} }">
                        {{post.commentsPublic.length}}{{isGeneral(post) ? ' public' : ''}} comments
                    </router-link>
                </div>
                <div v-if="post.commentsPrivate">
                    <router-link :to="{name: 'Post', params: {id: post._id, access: isGeneral(post) ? 'private' : ''} }">
                        {{post.commentsPrivate.length}}{{isGeneral(post) ? ' private' : ''}} comments
                    </router-link>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
import Post from "./Post.vue"
import {mapGetters} from "vuex"
import { LOGGED_IN } from '../../store/types/getters'
import { POST_ACCESS_ENUM } from '../../utils/types'

export default {
    name: "PostList",
    components: {
        Post
    },
    props: {
        posts: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            loggedIn: LOGGED_IN
        })
    },
    methods: {
        isGeneral(post) {
            return post.access===POST_ACCESS_ENUM.GENERAL
        }
    }
}
</script>

<style>
li {
    margin-bottom: 10px;
}
</style>
