
dict_template = {
 'barchart': {
     'mark': 'bar',
     'data': {
         'values': []
     },
     'encoding':{
         'x': {'type': 'nominal', 'field': ''},
         'y': {'type': 'quantitative', 'field': ''}
     }
 },
  'scatterplot':{
      'mark': 'point',
      'data': {
          'values': []
      },
      'encoding': {
         'x': {'type': 'quantitative', 'field': ''},
         'y': {'type': 'quantitative', 'field': ''}
      }
  },
  'linechart': {
      'mark': 'line',
      'data': {
          'values': []
      },
      'encoding': {
         'x': {'type': 'temporal', 'field': ''},
         'y': {'type': 'quantitative', 'field': ''}
      }
  },
  'areachart': {
      'mark': 'area',
      'data': {
          'values': []
      },
      'encoding': {
         'x': {'type': 'temporal', 'field': ''},
         'y': {'type': 'quantitative', 'field': ''}
      }
  },
  'heatmap': {
      'mark': 'rect',
      'data': {
          'values': []
      },
      'encoding': {
         'x': {'type': ['nominal', 'ordinal'], 'field': ''},
         'y': {'type': ['nominal', 'ordinal'], 'field': ''},
        'color': {'type':'quantitative', 'field': ''}
      }
  },
  'piechart': {
      "mark": {"type": "arc", "tooltip": True},
      'data':{
          'values': []
      },
      'encoding': {
          'theta': {'field': '', 'type': 'quantitative'},
          'color': {'field': '', 'type': 'nominal'}
      }
  },
  'boxplot': {
      'mark': 'boxplot',
      'encoding': {
          'x': {'type': 'nominal', 'field':''},
          'y': {'type': 'quantitative', 'field': ''}
      }
  }
  
 }