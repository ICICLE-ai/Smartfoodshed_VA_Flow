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
## Analyzer 
### CodeEditor
* Introduction: Code viewer/editor, can get data from some code generator, such as Ontology Parser. For now, it can only pass data to kg querier. 
* Input: string (sparql for now) 
* Output: string (sparql for now)

### KG querier 
* Introduction: query data from knowledge graph 
* Input: SPARQL string  (CodeEditor)
* Output: json format of dataframe (TableViewer)

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