<template>
    <div id="div_kgviewer">
        <v-row>
            <v-switch
                v-model="lassoStatus"
                inset
                @change="lassoToggleHandler"
                :label="`Lasso: ${lassoStatus.toString()}`"
                ></v-switch>
            <!-- <v-button @click="updateInfo"></v-button> -->
        </v-row>
        <v-row>
            <div id="div_graph" class="fullHeight" :style="{'height': height, 'width': width, 'float': 'right'}"></div>
        </v-row>
       
        <v-dialog
         v-model="dialogVisible" width="400">  
          <v-card width="400" height="400">
            <v-select
            multiple
            style="margin:20px"
            :items="relation_options"
            label = "Relations"
            outlined
            v-model="selected_relation"
            ></v-select>
          </v-card>  
        </v-dialog>
    </div>
</template>

<script>
import * as Neo4jd3 from '@/js/Neo4jD3.js'
import * as d3 from 'd3'
import * as d3Lasso from 'd3-lasso'

export default {
    props: ['G','height', 'width'],
    data(){
        return{
            lassoStatus: false,
            selectedEntities: {
                'ont': [],
                'relation': {},
                'vocab':[]
            },
            dialogVisible: false,
            relation_options: [],
            selected_relation: [],
            current_relation: {}, // once we click an edge, pop up a dialog, we need to update the current_relaiton with the info 

            colored_edge_id: [] //maintain a list to keep record of highlighted links 
        }
    },
    created(){
        window['d3'] = d3
    },
    watch:{
        G: function(newVal, oldVal){
            this.draw()
        },
        selected_relation: function(newVal, oldVal){
            var that = this
            
            if(newVal.length>0){
                that.colored_edge_id.push(that.current_relation['id'])
                // console.log('==========',that.current_relation)
                that.updateEdgeColor()
                const source = that.current_relation['source']['name']
                const target = that.current_relation['endNode']
                that.selectedEntities['relation']["("+source+","+target+")"] = newVal
                console.log(that.selectedEntities)
            }else{
                // remove the link from colored_edge_id 
                console.log(newVal,'ffffff')
                that.colored_edge_id = that.colored_edge_id.filter(item=> item!= that.current_relation['id'])
                that.updateEdgeColor()
            }
            that.$emit('on-lasso-event', {entities: that.selectedEntities})
        }
    },
    methods: {
        updateEdgeColor(){
            var that = this
            const svg = d3.select('#div_graph').select("svg")
            svg.selectAll('.outline').style('stroke', function(link_d){
                if(that.colored_edge_id.includes(link_d['id'])){
                    return '#e36868'
                }else{
                    return '#a5abb6'
                }
            })
        },
        lassoToggleHandler(val){
            console.log('lasso', val)
            if(val){
                this.disableZoom()
                this.enableLasso()
            }else{
                // current is zoom 
                this.disableLasso()
                this.enableZoomPan()
            }
        // console.log(this.lassoStatus, this.zoomPanStatus)
        
        },
        enableZoomPan(){
            const svg = d3.select('#div_graph').select("svg") 
            svg.call(d3.zoom().on('zoom', function () {
                var scale = d3.event.transform.k,
                translate = [d3.event.transform.x, d3.event.transform.y]
                // console.log(1)
                const g = svg.select("g")
                g.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')')
            }))
            .on('dblclick.zoom', null)
        },
        disableLasso() {
            const svg = d3.select('#div_graph').select("svg") 
            svg.on(".dragstart", null);
            svg.on(".drag", null);
            svg.on(".dragend", null);
        }, 
        enableLasso(){
            const svg = d3.select('#div_graph').select("svg")
            var circles_question = svg.selectAll('.outline')
            let that = this
            var lasso_start = function () {
                // that.selectedEntities = {
                //     'ont': [],
                //     'vocab': []
                // }
                that.selectedEntities['ont'] = []
                that.selectedEntities['vocab'] = []
                // console.log(111)
                lasso.items()
                // .attr('fill', "green")
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
                // .style('stroke','red')
                .classed('selected', true)
                that.selectedEntities['ont'].splice(0, that.selectedEntities.length)
                that.selectedEntities['vocab'].splice(0, that.selectedEntities.length)
                // that.selectedRelations.splice(0, that.selectedRelations.length) 
                lasso.selectedItems().each(function(d){
                const label = this.nodeName 
                // console.log(d)
                if(d.type=="node"){
                    if(d.vocab){
                    that.selectedEntities['vocab'].push(d.id)
                    }else{
                    that.selectedEntities['ont'].push(d.id)
                    }
                }
                // console.log(that.selectedEntities)
                that.$emit('on-lasso-event', {entities: that.selectedEntities})
                
                })
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
        disableZoom() {
            const svg = d3.select('#div_graph').select("svg") 
            svg.on('.zoom', null)
        },
        toggleZoomPanLasso(){
            // console.log(this.lassoStatus, this.zoomPanStatus)
            this.zoomPanStatus = !this.zoomPanStatus 
            this.lassoStatus = !this.lassoStatus
            // console.log(this.lassoStatus, this.zoomPanStatus)
        }, 
        draw(){
        var that = this
        var neo4jd3 = Neo4jd3.default('#div_graph', {
            neo4jData: this.G,
            nodeRadius: 30,
            infoPanel: false,
            onNodeClick: function(rel){
                that.$emit('on-node-click-event', rel)
            
                // for (const [key, value] of Object.entries(that.$refs)){
                // that.$nextTick(() => value[0].blur())
                // }
                // that.$nextTick(() => that.$refs['filter-'+rel.id][0].focus())
                
            },
            onRelationshipClick: function(rel){
                // d3.select(this).classed('selected', true)
                
                that.relation_options = []
                console.log('click on relation', rel)
                
                // generating the options for selector 
                var relations = rel['properties']
                var length = Object.keys(relations).length
                for (const [key, value] of Object.entries(relations)) {
                    that.relation_options.push(key)
                }
                that.current_relation = rel 
                that.dialogVisible = true
                // console.log(that.selected_relation)
                //whether user select anything or not 
                
            }
        })
        this.neo4jd3 = neo4jd3
        if (that.lassoStatus) {
            that.disableZoom()
            that.enableLasso()
        } else {
            that.disableLasso() 
            that.enableZoomPan()
        }
        }
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
    
    #div_kgviewer .nodes .selected {
        /* fill: green!important; */
        stroke: rgb(227, 104, 104)!important;
        stroke-width: 3px!important;
        stroke: black;
    }
    /* #div_kgviewer .relationships .selected {
        stroke-width: 5px !important;
        stroke: red!important;
        stroke: green!important;
    } */
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
    
