<template>
    <div>
      <v-hover
        v-slot="{hover}"
      >
      <v-card
          :elevation="hover ? 12 : 5"
          class="card-ontparser"
          :draggable="false"
          @dragstart="false"
          @contextmenu="contextButtonClickedHandler" 
          :contextCommands="contextCommands"
          outlined
          :id="itemProps.id"
          ref="cardComp"
          @dbclick="dbclickHandler"
          @dblclick.stop="cardDoubleClick"
          @contextmenu="rightClickMenuShow"
          :loading="itemProps.loadingStatus"
          :style="{
          top: marginTop + 'px',
          left: marginLeft + 'px',
          width: `${width}px`,
          height: `${height}px`,
          position: 'absolute',
          border: getBorder
        }">  
        
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
                    :ref = "'filter'+ele.name"
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
            <KGViewer :G="itemProps.data_ontology" :height="childrenHeight" :width="childrenWidth"></KGViewer>
          </v-col>
        </v-row>
        
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
  import InoutputBtns from "@/components/common/menu/buttons/InoutputBtns";
  import Vue from 'vue'
  import KGViewer from './KGViewer.vue'
  import {cardOperationMixin} from '@/mixins/cardOperationMixin.js'
  
  export default {
    props: {
      itemProps: {
        type: Object,
        required: true
      },
    },
    mixins:[cardOperationMixin],
    data(){
      return {
        initialX: undefined,
        initialY: undefined,
        data: undefined,
        resizeX: undefined,
        resizeY: undefined,
        // draggable: true,
        width: 1000,
        height: 800, 
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
        container: '.ontparser-components-list',
        rightBtn: true,
        topBtn: false,
        leftBtn: false, 
  
        dialog: false,
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
    methods:{
        dbclickHandler(){
          console.log('db')
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
        validate(){
            // console.log(this.formData, this.linkml, this.vocab)
            this.$store.dispatch('ontparser/parseOnt', {'id': this.itemProps.id,'linkml':this.linkml, 'vocab':this.vocab})
        },
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
        changeFilters(val){
          console.log(val)
          console.log(this.selectedFilters)
        },
    },
    created(){
      // Initialize initial position
      this.marginTop = this.topMargin - this.height/2; 
      this.marginLeft = this.leftMargin - this.width/2;
      this.resizeWidth = this.width;
      this.resizeHeight = this.height; 

      

    },
    watch:{
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
      // width(new_val, old_val){
      //   this.childrenWidth = 
      //   this.filterWidth = String(newVal*0.2) + "px"
      // },
      // height(new_val, old_val){
      //   this.childrenHeight =
      // }
    },
    computed:{
      ...mapState(["drawLink", "resizer", "vismode","ontparser"]),
      getBorder() {
        return this.fixed ? "2px solid grey" : "None";
      },
      draggable() {
        return !(this.drawLink || this.resizingStatus);
      },
      minimizeStatus() {
        return this.$slots.minimizeView && this.minimize 
      }, 
      commands() {
        const rightClickCommands = {icon: "mdi-window-minimize", command: "Minimize"}
        let commands = [] 
        this.$slots.minimizeView && this.$slots.fullView 
          ? commands.push(rightClickCommands)
          : -1 
        commands = this.contextCommands
          ? commands.concat(this.contextCommands)
          : commands
        console.log('commands!!!')
        console.log(commands)
        return commands
      }, 
      currentStore() {
        return this.itemProps.id.split('-')[1]
      },

  
      // Determine Whether the component is draggable
      // Not allowed when resizing and drawling link
     
      childrenWidth(){
        return String(this.width * 0.7)+"px"
      },  
      childrenHeight(){
        return  String(this.height*0.8)+"px"
      },
      
    },
  
    components: {
      RightClickMenu,
      InoutputBtns,
      KGViewer
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
  
    .card-ontparser:hover{
      cursor: pointer;
    }
    .card-ontparser{
      padding:20px
    }
  
  </style>
  