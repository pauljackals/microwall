import {io} from "socket.io-client"

const baseURL = "http://localhost:5000"

export default {
    listenToUser(id) {
        const sio = io(`${baseURL}/user/${id}`, {withCredentials: true})
        return sio
    },
    listenToPost(id, isPrivate) {
        const sio = io(`${baseURL}/post/${id}`, {withCredentials: true, query: {isPrivate}})
        return sio
    }
}
