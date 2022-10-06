<template>
  <div class="card-inner">
    <vega-lite :data="values" mark="bar" :encoding="encoding"/>
    <!-- {{itemProps.inputData}} -->
  </div>
</template>

<script>
import VueVega from 'vue-vega'
import Vue from 'vue'

Vue.use(VueVega)
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
      values: [
        {a: 'A', b: 28}, {a: 'B', b: 55}, {a: 'C', b: 43},
        {a: 'D', b: 91}, {a: 'E', b: 81}, {a: 'F', b: 53},
        {a: 'G', b: 19}, {a: 'H', b: 87}, {a: 'I', b: 52}
      ],
      encoding: {
        x: {field: 'Program', type: 'ordinal'},
        y: {field: 'id', type: 'quantitative'}
      },
    }
  }, 
  methods: {

  
  },
  watch: {
    "itemProps.inputData": function (val, oldVal) {
    
      console.log("newVal, oldVal");
      console.log(val, oldVal)
      this.values = val
      
    },
   
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
  overflow:scroll;
}
</style>