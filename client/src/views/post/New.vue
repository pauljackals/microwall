<template>
    <div>
        <h1>add post</h1>
        <form @submit.prevent="add">
            <textarea placeholder="text" v-model="post.text"></textarea>
            <select v-model="post.access">
                <option v-for="access in postAccessEnumValues" :key="access" :value="access">{{access}}</option>
            </select>
            <input type="submit" value="add">
        </form>
    </div>
</template>

<script>
import {mapActions} from "vuex"
import { ADD_POST } from '../../store/types/actions'
import {POST_ACCESS_ENUM} from "../../utils/types"
export default {
    data(){
        return {
            post: {
                access: POST_ACCESS_ENUM.PUBLIC,
                text: ""
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
            const {text, access} = this.post
            if(!this.postAccessEnumValues.includes(access) || !text.length) {
                return
            }
            this.addPost({text, access}).then(() => {
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
