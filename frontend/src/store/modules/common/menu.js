export default {
  state: {
    menuList: [
      {
        label: 'CSV Loader', 
        icon: 'mdi-database', 
        store: 'corpus', 
        color: '#AEBDCA',
        component: undefined,
      },
      {
        label: 'Graph Loader', 
        icon: 'mdi-graph', 
        color: '#AEBDCA',
        store: 'graph', 
        component: () => import('@/components/loader/graph/Loader'),
      },
      {
        label: 'YAML Loader', 
        icon: 'mdi-link-variant', 
        color: '#AEBDCA',
        store: 'url', 
        component: () => import('@/components/loader/url/Loader'),
      },
      {
        label: 'Table viewer', //
        icon: 'mdi-table',  
        color: '#C689C6',
        store: 'documents',
        component: () => import('@/components/viewer/tabularviewer/')
      }, 
      {
        label: 'Graph viewer', 
        icon: 'mdi-vector-triangle',
        color: '#C689C6',
        store: 'graphviewer',
        component: () => import('@/components/GlobalViewComp')
      },
      {
        label: 'Table Visualizer', 
        icon: 'mdi-vector-polygon-variant',
        color: '#C689C6',
        store: 'vegacharter',
        component: ()=>import('@/components/viewer/vegacharter/'), 
      }, 
      // {
      //   label: 'Table2Cypher', 
      //   icon: 'mdi-xml', 
      //   color: '#A1C298',
      //   store: 'table2cypher', 
      //   component: null 
      // },
      {
        label: 'Query Editor', 
        icon: 'mdi-application-edit', 
        color: '#A1C298',
        store: 'codeeditor', 
        component: ()=>import('@/components/linker/codeeditor/') 
      },
      {
        label: 'Ontology Filter',
        icon: 'mdi-graphql',
        color: '#A1C298',
        store: 'ontparser',
        component: ()=>import('@/components/analyzer/ontparser/')
      },
      {
        label: 'KG Querier',
        icon: 'mdi-database-search',
        color: '#A1C298',
        store: 'kgquerier',
        component: ()=>import('@/components/analyzer/kgquerier/')
      },
      
    ]
  }
}