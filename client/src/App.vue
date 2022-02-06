<template>
  <Navbar v-if="checked"/>
  <router-view v-if="checked"/>

  <h1 v-else class="title has-text-centered">loading</h1>
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
.error {
    display: block;
    color: red;
}
</style>
