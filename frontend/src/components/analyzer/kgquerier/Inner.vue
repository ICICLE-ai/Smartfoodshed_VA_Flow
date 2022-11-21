<template>
    <div class="card-inner" :style="{border: getBorder}">
        <!-- <v-card> -->
          <v-card-title>
            Knowledge Graph Querier 
          </v-card-title>
          <v-row>
            <v-col cols="5">
              <v-text-field
              v-model="endpoint"
              label="KG Endpoint"
              required
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
              v-model="giturl"
              label="Github URL of KG"
              required
              ></v-text-field>
            </v-col>
            </v-row>
            <v-btn
            color="success"
            class="mr-4"
            @click="query"
            :loading = "itemProps.loadingStatus"
            >
            Query
            </v-btn>
        <!-- </v-card> -->
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
      //  endpoint: 'http://dbpedia.org/sparql',
       endpoint: 'https://makg.org/sparql',
      // endpoint: '',
      giturl:'',
      // giturl: 'https://raw.githubusercontent.com/adhollander/PPODtottl/main/PPOD0.ttl'
    }
  },
  created () {
    // this.$store.dispatch('getGraphOverview')
    // window['d3'] = d3
   
    
  },
  methods: {
    query(){
      if(this.endpoint!="" &&  this.giturl==""){
        this.$store.dispatch('kgquerier/queryEndpoint', {'id': this.itemProps.id, 'url': this.endpoint})
      }else if(this.endpoint =="" && this.giturl!=''){
        this.$store.dispatch('kgquerier/queryTTL', {id: this.itemProps.id, url: this.giturl})
      }else{
        // this.$store.dispatch('kgquerier/queryGIT', {id: this.itemProps.id, 'url': this.dblClickHandler.})
        alert('please either enter an endpoint or github link to ttl file')
      }
    },
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
    'itemProps.inputData'(newval, oldval){
      console.log(newval)
    }
    
  },
  computed: {
    getBorder() {
      return this.FIXED ? "2px solid grey" : "None";
    }
  }
}
</script>
<style>
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
