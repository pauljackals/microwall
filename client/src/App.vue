<template>
  <Navbar/>
  <router-view/>
</template>

<script>
import Navbar from "./components/Navbar.vue"
import {mapActions} from "vuex"
import actions from "./store/types/actions"

export default {
  name: 'App',
  components: {
    Navbar
  },
  created() {
    this.getUserData().then(() => {}).catch(() => {})
  },
  methods: {
    ...mapActions({
      getUserData: actions.GET_USER_DATA
    })
  }
}
</script>

<style>
.wrapper-inline {
  display: inline;
}
</style>
