import {getComponentType, getTargetCard} from '@/utils/help'
import { base_request_url } from '@/utils/base_url'
import axios from 'axios'
function createNewCodeEditorCard(id){
  return {
    id: `card-codeeditor-${id}`,
    sourceLink: [], //
    targetLink: [], 
    marginLeft: null, 
    marginTop: null, 
    width: 500, 
    height: 300,
    inputData: {
      'script': "",
      'isFunc': false
    },
    // isFunc: false, 
    // selectedItems: [],
    keep_in_vis_mode: false 
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [],
    component: () => import('@/components/linker/codeeditor/'), 

  }, 
  mutations: {
    UPDATE_INPUTDATA(state, {id, isFunc, script}){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          state.cards[i].inputData['script'] = script;
          state.cards[i].inputData['isFunc'] = isFunc;
          alert('sucessfully update data!')
          break
        }
      }
    },
    ADD_COMPONENT(state){
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewCodeEditorCard(nextIndex));
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
      // console.log('in set func')
      for(let i in state.cards){
        // console.log(state.cards[i].id)
        if(state.cards[i].id == link.target){
          console.log('set query input data', inputData)
          state.cards[i].inputData['script'] = inputData;
          alert('successfully set input data')
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
    updateData({commit, state, dispatch}, {id, isFunc, script}){
      //once we update the data, we need to update the target !!! 
      commit('UPDATE_INPUTDATA', {id, isFunc, script})
      const targetCard = getTargetCard(state.cards, id) 
      // targetCard sourcelink: codeeditor, target: kgqueier
      if (targetCard.sourceLink.length > 0) {
        for (let i in targetCard.sourceLink) {
          dispatch('outputHandler', targetCard.sourceLink[i]) // output the data to kgqueier again
        }
      }
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
    inputHandler({commit, state, }, {link, inputData}){
      const sourceCompType = getComponentType(link.source);
      const targetCompType = getComponentType(link.target);
      console.log('document Hanlde Input 123');
      console.log(inputData);
      if(inputData){
        commit('SET_INPUTDATA', {link, inputData})  
      }

      const targetCard = getTargetCard(state.cards, link.target) 
      // targetCard sourcelink: codeeditor, target: kgqueier
      if (targetCard.sourceLink.length > 0) {
        for (let i in targetCard.sourceLink) {
          dispatch('outputHandler', targetCard.sourceLink[i]) // output the data to kgqueier again
        }
      }
    }, 

    outputHandler({commit, state, dispatch}, linkData){
      const targetCompType = getComponentType(linkData.target);
      console.log('outputHandler');
      // console.log(linkData,targetCompType);
      if (targetCompType!='kgquerier'){
        alert('wrong connection, only connect to kgquerier')
      }
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          dispatch(`${targetCompType}/inputHandler`, {link: linkData, inputData: state.cards[i]['inputData']}, {root: true}) // we only pass the script
          return;
        }
      }
    },
    keepInVis({commit}, id) {
      commit('KEEP_IN_VIS', id)
    }
  }
}