<template>
    <div>
        <h1>{{currentUser.username}}</h1>
        <h2>{{currentUser.firstName}} {{currentUser.lastName}}</h2>
        <div v-if="loggedIn">
            <div v-if="!downloadedUser">
                <router-link :to="{name: 'EditData'}">edit user data</router-link>
                <router-link :to="{name: 'EditLogin'}">edit login data</router-link>
            </div>
            <div v-else-if="canInvite">
                <button @click="inviteFriend">invite</button>
            </div>
            <div v-else-if="canAccept">
                <button @click="acceptFriend">accept</button>
                <button @click="declineFriend">decline</button>
            </div>
            <div v-else-if="canCancel">
                <button @click="cancelFriend">cancel</button>
            </div>
            <div v-else-if="canRemove">
                <button @click="removeFriend">unfriend</button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions, mapGetters} from "vuex"
import state from "../store/types/state"
import actions from "../store/types/actions"
import getters from "../store/types/getters"
import api from '../servies/api'

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
            downloadedUser: null
        }
    },
    created(){
        if(this.id !== "me") {
            this.downloadedUser = {}
            api.getUser(this.id).then(response => {
                this.downloadedUser = response.data.user
            })
        }
    },
    computed: {
        ...mapState({
            user: state.USER
        }),
        ...mapGetters({
            loggedIn: getters.LOGGED_IN,
            friendsCombined: getters.FRIENDS_COMBINED
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
            inviteFriendAction: actions.INVITE_FRIEND,
            declineFriendAction: actions.DECLINE_FRIEND,
            acceptFriendAction: actions.ACCEPT_FRIEND,
            removeFriendAction: actions.REMOVE_FRIEND,
            cancelFriendAction: actions.CANCEL_FRIEND
        }),
    }
}
</script>
