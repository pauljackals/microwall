<template>
    <div>
        <h1>add post</h1>
        <form @submit.prevent="add">
            <textarea placeholder="text" v-model="post.text"></textarea>
            <select v-model="post.access">
                <option v-for="access in postAccessEnumValues" :key="access" :value="access">{{access}}</option>
            </select>
            <textarea placeholder="links" v-model="post.links"></textarea>
            <textarea placeholder="images" v-model="post.images"></textarea>
            <input type="submit" value="add">
        </form>
    </div>
</template>

<script>
import {mapActions} from "vuex"
import { ADD_POST } from '../../store/types/actions'
import {POST_ACCESS_ENUM} from "../../utils/types"

const validateUrls = urls => {
    if(urls===undefined) {
        return true
    }
    return urls.every(url => {
        try {
            return !!(new URL(url))
        } catch(err) {
            return false
        }
    })
}

const parseUrlsRaw = urlsRaw => {
    if(urlsRaw==="") {
        return undefined
    }
    return urlsRaw.split("\n")
}

export default {
    data(){
        return {
            post: {
                access: POST_ACCESS_ENUM.PUBLIC,
                text: "",
                links: "",
                images: ""
            }
        }
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
            const {text, access, links: linksRaw, images: imagesRaw} = this.post
            const links = parseUrlsRaw(linksRaw)
            const images = parseUrlsRaw(imagesRaw)
            if(!this.postAccessEnumValues.includes(access) || !text.length || !validateUrls(links) || !validateUrls(images)) {
                return
            }
            this.addPost({text, access, links, images}).then(() => {
                this.$router.push({name: access===POST_ACCESS_ENUM.PRIVATE ? "WallPrivate" : "WallPublic", params: {id:"me"}})

            }).catch(err => console.error(err))
        }
    }
}
</script>

<style scoped>
textarea, select, input {
    display: block;
}
</style>
