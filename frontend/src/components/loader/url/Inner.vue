<template>
  <div>
     <v-card-text class="card-name">
      <v-icon :color="activeColor">
        mdi-graph  
      </v-icon>
      <v-progress-circular
        indeterminate
        :width="2"
        color="green"
        v-if="itemProps.loadingStatus"
        :style="{position: 'static'}"
      ></v-progress-circular>
    </v-card-text>
    <v-dialog
      v-model="dialog"
      max-width="800"
    >
      <Loader
        @loaderAction="loaderAction"
      />
    </v-dialog>
  </div>
</template>

<script>
import Loader from './Loader.vue'
export default {
  props: ['itemProps'], 
  components: {
    Loader 
  },
  data() {
    return {
      dialog: false, 
    }
  },
  methods: {
    triggerDialog() {
      this.dialog = true 
    },
    loaderAction(e){
      console.log('loaderaction..',e)
      if(e.status == "success"){
        console.log('yes')
        delete e.status
        e.cardId = this.itemProps.id
        this.$store.dispatch('url/addUrl', e)
      }
      this.dialog = false;
    },
  }, 
  computed: {
    activeColor() {
      return this.itemProps.selectedGraphInstance 
        ? 'purple'
        : 'null'
    }
  }
}
</script>

<style scoped>
  .card-name{
    text-align: center;
    display: flex; 
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
  }
</style>