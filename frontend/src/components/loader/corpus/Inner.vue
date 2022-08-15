<template>
  <div style="text-align: center; display: flex; height: 100%">
    <v-card-text class="card-name">
      <v-icon>
        mdi-database  
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
        <CorpusLoader
          @loaderAction="loaderAction"
        />
    </v-dialog>
  </div>
</template>

<script>
import CorpusLoader from './Loader.vue'
export default {
  props: ['itemProps'],
  components: {
    CorpusLoader
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
      if(e.status == "success"){
        delete e.status
        e.selected.cardId = this.itemProps.id
        this.$store.dispatch('corpus/addCorpus', e.selected)
      }
      this.dialog = false;
    },
  }, 
  computed: {
    selectedCorpusName(){
      if(this.itemProps.selectedTable){
        return this.itemProps.selectedTable.table
      }else{
        return 'No Corpus'
      }
    }
  }
}
</script>
<style>
.card-name{
    text-align: center;
    display: flex; 
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
  }
</style>