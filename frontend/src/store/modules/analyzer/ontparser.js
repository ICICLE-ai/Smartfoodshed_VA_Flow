import {getComponentType, getTargetCard} from '@/utils/help'
import { base_request_url } from '@/utils/base_url'
import axios from 'axios'
function createNewOntParserCard(id){
  return {
    id: `card-ontparser-${id}`,
    sourceLink: [], //
    targetLink: [], 
    marginLeft: null, 
    marginTop: null, 
    width: 500, 
    height: 300,
    inputData: {
      linkml: null,
      vocabulary: null
    },
    selectedItems: [],
    loadingStatus: false,
    data_ontology: [],
    data_filter: [],
    keep_in_vis_mode: false,
    outputData: ""
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [],
    component: () => import('@/components/analyzer/ontparser'), 
    

  }, 
  mutations: {
    SET_outputData(state, {id, data}){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          state.cards[i].outputData = data
          console.log(data)
        }
      } 
    },
    SET_data_filter(state, {id, status}){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          state.cards[i].data_filter = status
        }
      }
    },
    SET_data_ontology(state, {id, status}){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          state.cards[i].data_ontology = status
        }
      }
    },
    SET_loadingStatus(state, {id, status}){
      console.log('loading status changing,,,', id, status)
      for(let i in state.cards){
        console.log(state.cards[i].id)
        if(state.cards[i].id == `${id}`){
          state.cards[i].loadingStatus = status
        }
      }
    },
    ADD_COMPONENT(state){
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewOntParserCard(nextIndex));
    },
    DELETE_COMPONENT(state, id){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          state.cards.splice(i, 1);
          break
        }
      }
    }, 
    ADD_SOURCE_LINK(state, linkData){
      console.log('addlink!!!');
      console.log(linkData);
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          state.cards[i].sourceLink.push(linkData);
        }
      }
    },
    ADD_TARGET_LINK(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.target){
          state.cards[i].targetLink.push(linkData);
          return;
        }
      }
    },
    UPDATE_SOURCE(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          for(let j in state.cards[i].sourceLink){
            if(state.cards[i].sourceLink[j].id == linkData.id){
              state.cards[i].sourceLink[j] = linkData
            }
          }
        }
      }
    },
    UPDATE_TARGET(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.target){
          for(let j in state.cards[i].targetLink){
            if(state.cards[i].targetLink[j].id == linkData.id){
              state.cards[i].targetLink[j] = linkData
            }
          }
        }
      }
    },
    REMOVE_SOURCELINK(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          for(let j in state.cards[i].sourceLink){
            if(state.cards[i].sourceLink[j].id == linkData.id){
              state.cards[i].sourceLink.splice(j,1);
            }
          }
        }
      }
    },
    REMOVE_TARGETLINK(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.target){
          for(let j in state.cards[i].targetLink){
            if(state.cards[i].targetLink[j].id == linkData.id){
              state.cards[i].targetLink.splice(j, 1);
              state.cards[i].inputData = undefined;
            }
          }
        }
      }
    }, 
    SET_INPUTDATA(state, {link, inputData}){
      for(let i in state.cards){
        if(state.cards[i].id == link.target){
          state.cards[i].inputData = inputData;
          // console.log('check card data',state.cards[i].inputData)
        }
      }
    }, 
    UPDATE_POS(state, {id, marginLeft, marginTop}) {
      for(let i in state.cards){
        if(state.cards[i].id == id){
          state.cards[i].marginTop = marginTop 
          state.cards[i].marginLeft = marginLeft
        }
      }
    }, 
    UPDATE_SIZE(state, {id, width, height}) {
      for(let i in state.cards){
        if(state.cards[i].id == id){
          state.cards[i].width = width 
          state.cards[i].height = height
        }
      }
    },
    UPDATE_SELECTED_ITEMS(state, {id, selected}) {
      for(let i in state.cards){
        if(state.cards[i].id == id){
          state.cards[i].selectedItems = selected
        }
      }
    }, 
    KEEP_IN_VIS(state, id) {
      for(let i in state.cards){
        if(state.cards[i].id == id){
          state.cards[i].keep_in_vis_mode = !state.cards[i].keep_in_vis_mode
        }
      } 
    }
  }, 
  actions: {
    async genSPARQL({commit, state, dispatch}, data){
      commit('SET_loadingStatus', {'id': data['id'], 'status':true})
      for(let i in state.cards){
        if(state.cards[i].id == data.id){
          data['linkml'] = state.cards[i].inputData['linkml']
          data['vocabulary']= state.cards[i].inputData['vocabulary']
        }
      }
      let path = base_request_url + 'genSPARQL'
      let result = await axios.post(path, data)
      // update output data 
      commit('SET_outputData', {'id': data['id'], 'data':result['data']['SPARQL']})
      // update target components 
      const targetCard = getTargetCard(state.cards, data['id']) 
      if (targetCard.sourceLink.length > 0) {
        for (let i in targetCard.sourceLink) {
          dispatch('outputHandler', targetCard.sourceLink[i])
        }
      }
      
    },
    async parseOnt({commit, state, dispatch}, data){
      commit('SET_loadingStatus', {'id': data['id'], 'status':true})
      let path = base_request_url + 'getOntology'
      let result = await axios.post(path, data)
      
      commit('SET_data_ontology', {'id': data['id'], 'status':result['data']['ontology']})
      commit('SET_data_filter', {'id': data['id'], 'status': result['data']['filter']} )
      commit('SET_loadingStatus', {'id': data['id'],'status':false})
    },
    addComp({commit}, ){
      commit('ADD_COMPONENT');
    },

    updatePos({commit}, {id, marginTop, marginLeft}) {
      commit('UPDATE_POS', {id, marginTop, marginLeft})
    }, 

    updateSize({commit}, {id, width, height}) {
      commit('UPDATE_SIZE', {id, width, height})
    }, 
    deleteComp({commit, state, dispatch}, id){
      const toDeletedComp = state.cards.filter(card => card.id == id)[0];
      
      const toDeleteSourceLink = [...toDeletedComp.sourceLink];
      const toDeleteTargetLink = [...toDeletedComp.targetLink];
      toDeleteSourceLink.forEach(link => {
        console.log(link)
        dispatch('link/deleteComp', link.id, {root: true})
      })
      toDeleteTargetLink.forEach(link => {
        dispatch('link/deleteComp', link.id, {root: true})
      })
      commit('DELETE_COMPONENT', id);
    }, 
    addLink({commit, dispatch}, data){
      if(data.status == "source"){
        commit('ADD_SOURCE_LINK', data)
        dispatch('outputHandler', data)
      }else{
        commit('ADD_TARGET_LINK', data)
        //dispatch('inputHandler', linkData)
      }
    },
    updateLink({commit}, linkData){
      if(linkData.status == 'source'){
        commit('UPDATE_SOURCE', linkData)
      }else{
        commit('UPDATE_TARGET', linkData)
      }
    },
    removeLink({commit}, linkData){
      if(linkData.status == 'source'){
        commit('REMOVE_SOURCELINK', linkData)
      }else{ 
        commit('REMOVE_TARGETLINK', linkData)
      }
    },
    
    updateSelectedItems({state, commit, dispatch}, {id, selected}) {
      commit('UPDATE_SELECTED_ITEMS', {id, selected})
      const targetCard = getTargetCard(state.cards, id) 
      if (targetCard.sourceLink.length > 0) {
        for (let i in targetCard.sourceLink) {
          dispatch('outputHandler', targetCard.sourceLink[i])
        }
      }
    },
    // Input Handler will be triggered by other components
    // When source Component
    inputHandler({commit, state, dispatch}, {link, inputData}){
      const sourceCompType = getComponentType(link.source);
      const targetCompType = getComponentType(link.target);
      if(inputData['linkml']!=""  & inputData['vocabulary']!=""){
        console.log('commit')
        commit('SET_INPUTDATA', {link, inputData})
        inputData['id'] = link.target;
        dispatch('parseOnt', inputData)
      }else{
        alert('linkml and vocabulary are required!')
      }
    }, 

    outputHandler({commit, state, dispatch}, linkData){
      const targetCompType = getComponentType(linkData.target);
      console.log('outputHandler');
      console.log(linkData);
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          // console.log(state.cards[i])
          dispatch(`${targetCompType}/inputHandler`, {link: linkData, inputData:  state.cards[i].outputData}, {root: true})
          return;
        }
      }
    },
    keepInVis({commit}, id) {
      commit('KEEP_IN_VIS', id)
    }
  }
}