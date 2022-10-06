<template>
  <div class="card-inner">
    <v-card-text v-if="!dataStatus" class="card-name">
      No Table Data
    </v-card-text>
    
    <template v-if="dataStatus">
      <div>
        <v-card-title>
           Table Viewer
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <template>
          <v-data-table
            :loading="loadingStatus"
            :headers="headers"
            :items="desserts"
            class="elevation-1"
            :height="`${itemProps.height - 50 - 70}px`"
            :search="search"
            show-select
            ref="table"
            :single-select="false"
            v-model="selected"
          >
          </v-data-table>
        </template>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  props: ['itemProps'], 
  data() {
    return {
      dataStatus: false, 
      loadingStatus: undefined,
      selected: [],
      search: "",
      sheets: [], 
      headers: [],
      desserts: [],
      currentDataBase: [],
      answerBasedRetrieval: {},
      currentSheet: "", 
      flag: false,
      tableItemKey: "",
    }
  }, 
  methods: {
  },
  watch: {
    "itemProps.inputData": function (val, oldVal) {
      var temp_headers = []
      for(let key in val[0]){
        temp_headers.push({
          text: key,
          value: key
        })
      }
      this.headers = temp_headers
      this.desserts = val
      if(val){
        this.dataStatus = true
      }
    },
    dataStatus: function(val, oldVal) {
      if (val) {
        const resizerBElelemt = document.querySelector("#" + this.itemProps.id).querySelector(".resizer-b"); 
        const heightOfSheet = 25;
        resizerBElelemt.style.bottom = (-heightOfSheet - 12) + "px"; 
      }
    },
    selected() {
      console.log(`table ${this.itemProps.id} selected items updated`) 
      console.log(this.selected)
      this.$store.dispatch('documents/updateSelectedItems', {id: this.itemProps.id, selected: this.selected})
    }
  }
}
</script>

<style scoped>
.card-name {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
  }

.card-inner{
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}
</style>