import {getComponentType} from '@/utils/help'
import axios from 'axios'
import { base_request_url } from '@/utils/base_url'

function createNewVegaRender(id){
  return {
    id: `card-vegacharter-${id}`,
    inputData: null, 
    // selectedVegaRender: null, 
    sourceLink: [], //
    targetLink: [], 
    marginLeft: null, 
    marginTop: null, 
    width: null, 
    height: null,
    data: [], 
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [],
    component: () => import('@/components/viewer/vegacharter'), 
  }, 
  mutations: {
    SET_DATA(state, {id, data}){
      console.log('inside set data', id, data)
      for(let i in state.cards){
        if(state.cards[i].id==`${id}`){
          state.cards[i].data = data
        }
      }
    },
    ADD_COMPONENT(state){
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewVegaRender(nextIndex));
    },
    DELETE_COMPONENT(state, id){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          state.cards.splice(i, 1);
          break
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
              // state.cards[i].targetLink[j].targetPos = linkData.targetPos;
              // state.cards[i].targetLink[j].sourcePos = linkData.sourcePos;
              // state.cards[i].targetLink[j].d = linkData.d;
              state.cards[i].targetLink[j] = linkData
            }
          }
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
    REMOVE_SOURCELINK(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          for(let j in state.cards[i].sourceLink){
            if(state.cards[i].sourceLink[j].id == linkData.id){
              // state.cards[i].targetLink[j].targetPos = linkData.targetPos;
              // state.cards[i].targetLink[j].sourcePos = linkData.sourcePos;
              // state.cards[i].targetLink[j].d = linkData.d;
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
              // state.cards[i].targetLink[j].targetPos = linkData.targetPos;
              // state.cards[i].targetLink[j].sourcePos = linkData.sourcePos;
              // state.cards[i].targetLink[j].d = linkData.d;
              state.cards[i].targetLink.splice(j, 1);
              state.cards[i].inputData = undefined;
            }
          }
        }
      }
    }, 
    SET_INPUTDATA(state, {link, inputData}){
      console.log('inside set inputdata', link, inputData)
      for(let i in state.cards){
        if(state.cards[i].id == link.target){
          state.cards[i].inputData = inputData;

        }
      }
    }, 
  }, 
  actions: {
    updatePos({commit}, {id, marginTop, marginLeft}) {
      commit('UPDATE_POS', {id, marginTop, marginLeft})
    }, 
    addComp({commit}, ){
      console.log('test')
      commit('ADD_COMPONENT');
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
    addLink({commit}, data){
      console.log('tuyamei test, add link')
      if(data.status == "source"){
        commit('ADD_SOURCE_LINK', data)
        dispatch('outputHandler', linkData)
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
    
    updateSize({commit}, {id, width, height}) {
      commit('UPDATE_SIZE', {id, width, height})
    }, 
    // Input Handler will be triggered by other components
    // When source Component
    async inputHandler({commit, state, }, {link, inputData}){
      const sourceCompType = getComponentType(link.source);
      const targetCompType = getComponentType(link.target);
      if(inputData){
        commit('SET_INPUTDATA', {link, inputData}) 

        let path = base_request_url + 'genVega'
        let result = await axios.post(path, {'data':inputData})
        console.log(result.data)
        let temp = result.data
        commit('SET_DATA', {id: link.target, data: temp})
      }
    }, 

    outputHandler({commit, state, }, linkData){
      const targetCompType = getComponentType(linkData.target);
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          dispatch(`${targetCompType}/inputHandler`, {link: linkData, inputData: state.cards[i].inputData}, {root: true})
          return;
        }
      }
    },

    
    
  }
}