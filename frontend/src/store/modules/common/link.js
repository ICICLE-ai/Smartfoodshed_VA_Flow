import {getComponentType} from '@/utils/help'

function createNewLink({id, source, sourcePos, sourceBtn, target, targetPos, targetBtn, d}){
  return {
    id,
    source,
    sourceBtn, 
    sourcePos, 
    target, 
    targetBtn, 
    targetPos, 
    d, 
  }
}

export default {
  namespaced: true,
  state: {
    links: [

    ],
    linksDict:{

    },
    component: () => import('@/components/common/link/LinkComp'), 
  }, 
  mutations: {
    ADD_COMPONENT(state, {id, source, sourcePos, sourceBtn, target, targetPos, targetBtn, d}){
      console.log('add component')
      console.log(id);
      state.links.push(new createNewLink({id, source, sourcePos, sourceBtn, target, targetPos, targetBtn, d}));
      state.linksDict[id] = true
    },
    DELETE_COMPONENT(state, id){
      for(let i in state.links){
        if(state.links[i].id == `${id}`){
          state.links.splice(i, 1);
          console.log(id + ' has been deleted')
          break
        }
      }
      delete state.linksDict[id]; 
    }, 
    UPDATE_SOURCE(state, linkData){
      for(let i in state.links){
        if(state.links[i].id == linkData.id){
          state.links[i].sourcePos = linkData.sourcePos; 
          state.links[i].d = linkData.d; 
          console.log('!!!updated!!!')
        }
      }
    },
    UPDATE_TARGET(state, linkData){
      for(let i in state.links){
        if(state.links[i].id == linkData.id){
          state.links[i].targetPos = linkData.targetPos; 
          state.links[i].d = linkData.d; 
          console.log('!!!updated!!!')
        }
      }
    }
  }, 
  actions: {
    addComp({commit, state, dispatch}, linkData){
      const sourceCompType = getComponentType(linkData.source);
      const targetCompType = getComponentType(linkData.target);
      commit('ADD_COMPONENT', linkData);
      dispatch(`${sourceCompType}/addLink`, {...linkData, status: 'source'}, {root: true})
      dispatch(`${targetCompType}/addLink`, {...linkData, status: 'target'}, {root: true})
    },
    deleteComp({commit, state, dispatch}, id){
      const linkData = state.links.filter(link => link.id == id)[0]; //
      commit('DELETE_COMPONENT', id);
      
      // console.log(linkData);
      const sourceCompType = getComponentType(linkData.source);
      const targetCompType = getComponentType(linkData.target);
      linkData.status = 'source'
      dispatch(`${sourceCompType}/removeLink`, linkData, {root: true});

      linkData.status = 'target'
      dispatch(`${targetCompType}/removeLink`, linkData, {root: true});
    },
    updateComp({commit, dispatch}, linkData){
      // console.log('checkThis new here');
      // console.log(linkData);
      const sourceCompType = getComponentType(linkData.source);
      const targetCompType = getComponentType(linkData.target);
      if(linkData.status == 'source'){
        commit('UPDATE_SOURCE', linkData)
        dispatch(`${sourceCompType}/updateLink`, linkData, {root: true})
        linkData.status = 'target'
        dispatch(`${targetCompType}/updateLink`, linkData, {root: true})
      }else{
        commit('UPDATE_TARGET', linkData)
        dispatch(`${targetCompType}/updateLink`, linkData, {root: true})
        linkData.status = 'source'
        dispatch(`${sourceCompType}/updateLink`, linkData, {root: true})
      }
      

      dispatch(`${sourceCompType}/updateLink`, linkData, {root: true})
      dispatch(`${targetCompType}/updateLink`, linkData, {root: true})
    }
  }
}