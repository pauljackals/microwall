<template>
  <Navbar v-if="checked"/>
  <router-view v-if="checked"/>
  <div v-else>loading</div>
</template>

<script>
import Navbar from "./components/Navbar.vue"
import {mapActions} from "vuex"
import {GET_USER_DATA} from "./store/types/actions"

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      checked: false
    }
  },
  created() {
    this.getUserData().catch(() => {})
      .finally(() => this.checked=true)
  },
  methods: {
    ...mapActions({
      getUserData: GET_USER_DATA
    })
  }
}
</script>

<style>
.wrapper-inline {
  display: inline;
}
</style>
