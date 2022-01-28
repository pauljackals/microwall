import {io} from "socket.io-client"
import isDevelopment from "../utils/isDevelopment"

const baseURL = isDevelopment ? `http://localhost:5000` : ''

export default {
    listenToUser(id) {
        const sio = io(`${baseURL}/user/${id}`, {withCredentials: true})
        return sio
    },
    listenToPost(id, isPrivate) {
        const sio = io(`${baseURL}/post/${id}`, {withCredentials: true, auth: {isPrivate}})
        return sio
    }
}
