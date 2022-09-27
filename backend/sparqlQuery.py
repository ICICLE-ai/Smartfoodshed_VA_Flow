
from SPARQLWrapper import SPARQLWrapper
from pandas import json_normalize
from qwikidata.linked_data_interface import get_entity_dict_from_api


def query(sparql, sparql_query):
    sparql.setQuery(sparql_query)
    results = sparql.query().convert()
    output = results["results"]["bindings"]
    return output

def getEntityUri(sparql, sparql_query):
    output = query(sparql, sparql_query)
    if (len(output)>0):
        return json_normalize(output)
    else:
        print('no data')
        return []

def queryEndpointHelper(endpoint, sparql_query):
    sparql = SPARQLWrapper(endpoint)
    sparql.setReturnFormat('json')

    df = getEntityUri(sparql, sparql_query)
    return df

"""
wrap json of dataframe to something accepted by table viewer
"""
def convertJson(df, df_json):
    output = {
        'data': {
            'sheet1': {
                'tableData':[],
                'tableInfo': []
            }
        },
        'tableNames': ['sheet1']
    }

    columns = list(df.columns)

    for ele in columns:
        output['data']['sheet1']['tableInfo'].append({
            'label': ele,
            'type': "str",
            'value': ele
        })
    
    output['data']['sheet1']['tableData'] = df_json

    return output
