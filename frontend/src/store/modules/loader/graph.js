import { getComponentType, getTargetCard } from '@/utils/help'
import { apiClient } from '../../../api/apiClient';
import { updateGraphInstance } from '../../../utils/GraphInstance';
import { retrieveGraphFromTable } from '../../../utils/KGutils';
const $rdf = require('rdflib')
function createNewCorpusCard(id) {
  return {
    id: `card-graph-${id}`,
    sourceLink: [], //
    targetLink: [], 
    selectedGraph: undefined,
    marginLeft: null,
    marginTop: null,
    width: null,
    height: null,
    data: undefined,
    mode: 'online', 
    selectedGraphInstance: null,
    loadingStatus: false,
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [

    ],
    component: () => import('@/components/loader/graph'),
  },
  mutations: {
    ADD_COMPONENT(state) {
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewCorpusCard(nextIndex));
    },
    DELETE_COMPONENT(state, id) {
      for (let i in state.cards) {
        if (state.cards[i].id == `${id}`) {
          state.cards.splice(i, 1);
          console.log(id + ' has been deleted')
          break
        }
      }

    },
    ADD_SOURCE_LINK(state, linkData) {
      for (let i in state.cards) {
        if (state.cards[i].id == linkData.source) {
          state.cards[i].sourceLink.push(linkData);
        }
      }
    },
    ADD_TARGET_LINK(state, linkData) {
      for (let i in state.cards) {
        if (state.cards[i].id == linkData.target) {
          state.cards[i].targetLink.push(linkData);
        }
      }
    },
    UPDATE_SOURCE(state, linkData) {
      for (let i in state.cards) {
        if (state.cards[i].id == linkData.source) {
          for (let j in state.cards[i].sourceLink) {
            if (state.cards[i].sourceLink[j].id == linkData.id) {
              state.cards[i].sourceLink[j] = linkData
            }
          }
        }
      }
    },
    UPDATE_TARGET(state, linkData) {
      for (let i in state.cards) {
        if (state.cards[i].id == linkData.target) {
          for (let j in state.cards[i].targetLink) {
            if (state.cards[i].targetLink[j].id == linkData.id) {
              state.cards[i].targetLink[j] = linkData
            }
          }
        }
      }
    },
    REMOVE_SOURCELINK(state, linkData) {
      for (let i in state.cards) {
        if (state.cards[i].id == linkData.source) {
          for (let j in state.cards[i].sourceLink) {
            if (state.cards[i].sourceLink[j].id == linkData.id) {
              state.cards[i].sourceLink.splice(j, 1);
            }
          }
        }
      }
    },
    UPDATE_LOADING_STATUS(state, { id, status }) {
      for (let i in state.cards) {
        if (state.cards[i].id == id) {
          state.cards[i].loadingStatus = status;
        }
      }
    },
    ADD_DATA(state, data) {
      for (let i in state.cards) {
        if (state.cards[i].id == data.cardId) {
          state.cards[i].selectedGraph = data;
        }
      }
    },
    SET_INPUTDATA(state, {link, inputData}) {
      for (let i in state.cards) {
        if (state.cards[i].id == link.target) {
          state.cards[i].inputData = inputData;
        }
      }
    }, 
    LOAD_DATA(state, { id, data }) {
      for (let i in state.cards) {
        if (state.cards[i].id == id) {
          state.cards[i].data = data;
        }
      }
    },

    SET_MODE(state, {id, mode}) {
      for (let i in state.cards) {
        if (state.cards[i].id === id) {
          state.cards[i].mode = mode 
        }
      }
    }, 

    UPDATE_INSTANCE(state, {id, instance}) {
      for (let i in state.cards) {
        if (state.cards[i].id === id) {
          state.cards[i].selectedGraphInstance = instance 
        }
      }
    } 
  },
  actions: {
    addComp({ commit },) {
      console.log('adding')
      commit('ADD_COMPONENT');
    },
    deleteComp({ commit, state, dispatch }, id) {
      const toDeletedComp = state.cards.filter(card => card.id == id)[0];

      const toDeleteSourceLink = [...toDeletedComp.sourceLink, ...toDeletedComp.targetLink];

      toDeleteSourceLink.forEach(link => {
        console.log(link)
        dispatch('link/deleteComp', link.id, { root: true })
      })
      console.log('deleting' + id)
      commit('DELETE_COMPONENT', id);
    },
    addLink({ commit, dispatch }, linkData) {
      if (linkData.status == "source") {
        commit('ADD_SOURCE_LINK', linkData)
        dispatch('outputHandler', linkData)
      } else {
        commit('ADD_TARGET_LINK', linkData)
        // // alert('Corpus card has to be the starting point');
        // dispatch('link/deleteComp', linkData.id, { root: true });
      }
    },
    updateLink({ commit }, linkData) {
      if (linkData.status == 'source') {
        commit('UPDATE_SOURCE', linkData)
      } else {
        commit('UPDATE_TARGET', linkData)
      }
    },
    removeLink({ commit }, linkData) {
      if (linkData.status == 'source') {
        commit('REMOVE_SOURCELINK', linkData)
      } else {
        console.log('no use, trying to remove target link for corpus, which does not exist')
      }
    },
   
    async addGraph({ commit, dispatch, state }, data) {
      for (let i in state.cards) {
        if (state.cards[i].id == data.cardId && state.cards[i].selectedTable !== data) {
          // commit('ADD_DATA', data);
          commit('UPDATE_LOADING_STATUS', { id: data.cardId, status: true })
          // console.log('data from graph loader')
          console.log(data);
          if(data.source == "github" && data.url){
            var uri = 'https://example.org/resource.ttl'
            var body = '<a> <b> <c> .'
            var mimeType = '<text/turtle>'
            var g = $rdf.graph()

            try {
                $rdf.parse( g=g, uri=uri, mimeType=mimeType)
                console.log(g)
            } catch (err) {
                console.log(err)
            }
          }
          else if(data.source == 'uploaded_file' && data.selected) {
            // upload file 
            const formData = new FormData();
            formData.append("files", data.selected);
            
            let upload_res = await apiClient.post('/upload_graphfile', formData)
            console.log('uploadding finished!!!')
            console.log(upload_res)
            commit('SET_MODE', {id: data.cardId, mode: 'file'})
            commit('UPDATE_LOADING_STATUS', { id: data.cardId, status: false }) 
          } else {
            commit('SET_MODE', {id: data.cardId, mode: 'online'})
            const GraphInstance = updateGraphInstance(data.selected)
            // let graphData = await axios.get('/getTable')
            // console.log(graphData);
            // commit('LOAD_DATA', {
            //   id: data.cardId, data: {
            //     data: { ...graphData.data },
            //     tableNames: Object.keys(graphData.data)
            //   }
            // })
            // commit('UPDATE_LOADING_STATUS', { id: data.cardId, status: false })
            // console.log('adding corpusdata ############')
            commit('UPDATE_INSTANCE', {id: data.cardId, instance: GraphInstance})
            commit('LOAD_DATA', {
                id: data.cardId, data: null
            }) 
            commit('UPDATE_LOADING_STATUS', { id: data.cardId, status: false }) 
            for (let i in state.cards) {
              if (state.cards[i].id == data.cardId) {
                for (let j in state.cards[i].sourceLink) {
                  dispatch('outputHandler', state.cards[i].sourceLink[j])
                }
              }
            }
          }
        }
      }


    },

    async inputHandler({state, commit, dispatch}, {link, inputData}) {
      console.log(inputData)
      const targetCard = getTargetCard(state.cards, link.target)
      console.log(targetCard)
      if (inputData && targetCard.selectedGraphInstance) {
        const data = await retrieveGraphFromTable(inputData)
        commit('SET_INPUTDATA', {link, inputData: data}) 
        if (targetCard.sourceLink.length > 0) {
          for (let i in targetCard.sourceLink) {
            dispatch('outputHandler', targetCard.sourceLink[i])
          }
        }
      } else {
        if (!targetCard.selectedGraphInstance) {
          alert('you must specify graph instance to query')
        }
      }
    }, 
    outputHandler({ commit, dispatch, state }, linkData) {
      // Need to handler output since self is source
      const targetCompType = getComponentType(linkData.target);
      console.log('outputHandler');
      console.log(linkData);
      for (let i in state.cards) {
        if (state.cards[i].id == linkData.source) {
          dispatch(`${targetCompType}/inputHandler`, { link: linkData, inputData: state.cards[i].inputData }, { root: true })
          // return;
        }
      }
    }
  }
}