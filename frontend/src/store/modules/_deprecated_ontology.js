import {getComponentType} from '@/utils/help'
import axios from 'axios'

function createNewOntology(id){
  return {
    id: `card-ontology-${id}`,
    selectedOntology: null, 
    sourceLink: [], //
    targetLink: [], 
    marginLeft: null, 
    marginTop: null, 
    width: null, 
    height: null,
    data: undefined, 
    inputData: undefined, 
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [],
    component: () => import('@/components/OntologyComp'), 
  }, 
  mutations: {
    ADD_COMPONENT(state){
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewOntology(nextIndex));
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
              // state.cards[i].sourceLink[j].sourcePos = linkData.sourcePos;
              // state.cards[i].sourceLink[j].targetPos = linkData.targetPos;
              // state.cards[i].sourceLink[j].d = linkData.d;
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
              state.cards[i].inputData = undefined;
            }
          }
        }
      }
    }, 
    SET_INPUTDATA(state, {link, inputData}){
      for(let i in state.cards){
        if(state.cards[i].id == link.target){
          // Object.keys(inputData).forEach(
          //   key => {state.cards[i].inputData[key] = inputData[key]}
          // )
          // console.log(state.cards[i].inputData)
          state.cards[i].inputData = inputData;
        }
      }
    }, 
    ADD_DATA(state, data){
      for(let i in state.cards){
        if(state.cards[i].id == data.cardId){
          state.cards[i].selectedOntology = data.ontology;
        }
      }
    },
    LOAD_DATA(state, {id, data}){
      for(let i in state.cards){
        console.log("=========")
        console.log(data)
        console.log(state.cards[i].id)
        console.log(id)
        console.log("=========")
        if(state.cards[i].id == id){
          state.cards[i].data = data;
        }
      }
    },
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
    
    
    async addOntology({commit, dispatch, state}, data){
      for(let i in state.cards){
        if(state.cards[i].id == data.cardId && state.cards[i].selectedTable !== data){
          commit('ADD_DATA', data);
          console.log(data);
          let ontologyData = await axios.post('http://127.0.0.1:5000/getOntology')
          console.log(ontologyData.data); 
          commit('LOAD_DATA', {id: data.cardId, data: {
            data: {...ontologyData.data} , 
            ontologyName: data.ontology
          }})

          console.log('adding ontologyData ############')
         
          for(let i in state.cards){
            if(state.cards[i].id == data.cardid){
              for(let j in state.cards[i].sourcelink){
                dispatch('outputhandler', state.cards[i].sourcelink[j])
              }
            }
          }
        }
      }
    },

    // Input Handler will be triggered by other components
    // When source Component
    inputHandler({commit, state, }, {link, inputData}){
      const sourceCompType = getComponentType(link.source);
      const targetCompType = getComponentType(link.target);
      console.log(inputData);
      if(inputData){
        commit('SET_INPUTDATA', {link, inputData})  
      }
    }, 

    outputHandler({commit, state, }, linkData){
      const targetCompType = getComponentType(linkData.target);
      console.log('outputHandler');
      console.log(linkData);
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          dispatch(`${targetCompType}/inputHandler`, {link: linkData, inputData: state.cards[i].inputData}, {root: true})
          return;
        }
      }
    },

    
    
  }
}