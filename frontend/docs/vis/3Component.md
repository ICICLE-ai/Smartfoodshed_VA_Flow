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

## Data Viewer
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