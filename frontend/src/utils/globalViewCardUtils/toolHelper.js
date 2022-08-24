import * as d3 from 'd3'
import * as d3Lasso from 'd3-lasso'
function toolManagerInitialization() {
  //
  console.log('Intializing tool status')
  return {
    lasso: false, 
    zoom: true, 
    pan: true,  
  } 
}

function componentEnableDragHandler(container, managerStatus) {
 
  if (managerStatus.pan) {
    disablePan(container)
  }
  if (managerStatus.lasso) {
    disableLasso(container) 
  }
    
}

function componentDisableDragHandler(container, managerStatus) {

  if (managerStatus.zoom) {
    enableZoomPan(container)
  }

  if (!managerStatus.pan) {
    disablePan(container)
  }

  if (managerStatus.lasso) {
    enableLasso(container)
  }
  
}

function lassoToggleHandler(status,  container, vue) {
  if (status == true) {
    disablePan(container, vue)
    enableLasso(container, vue) 
    vue.toolStatus.lasso = true 
    vue.toolStatus.pan = false
  }else {
    disableLasso(container) 
    enableZoomPan(container)
    vue.toolStatus.lasso = false
    vue.toolStatus.pan = true
  }
}

function disablePan(container) {
  const containerComp = d3.select(container)
  containerComp
    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null)
  console.log('Pan disabled')
}

function enableZoomPan(container){
  console.log(container)
  const canvasContainer = d3.select(container)
  const canvas = canvasContainer.selectAll('g')
  const containerNode = canvasContainer.node().getBoundingClientRect()
  const width = containerNode.width 
  const height = containerNode.height
  canvasContainer.call(d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([1, 8])
          .on("zoom", zoomed))
          .on("dblclick.zoom", null);
  
  function zoomed(){
    const {transform} = d3.event;
    console.log(d3.event)
    canvas.attr("transform", transform);
  }
} 


function enableLasso(container, vue) {
  console.log('Lasso enabled!')
  const containerComp = d3.select(container)
  const candidates = containerComp.selectAll('.marker-docs') // need to be modified to path when change the way marker is drawn 
  const lasso_start = function () {
    lasso.items()
      .classed('not_possible', true)
      .classed('selected', false)  
  }  
  const lasso_draw = function () {
    // Style the possible dots
    lasso.possibleItems()
      .classed('not_possible', false)
      .classed('possible', true)

    // Style the not possible dot
    lasso.notPossibleItems()
      .classed('not_possible', true)
      .classed('possible', false)
  }
  const lasso_end = function() {
    lasso.items()
      .classed('not_possible', false)
      .classed('possible', false)

    lasso.selectedItems()
      .classed('selected', true) 
    
    
    
    console.log('selected items check for lasso!!!')
    const selectedItems = lasso.selectedItems().data().map(d => d.id || d.cord_uid)
    console.log(selectedItems) 
    console.log(vue)
    vue.$store.dispatch('globalview/lassoSelected', {id: vue.itemProps.id, selected: selectedItems})
  }

  const lasso = d3Lasso.lasso()
    .closePathSelect(true)
    .closePathDistance(100)
    .items(candidates)
    .targetArea(containerComp)
    .on('start', lasso_start)
    .on('draw', lasso_draw)
    .on('end', lasso_end)
  
  containerComp.call(lasso)

}

function disableLasso(container) {
  
  const containerComp = d3.select(container) 
  containerComp.on(".dragstart", null);
  containerComp.on(".drag", null);
  containerComp.on(".dragend", null);
   
}

export {lassoToggleHandler, disablePan, toolManagerInitialization, componentEnableDragHandler, componentDisableDragHandler}
