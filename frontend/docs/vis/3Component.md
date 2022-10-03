## Data Loader
### JSON Loader 
* Introduction: Load JSON file from users. 
* Input: JSON file in the following format:
```
[
    {attr1: '..', attr2: '..', attr3: '..'},
    {attr1: '..', attr2: '..', attr3: '..'},
    ...
]
```
* Output: formatted JSON
```
data: {
    value: [
        {attr1: '..', attr2: '..', attr3: '..'},
        {attr1: '..', attr2: '..', attr3: '..'},
        ...
    ]
}
```
### CSV Loader
* Introduction: load csv file from users.
* Input: CSV file 
* Output: JSON
```
data: {
    value: [
        {attr1: '..', attr2: '..', attr3: '..'},
        {attr1: '..', attr2: '..', attr3: '..'},
        ...
    ]
}
```
### URL Loader
* Introduction: load online resources 
* Source: None (Starting Point)
* Target: [ontology parser, ]
* Input: str,
* Output: str, 
* 
```
{
    id: `card-url-${id}`,
    sourceLink: [], //
    marginLeft: null, 
    marginTop: null, 
    width: null, 
    height: null,
    data: {
        'cardInd': null,
        'linkml': null,
        'vocabulary': null,
        'ttl': null
    },
    loadingStatus: false
}
```
## Analyzer 
### CodeEditor
* Introduction: Code viewer/editor, can get data from some code generator, such as Ontology Parser. For now, it can only pass data to kg querier. 
* Input: string (sparql for now) 
* Output: string (sparql for now)
```
id: `card-codeeditor-${id}`,
sourceLink: [], //
targetLink: [], 
marginLeft: null, 
marginTop: null, 
width: 500, 
height: 300,
inputData: {
    'script': "",
    'isFunc': false
},
keep_in_vis_mode: false 
```

### KG querier 
* Introduction: query data from knowledge graph 
* Input: SPARQL string  (CodeEditor)
* Output: json format of dataframe (TableViewer)

### Ontology Parser 
* Introduction: Ontology parser by taking linkml and vocabulary
* Source: Online URL Loader
* Target: [CodeEditor, KGQuerier]
* Input: str
* Output: str, SPARQL 
```
id: `card-ontparser-${id}`,
sourceLink: [], //
targetLink: [], 
marginLeft: null, 
marginTop: null, 
width: 500, 
height: 300,
inputData: {
    linkml: null,
    vocabulary: null
},
// selectedItems: [],
loadingStatus: false,
data_ontology: [],
data_filter: [],
keep_in_vis_mode: false,
outputData: ""
```


## Data Viewer
### TableViewer 
* Input: 
```
{
    data:{
        sheet1: {
            tableData:[
                {
                    column_value1:  'aaa',
                    column_value2:  3
                },{
                    ...
                }
            ],
            tableInfo:[{
                label: column_label1,
                type: str,
                value: column_value1
            },{
                label: column_label2,
                type: int,
                value: column_value2
            }]
        },
        sheet2: {
            ...
        }
    },
    tableNames:[sheet1, sheet2]
}
```
### Bar Chart 
* Introduction: Visualize the input data in a bar chart.
* Input: 
```
data: {
    value: [
        {attr1: '..', attr2: '..', attr3: '..'},
        {attr1: '..', attr2: '..', attr3: '..'},
        ...
    ]
}
```
* Output: Bar chart using VegaLite. 
```

```