<template>
    <div>
        <h1 class="title has-text-centered">{{currentUser.username}}</h1>
        <h2 class="title has-text-centered">{{currentUser.firstName}} {{currentUser.lastName}}</h2>
        <div v-if="loggedIn">
            <div v-if="!downloadedUser" class="center-content">
                <router-link :to="{name: 'EditData'}" class="button is-info">edit user data</router-link>
                <router-link :to="{name: 'EditLogin'}" class="button is-info">edit login data</router-link>
                <router-link :to="{name: 'PostNew'}" class="button is-info">add post</router-link>
            </div>
            <div v-else-if="canInvite" class="center-content">
                <button @click="inviteFriend" class="button is-info">invite</button>
            </div>
            <div v-else-if="canAccept" class="center-content">
                <button @click="acceptFriend" class="button is-success">accept</button>
                <button @click="declineFriend" class="button is-danger">decline</button>
            </div>
            <div v-else-if="canCancel" class="center-content">
                <button @click="cancelFriend" class="button is-info">cancel</button>
            </div>
            <div v-else-if="canRemove" class="center-content">
                <button @click="removeFriend" class="button is-danger">unfriend</button>
            </div>
        </div>
        <div class="center-content">
            <router-link :to="{name: 'WallPublic'}" class="button is-info">public wall</router-link>
            <router-link v-if="loggedIn && (!downloadedUser || canRemove)" :to="{name: 'WallPrivate'}" class="button is-info">private wall</router-link>
        </div>
        <router-view v-if="checked" :key="$route.fullPath" :user="currentUser"/>
    </div>
</template>

<script>
import {mapState, mapActions, mapGetters} from "vuex"
import {USER} from "../store/types/state"
import {INVITE_FRIEND, CANCEL_FRIEND, ACCEPT_FRIEND, DECLINE_FRIEND, REMOVE_FRIEND} from "../store/types/actions"
import api from '../services/api'
import { FRIENDS_COMBINED, LOGGED_IN } from '../store/types/getters'

export default {
    name: "User",
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            downloadedUser: null,
            checked: false
        }
    },
    created(){
        if(this.user._id===this.id) {
            this.$router.replace({
                name: "Profile",
                params: {id: "me"}
            })

        } else if(this.id !== "me") {
            this.downloadedUser = {}
            api.getUser(this.id).then(response => {
                this.downloadedUser = response.data.user
                this.checked = true
            
            }).catch(() => this.$router.replace({
                name: "NotFound",
                params: {path: this.$route.fullPath.slice(1).split("/")}
            }))
            
        } else {
            this.checked = true
        }
    },
    computed: {
        ...mapState({
            user: USER
        }),
        ...mapGetters({
            loggedIn: LOGGED_IN,
            friendsCombined: FRIENDS_COMBINED
        }),
        currentUser() {
            return this.downloadedUser ?? this.user
        },
        canInvite() {
            return this.friendsCombined.every(invite => invite._id!==this.currentUser._id)
        },
        canAccept() {
            return this.user.invitesReceived.find(invite => invite._id===this.currentUser._id)
        },
        canCancel() {
            return this.user.invitesSent.find(invite => invite._id===this.currentUser._id)
        },
        canRemove() {
            return this.user.friends.find(invite => invite._id===this.currentUser._id)
        }
    },
    methods: {
        inviteFriend(){
            this.inviteFriendAction(this.currentUser).catch(err => console.error(err))
        },
        declineFriend(){
            this.declineFriendAction(this.currentUser).catch(err => console.error(err))
        },
        acceptFriend(){
            this.acceptFriendAction(this.currentUser).catch(err => console.error(err))
        },
        removeFriend(){
            this.removeFriendAction(this.currentUser).catch(err => console.error(err))
        },
        cancelFriend(){
            this.cancelFriendAction(this.currentUser).catch(err => console.error(err))
        },
        ...mapActions({
            inviteFriendAction: INVITE_FRIEND,
            declineFriendAction: DECLINE_FRIEND,
            acceptFriendAction: ACCEPT_FRIEND,
            removeFriendAction: REMOVE_FRIEND,
            cancelFriendAction: CANCEL_FRIEND
        }),
    }
}
</script>

<style scoped>
.center-content {
    display: flex;
    justify-content: center;
}
</style>
