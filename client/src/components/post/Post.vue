<template>
    <li>
        <div>{{(new Date(post.date)).toLocaleString()}}</div>
        <div v-if="post.user">{{post.user.username}}</div>
        <div>{{post.access}}</div>
        <div class="multiline">{{post.text}}</div>
        <ul>
            <li v-for="(link, index) in post.links" :key="index"><a :href="link" target="_blank">{{link}}</a></li>
        </ul>
        <ul>
            <li v-for="(image, index) in post.images" :key="index"><img :src="image"></li>
        </ul>
        <div v-if="!details && loggedIn">
            <div v-if="isPrivate===-1">
                <div v-if="post.commentsPublic">
                    <router-link :to="{name: 'Post', params: {id: post._id, access: isGeneral ? 'public' : ''} }">{{post.commentsPublic.length}}{{isGeneral ? ' public' : ''}} comments</router-link>
                </div>
                <div v-if="post.commentsPrivate">
                    <router-link :to="{name: 'Post', params: {id: post._id, access: isGeneral ? 'private' : ''} }">{{post.commentsPrivate.length}}{{isGeneral ? ' private' : ''}} comments</router-link>
                </div>
            </div>
            <div v-else-if="isPrivate">
                <router-link :to="{name: 'Post', params: {id: post._id, access: isGeneral ? 'private' : ''} }">{{post.commentsPrivate.length}} comments</router-link>
            </div>
            <div v-else>
                <router-link :to="{name: 'Post', params: {id: post._id, access: isGeneral ? 'public' : ''} }">{{post.commentsPublic.length}} comments</router-link>
            </div>
        </div>
    </li>
</template>

<script>
import {mapGetters} from "vuex"
import { LOGGED_IN } from '../../store/types/getters'
import { POST_ACCESS_ENUM } from '../../utils/types'

export default {
    name: "Post",
    props: {
        post: {
            type: Object,
            required: true
        },
        isPrivate: {
            type: Number,
            required: true
        },
        details: {
            type: Boolean
        }
    },
    data() {
        return {
            postAccessEnum: POST_ACCESS_ENUM
        }
    },
    computed: {
        ...mapGetters({
            loggedIn: LOGGED_IN
        }),
        comments(){
            const comments = []
            if(this.post.access !== POST_ACCESS_ENUM.PRIVATE) {
                comments.push([this.post.commentsPublic, "public"])
            }
            if(this.post.access !== POST_ACCESS_ENUM.PUBLIC) {
                comments.push([this.post.commentsPrivate, "private"])
            }
            return comments
        },
        isGeneral() {
            return this.post.access===POST_ACCESS_ENUM.GENERAL
        }
    }
}
</script>
