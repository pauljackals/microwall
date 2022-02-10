<template>
    <div>
        <h1 class="title has-text-centered">{{currentUser.username}}</h1>
        <h2 class="title has-text-centered">{{currentUser.firstName}} {{currentUser.lastName}}</h2>
        <div v-if="loggedIn">
            <div v-if="!downloadedUser" class="center-content">
                <router-link :to="{name: 'EditData'}" class="button is-info">edit data</router-link>
                <router-link :to="{name: 'EditLogin'}" class="button is-info">edit password</router-link>
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
import {mapState, mapActions, mapGetters, mapMutations} from "vuex"
import {CURRENT_USER, USER} from "../store/types/state"
import {INVITE_FRIEND, CANCEL_FRIEND, ACCEPT_FRIEND, DECLINE_FRIEND, REMOVE_FRIEND, GET_CURRENT_USER} from "../store/types/actions"
import { FRIENDS_COMBINED, LOGGED_IN } from '../store/types/getters'
import { CLEAR_CURRENT_USER } from '../store/types/mutations'

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
            downloadedUser: false,
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
            this.downloadedUser = true
            this.getCurrentUser({_id: this.id}).then(() => {
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
            user: USER,
            currentUserStore: CURRENT_USER
        }),
        ...mapGetters({
            loggedIn: LOGGED_IN,
            friendsCombined: FRIENDS_COMBINED
        }),
        currentUser() {
            return this.downloadedUser ? this.currentUserStore : this.user
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
            this.inviteFriendAction(this.currentUser).catch(() => {})
        },
        declineFriend(){
            this.declineFriendAction(this.currentUser).catch(() => {})
        },
        acceptFriend(){
            this.acceptFriendAction(this.currentUser).catch(() => {})
        },
        removeFriend(){
            this.removeFriendAction(this.currentUser).catch(() => {})
        },
        cancelFriend(){
            this.cancelFriendAction(this.currentUser).catch(() => {})
        },
        ...mapActions({
            inviteFriendAction: INVITE_FRIEND,
            declineFriendAction: DECLINE_FRIEND,
            acceptFriendAction: ACCEPT_FRIEND,
            removeFriendAction: REMOVE_FRIEND,
            cancelFriendAction: CANCEL_FRIEND,
            getCurrentUser: GET_CURRENT_USER
        }),
        ...mapMutations({
            clearCurrentUser: CLEAR_CURRENT_USER
        })
    },
    unmounted(){
        this.clearCurrentUser()
    }
}
</script>

<style scoped>
.center-content {
    display: flex;
    justify-content: center;
}
</style>
