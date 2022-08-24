<template>
  <div>
    <v-app-bar
      app
      dense
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Flow is All You Need - ICICLE</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        rounded
        @click="toggleVisMode"
        style="color: purple"
      >
        {{getMode}}
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  methods: {
    toggleVisMode() {
      this.$store.dispatch('toggleVisMode')
    }
  },
  computed: {
    ...mapState(['vismode']), 
    getMode() {
      if (this.vismode) {
        return 'To Editing Mode'
      }else {
        return 'To Vis Mode'
      }
    }
  }
}
</script>

<style>

</style>