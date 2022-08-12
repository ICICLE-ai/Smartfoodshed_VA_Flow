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
        label: 'Graph view', 
        icon: 'mdi-vector-polygon-variant',
        store: 'graphview',
        component: undefined, 
      }
    ]
  }
}