import { apiClient } from '../api/apiClient'


function graphDataParsing(neo4jD3DataObj, entitiesContainer, relationsContainer) {

    const nodes = neo4jD3DataObj.results[0].data[0].graph.nodes 
    const relations = neo4jD3DataObj.results[0].data[0].graph.relationships 
    console.log("getting nodes and links before parsing")
    // initialize entitiesContainer and relationsContainer
   entitiesContainer.splice(0, entitiesContainer.length)
   relationsContainer.splice(0, relationsContainer.length)

   nodes.forEach(node => {
       entitiesContainer.push(node.id)
   })
   relations.forEach(relation => {
        relationsContainer.push(relation.id)
   })
}

function graphNodeLinkRemoval(graphData, nodeId) { 

    const newGraphData = {...graphData}
    const nodes = newGraphData.results[0].data[0].graph.nodes 
    const relations = newGraphData.results[0].data[0].graph.relationships  
    if (nodeId == null) {
        alert("empty node id to be remove")
    }
    // remove nodes
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].id == nodeId){
            nodes.splice(i, 1)
            // assume no duplicate nodes
            break
        }
    }
    const relationRemaining = []
    for(let j = 0; j < relations.length; j++){
        
        if(relations[j].startNode == nodeId || relations[j].endNode == nodeId){
            console.log("REMOVED! - starNode: " + relations[j].startNode + ", endNode: " + relations[j].endNode)
        }else{
            relationRemaining.push(relations[j])
        }
    }
    newGraphData.results[0].data[0].graph.relationships = relationRemaining 
    return newGraphData
}

async function graphNodeLinkExpand(graphData, nodeId, relation, threshold) { 
    const newGraphData = {...graphData}
    const nodes = newGraphData.results[0].data[0].graph.nodes 
    const relations = newGraphData.results[0].data[0].graph.relationships  
    const nodeList = [] 
    const relationList = [] 
    nodes.forEach(node => {
        nodeList.push(node.id)
    })
    relations.forEach(relation => {
        relationList.push(relation.id)
    })
    
    const passingData = {nodes: nodeList, relations: relationList, expand_node: nodeId, relationship_name:relation, threshold: threshold}
    const updatedGraphData = await apiClient("/expandNodeWithR", passingData)
    console.log(updatedGraphData)
    return updatedGraphData
}

async function retrieveNodeLinkWithType(entity_type, relationship_type) { 
    let data; 
    let path; 
    if(relationship_type.length == 0){
        path = "getGwithEntityType"
        data = {"entity_type":entity_type}
    } else {
        path = "getGwithRelationshipType"
        data = {"relationship_type":relationship_type}
    }
    console.log(entity_type) 
    console.log(relationship_type)
    const updatedGraphData = await apiCLient(path, data)
    console.log(updatedGraphData)
    return updatedGraphData
}

function generationEntityRelations(items){
    let nodes = []
    let relations = [] 
    items.forEach(item => {
        if(item.relation_id != null){
            relations.push(item.relation_id)
        }else if(item.id != null) {
            nodes.push(item.id)
        }else{
            console.log("Error, item doesn't have id or relation_id")
        }
    })
    return {nodes, relations}
}

async function retrieveGraphFromTable(queryData) {
    if (queryData) {
        const result = ((await apiClient.post('/retrieveSubgraph',queryData))).data
        console.log(result)
        return result
    }
    return null
}

export {graphDataParsing, graphNodeLinkRemoval, graphNodeLinkExpand, retrieveNodeLinkWithType, generationEntityRelations, retrieveGraphFromTable}