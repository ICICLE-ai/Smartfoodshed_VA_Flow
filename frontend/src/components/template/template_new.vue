<template>
    <div>
      <v-hover
        v-slot="{hover}"
      >
      <v-card
          :elevation="hover ? 12 : 5"
          class="card-ontparser"
          :draggable="false"
          @mousedown="dragStartHandler"
          @dragstart="false"
          outlined
          :id="itemProps.id"
          ref="cardComp"
          @dblclick.stop="cardDoubleClick"
          @contextmenu="rightClickMenuShow"
          :style="{top: marginTop + 'px', left: marginLeft +'px', width: `${width}px`, height: `${height}px`, position: 'absolute',}"
          :loading="itemProps.loadingStatus"
        >
           <!-- <vega-lite :data="values" mark="bar" :encoding="encoding"/> -->
           <!-- <bar-chart></bar-chart> -->
         <v-card-actions>
            <!-- input action button on the border -->
          <InoutputBtns
              :resizingStatus="resizingStatus"
              :width="width"
              :height="height"
              :marginLeft="marginLeft"
              :marginTop="marginTop"
              :componentId="itemProps.id"
              :hover="hover"
            />
          </v-card-actions>
          <div class="resizer resizer-r" @mousedown="mouseDownHandler"></div>
          <div class="resizer resizer-b" @mousedown="mouseDownHandler"></div>
        </v-card>
        
      </v-hover>
      <v-menu
        v-model="showRightClickMenu"
        :position-x="rightMenuX"
        :position-y="rightMenuY"
        absolute
        offset-y
      >
        <RightClickMenu 
          :vue="this" 
          :container="container" 
          :itemProps="itemProps"
          store="vegaRender"
        /> 
         
      </v-menu>
    </div>
  </template>
  
  <script>
  import {mapState} from 'vuex'
  import RightClickMenu from "@/components/common/rightclick/RightClickMenu";
  import InoutputBtns from "@/components/common/buttons/InoutputBtns";
  import VueVega from 'vue-vega'
  import Vue from 'vue'
  // import BarChartSpec from 'vue-vega/spec/vega-lite/bar.vl.json'
  
  // import InoutputBtns from '@/components/Common/Buttons/InoutputBtns'
  // import LoaderTextPre from '@/components/KGCreator/KGExtractor/LoaderTextPre'
  import {cardOperationMixin} from '@/mixins/cardOperationMixin.js'
  Vue.use(VueVega)
  
  export default {
    props: [
      'itemProps'
    ],
    mixins:[cardOperationMixin],
    data(){
      return {
          values: [
          {a: 'A', b: 28}, {a: 'B', b: 55}, {a: 'C', b: 43},
          {a: 'D', b: 91}, {a: 'E', b: 81}, {a: 'F', b: 53},
          {a: 'G', b: 19}, {a: 'H', b: 87}, {a: 'I', b: 52}
        ],
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'quantitative'}
        },
        initialX: undefined,
        initialY: undefined,
        data: undefined,
        resizeX: undefined,
        resizeY: undefined,
        // draggable: true,
        width: 400,
        height: 300, 
        resizeWidth: 0, //
        resizeHeight: 0,
        marginTop: 0,
        marginLeft: 0,
        topMargin: window.innerHeight / 2,
        leftMargin: window.innerWidth / 2,
        resizingStatus: false,
  
        showRightClickMenu: false,
        rightMenuX: 0,
        rightMenuY: 0,
  
        // for right click menu
        items: [
          { title: 'Remove node' },
        ], 
        container: '.corpus-components-list',
        rightBtn: true,
        topBtn: false,
        leftBtn: false, 
  
  
        dialog: false,
      }
    },
    methods:{
      cardDoubleClick(){
        this.dialog = true;
      //   this.itemProps.loadingStatus = true
      },
      loaderAction(e){
        if(e.status == "success"){
          delete e.status
          e.selected.cardId = this.itemProps.id
          this.$store.dispatch('ontparser/addCorpus', e.selected)
        }
        
        this.dialog = false;
      },
    },
    created(){
      // Initialize initial position
      this.marginTop = this.topMargin - this.height/2; 
      this.marginLeft = this.leftMargin - this.width/2;
      this.resizeWidth = this.width;
      this.resizeHeight = this.height; 
    },
  
    computed:{
      ...mapState(['drawLink','ontparser']),
  
      // Determine Whether the component is draggable
      // Not allowed when resizing and drawling link
      draggable(){
        return !(this.$store.state.drawLink || this.resizingStatus);
      }, 
  
      selectedCorpusName(){
        if(this.itemProps.selectedTable){
          const tableName = this.itemProps.selectedTable.table
          this.width = 56 + 8*tableName.length
          return tableName
        }else{
          return 'No Graph File'
        }
      }
    },
  
    components: {
      RightClickMenu,
      InoutputBtns,
      // BarChart: VueVega.mapVegaLiteSpec(BarChartSpec)
  
      // LoaderTextPre
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
    .title-mini {
      color: steelblue!important;
      font-weight: bold;
    }
    /* .card-actions{
      position: absolute;
      transform: translate(300px, -150px);
      padding: 0;
    } */
  
    .resizer{
      position: absolute;
    }
  
    .resizer-r {
      cursor: col-resize;
      height: 100%;
      right: 0;
      top: 0;
      width: 5px;
    }
  
    /* Placed at the bottom side */
    .resizer-b {
      bottom: 0;
      cursor: row-resize;
      height: 5px;
      left: 0;
      width: 100%;
    }
  
    .card-vegaRender:hover{
      cursor: pointer;
    }
  </style>
  