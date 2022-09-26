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
        label: 'Vega-Lite viewer', 
        icon: 'mdi-vector-polygon-variant',
        color: '#C689C6',
        store: 'vegaRender',
        component: ()=>import('@/components/viewer/VegaRender'), 
      }, 
      {
        label: 'Table2Cypher', 
        icon: 'mdi-xml', 
        color: '#A1C298',
        store: 'table2cypher', 
        component: null 
      },
      {
        label: 'Ontology Parser',
        icon: 'mdi-graphql',
        color: '#A1C298',
        store: 'ontparser',
        component: ()=>import('@/components/analyzer/OntParser')
      }
    ]
  }
}