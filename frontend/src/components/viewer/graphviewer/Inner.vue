<template>
    <div class="card-inner" :style="{border: getBorder}">
        <div
          class="graph-btn-container"
        >
        <GlobalviewMenuBar
          @toolEnableToggle="toolEnableToggleHandler"
        />
        </div>
        <div id="div_graph" class="fullHeight" :style="{'height': '100%'}"></div>   
        <v-overlay :value="loading_value">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </div>
</template>

<script>
import * as Neo4jd3 from '@/js/Neo4jD3.js'
import * as d3Lasso from 'd3-lasso'
import * as d3 from 'd3'
import * as KGutils from '@/utils/KGutils.js'
import {mapState} from 'vuex'
import * as d3tip from '@/utils/d3-tip'
import GlobalviewMenuBar from '@/components/utility/GlobalViewTool/GlobalviewMenuBar'
import {
  componentEnableDragHandler,
  componentDisableDragHandler,
} from "@/utils/globalViewCardUtils/toolHelper.js";
// import NodeRelOverview from '@/components/NodeRelOverview'
export default{
  props: ['itemProps', 'fixed'], 
  components: {
    GlobalviewMenuBar
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
      FIXED: false 
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
    changeThreshold(){
      // change user define threshold for how many nodes we want to expand 
      this.$store.dispatch('setExpandTh', this.user_defined_thre)
    },
    drawNeo4jd3 () {
      var that = this
      d3.selectAll(".d3-tip").remove()


      if(this.neo4jd3 == null){
        var neo4jd3 = Neo4jd3.default('#div_graph', {
          neo4jData: this.itemProps.graphData,
          nodeRadius: 30,
          infoPanel: false,

          onNodeDoubleClick: function (node) {
            // that.dbclick(node)
          },
          onNodeMouseEnter: function (node) {
            that.hover_node = node
            console.log('hovering', node)
          },
          onNodeClick: function (node,idx) {
            // console.log(node,id)
            // Create dummy data
            // console.log(node)
            if (node.showBtnPanel == true) {
              d3.select(`#node-${node.id}`).selectAll('.circle-button').remove()
              node.showBtnPanel = false
              return
            }
            node.showBtnPanel = true 
            var data = { b: {action: "remove", value: 10, pos:0} } // only two operations 

            if(that.itemProps.relationStatusReady==false){
              // render the loading panel 
              console.log('nononono')
              //
            }else{
              if(that.itemProps.relationStatusReady=="fromMap"){
              var relation_data = node['relationship_types']
            }
            else{
              // console.log(that.relationTypeData['results'][0]['data'][0]['graph']['nodes'])
              // console.log(idx)
              var filtered_relation_type_data = that.relationTypeData['results'][0]['data'][0]['graph']['nodes'].filter(d => d.id == node.id)
              var relation_data = filtered_relation_type_data[0]['relationship_types']
              // get the sum of all rel counts 
            }
            const sumValues = obj => Object.values(obj).reduce((a, b) => a + b);
              const total_c  = sumValues(relation_data)
              // generate the dount data
              for (const [key, value] of Object.entries(relation_data)) {
                data[key] = {action: key, value: (value/total_c)*30}
              }
              // console.log("check data")
              // console.log(data)
            } 
            
            // sorting 
            
            let this_g = d3.select(`#node-${node.id}`)

            // let append_g = this_g.append('g').attr("transform", "translate(" + node['x'] + "," + node['y'] + ")");
            let append_g = this_g

              // Compute the position of each group on the pie:
            var pie = d3.pie()
              .sort(null) //avoiding to sort the pie, make sure the remove button in the same position 
              .value(function(d) {return d.value.value; })
            var data_ready = pie(d3.entries(data))
            

      
              // removal / expand operations 
            var operation_buttons_g = append_g.selectAll('whatever')
              .data(data_ready)
              .enter()
            
            var operation_buttons = operation_buttons_g.append('path')
              .attr('d', d3.arc()
                .innerRadius(30)         // This is the size of the donut hole
                .outerRadius(50)
              )
              .attr("class", "circle-button")
              .attr('fill', function(d,i){ 
                if(i==0){
                  return "#BB6464"
                }else{
                  return "#94B49F"
                } 
              })
              // .attr("stroke", "black")
              .style("stroke-width", "2px")
              .style("stroke", "white")
              .style("opacity", 0.7)
              .style('cursor','pointer')
              .attr('title','test')

            var hide_icon = operation_buttons_g.append('path') 
              .attr('d', 'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7')
              .attr("transform", 'translate(20, -35) scale(0.7)')
              .attr("class", "circle-button")
            
            

            d3.select('svg').call(that.tip)
              // hovering effect 
            operation_buttons.on('mouseover', function(p){
                d3.select(this).style('opacity',1)
                let rel = p['data']['value']['action']
                console.log(rel)
                that.tip.show(rel);
              })
              .on('mouseout',function(p){
                d3.select(this).style('opacity',0.7)
                let rel = p['data']['value']['action']
                that.tip.hide(rel);
              })
              .on('click', function(d,i){
                let clicked_node_id = node['id']
                const action = d.data.value.action 
                // console.log(d)
                that.tip.hide(d.data.value.action)
                if (action == "remove"){
                  // tip.hide(d.data.value.action)
                  that.$store.dispatch("node_remove", {node_id: clicked_node_id})
                }else {
                  
                  // console.log(d.data.value.action)
                  that.$store.dispatch("node_expand", {node_id: clicked_node_id, relation: d.data.key})
                }
              })
          }
      })
        this.neo4jd3 = neo4jd3
      }else{
        this.neo4jd3.updateWithNeo4jData(this.itemProps.graphData)
      }
      if (that.lassoStatus) {
        that.disableZoom()
        that.enableLasso()
      } 
      
      if (that.zoomPanStatus) {
        that.disableLasso() 
        that.enableZoomPan()
      }
      // that.enableLasso()
      
    },
    resetGraphTableHandler(){
      this.$store.dispatch("resetTableGraph")
    },
    toggleZoomPanLasso(){
      this.zoomPanStatus = !this.zoomPanStatus 
      this.lassoStatus = !this.lassoStatus
      this.zoomPanColor = this.zoomPanStatus?"green":"grey"
      this.lassoColor = this.lassoStatus?"green":"grey"
    }, 
    zoomPanToggleHandler() {
      if (!this.zoomPanStatus) {
        this.toggleZoomPanLasso() 
        this.disableLasso()
        this.enableZoomPan()
      }
    }, 
    lassoToggleHandler(){
      if (!this.lassoStatus) {
        this.toggleZoomPanLasso()
        this.disableZoom()
        this.enableLasso()
        // this.enableZoomPan()
      }
      
    },
    enableLasso(){
      const svg = d3.select('#div_graph').select("svg")
      var circles_question = svg.selectAll('.outline')
      let that = this
      var lasso_start = function () {
        console.log(111)
        lasso.items()
          .attr('fill', "green")
          .classed('not_possible', true)
          .classed('selected', false)
      }
      var lasso_draw = function () {
        // Style the possible dots
        lasso.possibleItems()
          .classed('not_possible', false)
          .classed('possible', true)

        // Style the not possible dot
        lasso.notPossibleItems()
          .classed('not_possible', true)
          .classed('possible', false)
      }
      var lasso_end = function () {
        lasso.items()
          .classed('not_possible', false)
          .classed('possible', false)

        lasso.selectedItems()
          .classed('selected', true)
        that.selectedEntities.splice(0, that.selectedEntities.length)
        that.selectedRelations.splice(0, that.selectedRelations.length) 
        lasso.selectedItems().each(function(d){
          const label = this.nodeName 
          
          if (label == "circle") {
            console.log("adding entity" + d.id)
            that.selectedEntities.push(d.id)
          }else {
            console.log("adding Relations" + d.id)
            that.selectedRelations.push(d.id)
          }
          
        })
        // Reset the style of the not selected dots
        // lasso.notSelectedItems()
        
      }
      var lasso = d3Lasso.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(circles_question)
        .targetArea(svg)
        .on('start', lasso_start)
        .on('draw', lasso_draw)
        .on('end', lasso_end)

      svg.call(lasso)
    }, 
    disableLasso() {
      const svg = d3.select('#div_graph').select("svg") 
      svg.on(".dragstart", null);
      svg.on(".drag", null);
      svg.on(".dragend", null);
    }, 
    enableZoomPan(){
      const svg = d3.select('#div_graph').select("svg") 
      svg.call(d3.zoom().on('zoom', function () {
        var scale = d3.event.transform.k,
          translate = [d3.event.transform.x, d3.event.transform.y]
        console.log(1)
        const g = svg.select("g")
        g.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')')
      }))
      .on('dblclick.zoom', null)
    },
    disableZoom() {
      const svg = d3.select('#div_graph').select("svg") 
      svg.on('.zoom', null)
    },
    toggleOverviewPanel(focus){
      if (focus == "entity") {
        const containerFocus = document.querySelector("#div_node_overview")
        const containerUnFocus = document.querySelector("#div_link_overview")
        containerFocus.style.border = "2px solid green"
        containerUnFocus.style.border = "None"
      } else{
        const containerFocus = document.querySelector("#div_link_overview")
        const containerUnFocus = document.querySelector("#div_node_overview")
        containerFocus.style.border = "2px solid green"
        containerUnFocus.style.border = "None"
      }
    },
    retrieve_types_nodes(){
      this.$store.dispatch("retrieveNodesLinksWithTypes", this.brushed)
    },
    // circleUpdateMatchColor(){
    //   if (this.colorMapping) {
    //     Object.keys(this.colorMapping).forEach(category => {
    //       d3.selectAll('.'+category).style('fill', this.colorMapping[category])
    //     })
    //   }
    // },
    recolorNode(){
      var that = this
      d3.select('#div_graph').selectAll('circle').style('fill',function(d){
      // check cold chain data
        if('resilience' in d['properties']){
          console.log(d['properties'])
          if(d['properties']['resilience']>=that.resilience_thre){
            if(that.selectedColor){
              return that.selectedColor.hex
            }else{
              return "#78b3d0"
            }
            
          }else{
            return "#b3b3b3"
          }
        }
      })
    }
  },
  watch: {
    fixed() {
      if (this.fixed) {
        // componentDisableDragHandler(
        //   `.globalview-canvas-${this.itemProps.id}`,
        //   this.toolStatus
        // );
        this.enableZoomPan()
      } else {
        this.disableZoom()
      }
    },
    selectedColor() {
      this.recolorNode()
      // d3.selectAll('circle').style('fill', this.selectedColor.hex)
    },
    resilience_thre(){
      this.recolorNode()
    },
    'itemProps.graphData'() {
      var all_resilience = []
      this.itemProps.graphData['results'][0]['data'][0]['graph']['nodes'].forEach(function (d) {
        d['status'] = 'unclicked'
        // check if this is cold chain data or not 
        if("resilience" in d['properties']){
          all_resilience.push(parseFloat(d['properties']['resilience']))
        }
        
      })
      // this.min_resilience = d3.min(all_resilience)
      this.max_resilience = d3.max(all_resilience)
      console.log(this.max_resilience)
      //inital the selected resilience
      KGutils.graphDataParsing(this.itemProps.graphData, this.currentEntities, this.currentRelations)
      this.drawNeo4jd3()
      // this.circleUpdateMatchColor()
    }, 
    selectedEntities(val) {
      if (val.length > 0) {
        console.log("retrieving data now!!!")
        console.log(val.length)
        console.log(this.selectedEntities)
        console.log(this.selectedRelations)
        console.log("****************")
        console.log(val)
        this.$store.dispatch("retrieveSubTable", {entities: this.selectedEntities, relations: this.selectedRelations})
        this.$store.dispatch("retrieveNodeGeo", {node: this.selectedEntities})
      }
    }, 
    selectedRelations(val){
      if (val.length > 0) {
        console.log("****************")
        console.log(val.length)
        console.log(val) 
        console.log("retrieving data now!!!")
        console.log(this.selectedEntities)
        console.log(this.selectedRelations)
        this.$store.dispatch("retrieveSubTable", {entities: this.selectedEntities, relations: this.selectedRelations})
      }
    }, 
    brushed:{
      handler(val){
          console.log(val);
      },
      deep:true 
    },
    'itemProps.relationStatusReady': function (val){
      console.log("relation status: " + val) 
    },
    'itemProps.relationTypeData':function(val) {
      if(this.itemProps.relationStatusReady) {
        console.log("relation type data is ready")

      }else{
        console.log("relation type data is not ready yet!")
      }
    },
    'itemProps.loading': function(val){
      this.loading_value = val
    },
    
  },
  computed: {
    getBorder() {
      return this.FIXED ? "2px solid grey" : "None";
    },
    // HEIGHT () {
    //   return window.innerHeight*0.7 + 'px'
    // },
    // OVERVIEW_HEIGHT(){
    //   return window.innerHeight*0.3 + 'px'
    // }
  }
}
</script>
<style scoped>

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
