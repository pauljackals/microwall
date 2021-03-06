import {io} from "socket.io-client"
import isDevelopment from "../utils/isDevelopment"

const baseURL = isDevelopment ? `http://localhost:${process.env.VUE_APP_SERVER_PORT || 5000}` : ''
const baseOptions = {
    withCredentials: true
}
const ioConfigured = (url, options={}) => io(`${baseURL}${url}`, {
    ...baseOptions,
    ...options
})

export default {
    listenToUser(id) {
        return ioConfigured(`/user/${id}`)
    },
    listenToPost(id, isPrivate) {
        return ioConfigured(`/post/${id}`, {
            forceNew: true,
            query: isPrivate!==undefined ? {isPrivate} : {}
        })
    },
    listenToMainWall() {
        return ioConfigured("/post")
    },
    listenToPublicWall(id) {
        return ioConfigured(`/user/${id}/public`)
    },
    listenToPrivateWall(id) {
        return ioConfigured(`/user/${id}/private`)
    }
}
