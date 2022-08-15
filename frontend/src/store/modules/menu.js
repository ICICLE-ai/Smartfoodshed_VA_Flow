export default {
  state: {
    menuList: [
      {
        label: 'Corpus', 
        icon: 'mdi-database', 
        store: 'corpus', 
        component: undefined,
      },
      {
        label: 'Graph Loader', 
        icon: 'mdi-graph', 
        store: 'graph', 
        component: () => import('@/components/GraphLoaderComp'),
      },
      {
        label: 'Tabular', //
        icon: 'mdi-table',  
        store: 'documents',
        component: () => import('@/components/DocumentsComp')
      }, 
      {
        label: 'Ontology view', 
        icon: 'mdi-vector-triangle',
        store: 'ontology',
        component: () => import('@/components/GlobalViewComp')
      },
      {
        label: 'Vega-Lite Render', 
        icon: 'mdi-vector-polygon-variant',
        store: 'vegaRender',
        component: ()=>import('@/components/VegaRender'), 
      }
    ]
  }
}