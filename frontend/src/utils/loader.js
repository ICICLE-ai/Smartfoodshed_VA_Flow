export function formatTable(arr){
    let columns = Object.keys(arr[0])
    console.log(columns)
    var tableInfo = []
    for(const ele of columns){
      tableInfo.push({
        label: ele,
        value: ele,
        type: 'str'
      })
    }
    let result = {Sheet1: {
      tableData: arr,
      tableInfo: tableInfo
    }}
    console.log(result)
    return result 
  }