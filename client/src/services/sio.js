import {io} from "socket.io-client"

export default {
    listenToUser(id) {
        const sio = io(`http://localhost:5000/user/${id}`, {withCredentials: true})
        return sio
    }
}
