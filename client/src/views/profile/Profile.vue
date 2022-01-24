<template>
    <div>
        <h1>profile</h1>
        <div v-if="me">
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
        <h2>{{currentUser.username}}</h2>
        <h3>{{currentUser.firstName}} {{currentUser.lastName}}</h3>
    </div>
</template>

<script>
import {mapState, mapActions, mapGetters} from "vuex"
import state from "../../store/types/state"
import actions from "../../store/types/actions"
import getters from "../../store/types/getters"
import api from '../../servies/api'

export default {
    props: {
        id: {
            type: String
        },
        me: {
            type: Boolean
        }
    },
    data() {
        return {
            downloadedUser: {
                firstName: "",
                lastName: "",
                username: ""
            }
        }
    },
    created(){
        if(!this.me) {
            if(this.id === this.user._id){
                this.$router.replace({name: "MyProfile"})
            } else {
                api.getUser(this.id).then(response => {
                    this.downloadedUser = response.data.user
                })
            }
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
            return this.me ? this.user : this.downloadedUser
        },
        canInvite() {
            return this.loggedIn && this.friendsCombined.every(invite => invite._id!==this.currentUser._id)
        },
        canAccept() {
            return this.loggedIn && this.user.invitesReceived.find(invite => invite._id===this.currentUser._id)
        },
        canCancel() {
            return this.loggedIn && this.user.invitesSent.find(invite => invite._id===this.currentUser._id)
        },
        canRemove() {
            return this.loggedIn && this.user.friends.find(invite => invite._id===this.currentUser._id)
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
