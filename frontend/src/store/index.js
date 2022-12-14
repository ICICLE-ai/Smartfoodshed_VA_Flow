import Vue from 'vue'
import Vuex from 'vuex'
import menu from '@/store/modules/common/menu.js'
import link from '@/store/modules/common/link.js'


import documents from '@/store/modules/viewer/documents.js'
import graphviewer from '@/store/modules/viewer/graphviewer'
import vegacharter from "@/store/modules/viewer/vegacharter.js"

import graph from "@/store/modules/loader/graph.js";
import corpus from '@/store/modules/loader/corpus.js'
import url from '@/store/modules/loader/url.js'


import topics from '@/store/modules/topics.js'
import globalview from '@/store/modules/globalview.js'
// import ontology from '@/store/modules/ontology.js'

import table2cypher from '@/store/modules/linker/table2cypher.js'
import codeeditor from '@/store/modules/linker/codeeditor.js'

import ontparser from '@/store/modules/analyzer/ontparser.js'
import kgquerier from '@/store/modules/analyzer/kgquerier.js'
Vue.use(Vuex)

function newLink(){
  return {
    source: undefined, 
    target: undefined
  }
}

export default new Vuex.Store({
  state: {
    drawLink: false,
    currentLink: undefined, 
    currentDragging: undefined,
    vismode: false
  },
  mutations: {
    DRAWLINK_STATUS(state, status){
      state.drawLink = status;
    },
    SET_CRRENTDRAGGING(state, vm){
      state.currentDragging = vm;
    },
    SET_CURRENTLINK(state, {id, pos, in_out}){
      if(in_out === "source"){
        state.currentLink = new newLink(); 
        state.currentLink.source = {
          id, 
          pos, 
          in_out
        }
      }else{
        if(state.currentLink && state.currentLink.source){
          state.currentLink.target = {
            id, 
            pos, 
            in_out
          }
        }else{
          console.log('Set currentLink fail, no source link')
          return;
        }
      }
    }, 
    TOGGLE_VIS_MODE(state) {
      state.vismode = !state.vismode 
    }
  },
  actions: {
    changeLinkDrawingStatus({commit}, status){
      commit('DRAWLINK_STATUS', status)
    },
    changeCurrentDraggingVM({commit}, vm){
      commit('SET_CRRENTDRAGGING', vm)
    },
    setCurrentLink({commit}, {id, pos, in_out}){
      commit('SET_CURRENTLINK', {id, pos, in_out})
    }, 
    toggleVisMode({commit}) {
      commit('TOGGLE_VIS_MODE')
    }
  },
  modules: {
    menu,
    topics,
    documents,
    globalview,
    corpus,
    link, 
    // ontology,
    graph,
    vegacharter, 
    table2cypher,
    graphviewer,
    ontparser,
    kgquerier,
    codeeditor,
    url
  }
})
