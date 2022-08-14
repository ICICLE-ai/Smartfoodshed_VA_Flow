![An image](./image/pipeline.png)

# Interactive Knowledge & Learning Environments (IKLEs)

## Overview
The framework consists of three major components:
* Components Panel: it provides three types of components for users to assist their analysis:
    * Data Loader:  Allowing users to upload their own data of various types, or link to existing databases in the ICICLE 
    * Data Processor/Analyzer: Assisting users in data processing or analyzing, such as:
        * filtering for tabular data, 
        * named entity recognition (NER) of textual data,
        * querying for graph data. 
    * Data Viewer: Visualizing data for users for insight discovery. We use the VegaLite to transform data into visualization. 

## Library 
We use Vue.js for front-end, Falsk for backend. Please check our git for more library we used in the project. 
Front-End           |  Back-End
:-------------------------:|:-------------------------:
![](./image/vuelogo.png)  |  ![](./image/flasklogo.png)

## Data Viewer
![An image](./image/pipeline.png)

## Introduction of Components
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