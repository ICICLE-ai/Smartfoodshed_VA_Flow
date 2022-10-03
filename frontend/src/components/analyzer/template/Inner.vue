<template>
    <div class="card-inner" :style="{border: getBorder}">
        {{itemProps.inputData}}
        <v-overlay :value="loading_value">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {componentEnableDragHandler,componentDisableDragHandler,} from "@/utils/globalViewCardUtils/toolHelper.js";

export default{
  props: ['itemProps', 'fixed', 'innerStyle'], 
  components: {
  },  
  data () {
    return {
        selectedEntities: [], 
        selectedRelations: [],
        currentEntities: [], 
        currentRelations: [],
        lassoColor: "grey", 
        zoomPanColor: "green", 
        lassoStatus: false,
        zoomPanStatus: false, 
        lasso: null, 
        zoom: null, 
        loading_value:false,
        tip: null,
        user_defined_thre: 5,// user defined threshold to show how many nodes we want to see if we expand one node 
        neo4jd3 : null,
        brushed: {"entity_type": [], "relationship_type": []},
        showOverview:false, 
        showMaxRetrieve:false,
        fav: true,
        menu: false,
        message: false,
        hints: true,
        selectedColor: null, 
        showResThre: false, // resilience threshold bar 
        resilience_thre: 0,  // selected threshold of resilience 
        // min_resilience: 0,
        max_resilience: 1, // maximum value of the scroll bar for resilience threshold 
        FIXED: false,
       
      // custom
       
    }
  },
  created () {
    // this.$store.dispatch('getGraphOverview')
    // window['d3'] = d3
   
    
  },
  methods: {
    dblClickHandler() {
      this.toggleFixCompPos();
    }, 
    
    toggleFixCompPos() {
      this.FIXED = !this.FIXED;
      if (!this.dataStatus) {
        return;
      }
      if (this.FIXED) {
        componentDisableDragHandler(
          `.globalview-canvas-${this.itemProps.id}`,
          this.toolStatus
        );
      } else {
        componentEnableDragHandler(
          `.globalview-canvas-${this.itemProps.id}`,
          this.toolStatus
        );
      }
    },
    toolEnableToggleHandler(e) {
      alert(e)
    },
   
    
  },
  watch: {
    brushed:{
      handler(val){
          console.log(val);
      },
      deep:true 
    },
    
  },
  computed: {
    getBorder() {
      return this.FIXED ? "2px solid grey" : "None";
    }
  }
}
</script>
<style scoped>

.graph-btn-container{
    position: relative; 
    top: 5px;
}
.kg-view-btn{
  margin-right: 10px;
}

.circle-button:hover{
  cursor: pointer;
}

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
