<template>
    <div class="card-inner" :style="{border: getBorder}">
        <!-- <div
          class="graph-btn-container"
        >
        <GlobalviewMenuBar
          @toolEnableToggle="toolEnableToggleHandler"
        />
        </div> -->
        <!-- <div id="div_graph" class="fullHeight" :style="{'height': '100%'}"></div>    -->
        <v-form
            ref="form"
            v-model="formData"
        >   
            <v-row>
                <v-col cols="5">
                    <v-text-field
                    v-model="linkml"
                    label="LinkML"
                    required
                    ></v-text-field>
                </v-col>
                <v-col cols="5">
                    <v-text-field
                    v-model="vocab"
                    label="Vocabulary"
                    required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-btn
            color="success"
            class="mr-4"
            @click="validate"
            :loading = "itemProps.loadingStatus"
            >
            Parse
            </v-btn>
        </v-form>
        <v-divider style="margin-top:7px; margin-bottom:4px"></v-divider>
        <v-row style="overflow: scroll">
          <v-col cols="3">
            <div v-if="showFilters" v-for="(ele,index) in filtersData" :style="{'width': filterWidth}">
                <v-select :items="ele.permissible_values"
                    item-text="name"
                    :label = "ele.name"
                    :ref = "'filter-'+ele.name"
                    multiple
                    style="height:50px"
                    @change="changeFilters"
                    v-model="selectedFilters[ele.name]"
                    item-value="meaning"
                    >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0">
                        <span>{{ item.name }}</span>
                      </v-chip>
                      <span
                        v-if="index === 1"
                        class="grey--text text-caption"
                      >
                        (+{{ selectedFilters[ele.name].length - 1 }} others)
                      </span>
                    </template>
                  </v-select>
                <!-- <el-select @change="changeFilters" v-model="selectedFilters[ele.name]" multiple :placeholder="ele.name" :ref="'filter-'+ele.name" automatic-dropdown collapse-tags fit-input-width	>
                    <el-option
                    v-for="item in ele.permissible_values"
                    :key="item.name"
                    :label="item.name"
                    :value="item.meaning"
                    />
                </el-select>  -->
            </div>
          </v-col>
          <v-col cols="21">
            <KGViewer :G="itemProps.data_ontology" :height="childrenHeight" :width="childrenWidth" :selectedFilters="selectedFilters" @on-node-click-event="onNodeClick"></KGViewer>
          </v-col>
        </v-row>
        
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
import * as d3tip from '@/utils/d3-tip'
import GlobalviewMenuBar from '@/components/utility/GlobalViewTool/GlobalviewMenuBar'
import {
  componentEnableDragHandler,
  componentDisableDragHandler,
} from "@/utils/globalViewCardUtils/toolHelper.js";
import KGViewer from './KGViewer.vue'

// import NodeRelOverview from '@/components/NodeRelOverview'
export default{
  props: ['itemProps', 'fixed', 'innerStyle'], 
  components: {
    GlobalviewMenuBar,KGViewer
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
        btn_loading: false, // parse loading 
        formData:null,
        linkml: "https://raw.githubusercontent.com/yasmineTYM/PPOD_KG/main/PPOD_new.yaml",
        vocab: "https://raw.githubusercontent.com/yasmineTYM/PPOD_KG/main/vocabs_new.yaml",

        // pass to childrem:
        // childrenWidth: '600px',
        // childrenHeight: '600px',
        filterWidth: '200px',
        showFilters: false,
        filtersData: [],
        selectedFilters: {},
    }
  },
  created () {
    // this.$store.dispatch('getGraphOverview')
    // window['d3'] = d3
    this.tip = d3tip()
            .attr('class', 'd3-tip')
            .offset([-10, 80])
            .html(function(d) {
              return "<strong>Relation: </strong>" + d + "<br></span>";
    })
    console.log(document.querySelector("#div_graph"));
    
  },
  methods: {
    onNodeClick: function(node_id){
      // id, name, color, stroke_color, type 
      console.log(node_id)
      console.log(this.$refs)
      this.$nextTick(() => this.$refs['filter-'+node_id.id][0].activateMenu())
    },  
    validate(){
        // console.log(this.formData, this.linkml, this.vocab)
        this.$store.dispatch('ontparser/parseOnt', {'id': this.itemProps.id,'linkml':this.linkml, 'vocab':this.vocab})
    },
    changeFilters(val){
        console.log(val)
        console.log(this.selectedFilters)
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
    'itemProps.data_ontology':function(val, oldVal){
        console.log(val, oldVal)
      },
    'itemProps.data_filter': function(val, oldVal){
        this.filtersData = []
        this.selectedFilters = {}
        // console.log(Filters)
        var c= 0
        for(const [key, value] of Object.entries(val)){
          var temp = {} 
          temp['name'] = key 
          temp['index'] = c
          temp['head_uri'] = value['head_uri']
          temp['permissible_values'] = []
          // console.log(value['permissible_values'])
          c+=1
          for (const [key2, value2] of Object.entries(value['permissible_values'])){
            var aa = value2 
            aa['name'] = key2
            temp['permissible_values'].push(aa)
          }
          this.filtersData.push(temp)
          this.selectedFilters[key] = []
        }
        console.log(this.filtersData)
        console.log(this.selectedFilters)
        this.showFilters = true 
      },
    
  },
  computed: {
    getBorder() {
      return this.FIXED ? "2px solid grey" : "None";
    },
    childrenWidth(){
      return String(this.innerStyle['width'] * 0.7)+"px"
    },  
    childrenHeight(){
      return  String(this.innerStyle['height']*0.8)+"px"
    },
  }
}
</script>
<style>

.lasso path {
    stroke: rgb(80,80,80);
    stroke-width:2px;
}

.lasso .drawn {
    fill-opacity:.05 ;
}

.lasso .loop_close {
    fill:none;
    stroke-dasharray: 4,4;
}

.lasso .origin {
    fill:#3399FF;
    fill-opacity:.5;
}

.not_possible {
    fill: rgb(200,200,200);
}

.possible {
    fill: #EC888C;
}

.nodes .selected {
    fill: green!important;
    stroke-width: 3px!important;
    stroke: black;
}
.relationships .selected {
    stroke-width: 5px !important;
    stroke: green!important;
}
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
