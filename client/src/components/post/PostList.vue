<template>
    <ul>
        <li v-for="post in posts" :key="post._id">
            <Post :post="post"/>
            <div v-if="loggedIn">
                <div v-if="isPrivate!=1 && post.commentsPublic">
                    <router-link :to="getRouterLink(post, 'public')">
                        {{getRouterLinkText(post, post.commentsPublic, "public")}}
                    </router-link>
                </div>
                <div v-if="isPrivate!=0 && post.commentsPrivate">
                    <router-link :to="getRouterLink(post, 'private')">
                        {{getRouterLinkText(post, post.commentsPrivate, "private")}}
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
        },
        isPrivate: {
            type: Number,
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
        },
        getRouterLink(post, access) {
            return {name: 'Post', params: {id: post._id, access: this.isGeneral(post) ? access : ''} }
        },
        getRouterLinkText(post, comments, access) {
            return `${comments.length}${this.isPrivate===-1 && this.isGeneral(post) ? ` ${access}` : ''} comments`
        }
    }
}
</script>

<style>
li {
    margin-bottom: 10px;
}
</style>
