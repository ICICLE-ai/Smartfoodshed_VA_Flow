import {getComponentType} from '@/utils/help'
import axios from 'axios'
function createNewGlobalViewCard(id){
  return {
    id: `card-globalview-${id}`,
    sourceLink: [], //
    targetLink: [], 
    marginLeft: null, 
    marginTop: null, 
    width: null, 
    height: null,
    inputData: null,
    filter: undefined,
    vis_tsne: null, 
    filter: null,
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [],
    component: () => import('@/components/GlobalViewComp'), 
  }, 
  mutations: {
    ADD_COMPONENT(state){
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewGlobalViewCard(nextIndex));
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
              state.cards[i].inputData = null;
              state.cards[i].vis_tsne = null;
            }
          }
        }
      }
    },
    SET_INPUTDATA(state, {link, inputData}){
      for(let i in state.cards){
        if(state.cards[i].id == link.target){
          state.cards[i].inputData = inputData;
        }
      }
    },
    SET_VISDATA(state, {link, visData}){
      for(let i in state.cards){
        if(state.cards[i].id == link.target){
          state.cards[i].vis_tsne = visData;
        }
      }
    }
  }, 
  actions: {
    addComp({commit}, ){
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
      if(data.status == "source"){
        commit('ADD_SOURCE_LINK', data)
      }else{
        commit('ADD_TARGET_LINK', data)
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
    inputHandler({commit, state, dispatch}, {link, inputData}){
      const sourceCompType = getComponentType(link.source);
      const targetCompType = getComponentType(link.target);
      console.log('GlobalView Hanlde Input 123');
      console.log(inputData);
      if(inputData && inputData.corpus){
        commit('SET_INPUTDATA', {link, inputData})  
        dispatch('retrieveVisData', {link, inputData})
      }
    },

    async retrieveVisData({commit, state, dispatch}, {link, inputData}){
      for(let i in state.cards){
        if(state.cards[i].id == link.target && state.cards[i].inputData.corpusName == inputData.corpusName){
          let visData = await axios.post('http://127.0.0.1:8888/vis_retrieve', {...inputData, method: "tsne"})
          // state.cards[i].visData['tsne'] = visData
          commit('SET_VISDATA', {link, visData: visData.data})
        }
      }
    }

  }
}