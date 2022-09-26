from telnetlib import ENCRYPT
from flask import Flask, jsonify, request,Response
from neo4j import GraphDatabase, basic_auth
from flask_cors import CORS
import json
from neo4j import GraphDatabase
from py2neo import Graph
from py2neo import Subgraph
import py2neo
import pandas as pd
import requests
import os 
import helper
import ontparser
from helper import oneTable, generateWhole, nx2neo
import networkx as nx

""" config.py
// Adding config file to config your local data folder please !!!!!!!!!!!

// e.g.
localfile_path = "../../../local_data"
"""
# from config import localfile_path

localfile_path = "https://raw.githubusercontent.com/yasmineTYM/PPOD_KG/main/"

# configuration
DEBUG = True
GRAPH_DRIVER = None
# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)
UPLOAD_FOLDER = 'uploaded_files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

database = 'ppod'
# graph = None 

# entity_identifier = None
# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong!')

@app.route('/getOntology', methods=['POST'])
def getOntology():
    request_obj = request.get_json()
    print(request_obj)
    G1, G2, filter_data = ontparser.Parser(request_obj['linkml'], request_obj['vocab'], True)

    return Response(json.dumps({'ontology': G2, 'filter':filter_data}))


@app.route('/upload_graphfile', methods=['POST'])
def upload_file():
  # check if the post request has the file part
  for file in request.files.getlist('files'):
    if file and file.filename.split('.')[-1].lower() in ['pdf', 'csv']:
      filename = file.filename
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      print(' * file uploaded', filename)
  return Response(json.dumps({'status': 'finished'}), status=200, mimetype="application/json")

# @app.route('/upload_graphgit', methods=['POST'])
# def upload_graphgit():
#     url = request.get_json()['url']
#     ## test 
#     url = "https://raw.githubusercontent.com/yasmineTYM/PPOD_KG/main/PPOD7.ttl"
#     g = helper.readTTLfromGit(url, [])
    
#     return g
@app.route('/getGraphData', methods=['GET'])
def getGraphData():
    data = helper.readJsonFromGit(localfile_path+'input_graph.json')
    # print(type(filtered_data))
    return Response(json.dumps(data))

@app.route('/g', methods=['GET'])
def getMapData():
    global database
    data = helper.readJsonFromGit(localfile_path+database+'_map_initial_data.json')
    # with open('../../../local_data/'+database+"_map_initial_data_v1.json") as f:
    #     data = json.loads(f.read())
    output = {
        'data': data,
        'database': database
    }
    return Response(json.dumps(output))

@app.route('/getTableData', methods=['GET'])
def getTableData():
    ## Create a new py file config.py and add localfile_path to indicate the place of local_data folder
    ## This config file will not be pushed to the osu code, so we don't need to always change path
    # global database
    # print('gettabledata', database)
    data = helper.readJsonFromGit(localfile_path+database+'_table.json')

    # with open('../../../local_data/'+database+"_table_localserver.json") as f:
    #     data = json.loads(f.read())
    output = {} ## tableName: {tableData:{}, tableInfo:{}}
    tableNames = []
    for ele in data:
        tableNames.append(ele['table_name'])
        output[ele['table_name']] = {
            'tableData': ele['table_data'],
            'tableInfo': ele['table_info']
        }
    result = {
        'data': output,
        'sheet': tableNames
    }
    return Response(json.dumps(result))

@app.route('/retrieveSubgraph', methods=['POST'])
def getSubGraphFromTable(): 
    request_obj = request.get_json()
    nodes_list = []
    relation_list = []
    print(request_obj)
    try:
        if request_obj.get("nodes") is not None: 
            nodes_list = request_obj.get("nodes")
        
        if request_obj.get("relations") is not None:
            relation_list = request_obj.get("relations")
        subgraph_res,error_code = helper.get_subgraph(graph, nodes_list, relation_list)
        dict_res = helper.convert_subgraph_to_json(subgraph_res, entity_identifier,database,fips)
        print(error_code)
    except:
        print("404")
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/retrieveSubgraphWithR', methods=['POST'])
def getSubGraphFromTableWithR(): 
    request_obj = request.get_json()
    nodes_list = []
    relation_list = []
    try:
        if request_obj.get("nodes") is not None: 
            nodes_list = request_obj.get("nodes")
        
        if request_obj.get("relations") is not None:
            relation_list = request_obj.get("relations")
        subgraph_res,error_code = helper.get_subgraph(graph, nodes_list, relation_list)
        dict_res = helper.convert_subgraph_to_json_withR(subgraph_res, entity_identifier,graph,database,fips)
    except:
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)


@app.route('/deleteNode', methods=['POST'])
def delete_node_from_graph():
    request_obj = request.get_json()
    nodes_list = []
    relation_list = []
    try:
        if request_obj.get("nodes") is not None:
            nodes_list = request_obj.get("nodes")
        if request_obj.get("relations") is not None:
            relation_list = request_obj.get("relations")
        if request_obj.get("delete_node") is not None:
            delete_node = request_obj.get("delete_node")

        subgraph_res,error_code = helper.graph_after_delete_node(nodes_list,relation_list,delete_node,graph)

        dict_res = helper.convert_subgraph_to_json(subgraph_res, entity_identifier,graph,database,fips)
    except:
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/expandNode', methods=['POST'])
def expand_node():
    request_obj = request.get_json()
    nodes_list = []
    relation_list = []
    # default for limit number is 5
    limit_number = 5
    try:
        if request_obj.get("nodes") is not None:
            nodes_list = request_obj.get("nodes")
        if request_obj.get("relations") is not None:
            relation_list = request_obj.get("relations")
        if request_obj.get("expand_node") is not None:
            expand_node = request_obj.get("expand_node")
        if request_obj.get("limit_number") is not None:
            limit_number = request_obj.get("limit_number")
        relationship_name = request_obj.get("relationship_name")
        # print(nodes_list)
        # print(relation_list)
        # print(expand_node)
        subgraph_res,error_code = helper.graph_after_expand_node(graph,nodes_list,relation_list,expand_node,limit_number,relationship_name,database)
        dict_res = helper.convert_subgraph_to_json(subgraph_res, entity_identifier,database,fips)
    except:
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/expandNodeWithR', methods=['POST'])
def expand_node_with_relationship_type():
    request_obj = request.get_json()
    nodes_list = []
    relation_list = []
    # default for limit number is 5
    limit_number = request_obj['threshold']
    print(limit_number)
    # limit_number = 5
    # try:
    if request_obj.get("nodes") is not None:
        nodes_list = request_obj.get("nodes")
    if request_obj.get("relations") is not None:
        relation_list = request_obj.get("relations")
    if request_obj.get("expand_node") is not None:
        expand_node = request_obj.get("expand_node")
    if request_obj.get("limit_number") is not None:
        limit_number = request_obj.get("limit_number")
    relationship_name = request_obj.get("relationship_name")
    # print(nodes_list)
    # print(relation_list)
    # print(expand_node)
    subgraph_res,error_code = helper.graph_after_expand_node(graph,nodes_list,relation_list,expand_node,limit_number,relationship_name,database)
    dict_res = helper.convert_subgraph_to_json_withR(subgraph_res, entity_identifier,graph,database,fips)
    # except:
    #     error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/getRType', methods=['POST'])
def get_all_relationship_types():
    request_obj = request.get_json()
    try:
        if request_obj.get("node") is not None:
            node = request_obj.get("node")
        dict_res,error_code = helper.get_all_relationship_type(graph,node)
    except:
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/getGraphOverview', methods=['GET'])
def get_graph_overview():
    return Response(json.dumps(graph_overview))

@app.route('/getGwithEntityType', methods=['POST'])
def get_graph_with_certain_entity():
    request_obj = request.get_json()
    limit_number = 3
    try:
        print(request_obj)
        if request_obj.get("entity_type") is not None:
            entity_type = request_obj.get("entity_type")
            print(entity_type)
        subgraph_res,error_code = helper.get_graph_with_certain_entity(graph,entity_type,limit_number)
        dict_res = helper.convert_subgraph_to_json_withR(subgraph_res,entity_identifier,graph,database,fips)
    except:
        print("Error!!!!!")
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/getGwithRelationshipType', methods=['POST'])
def get_graph_with_certain_relationship():
    request_obj = request.get_json()
    limit_number = 3
    try:
        print(request_obj)
        if request_obj.get("relationship_type") is not None:
            relationship_type = request_obj.get("relationship_type")
        subgraph_res,error_code = helper.get_graph_with_certain_relationship(graph,relationship_type,limit_number)
        dict_res = helper.convert_subgraph_to_json_withR(subgraph_res,entity_identifier,graph,database,fips)
    except:
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/getCountyInfo', methods=['POST'])
def get_county_info():
    request_obj = request.get_json()
    try:
        if request_obj.get("node") is not None:
            node = request_obj.get("node")
        dict_res,error_code = helper.get_county_info_for_nodes(node,database,graph)
    except Exception as e:
        print(e)
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/getEcoregionInfo', methods=['POST'])
def get_ecoregion_info():
    request_obj = request.get_json()
    try:
        if request_obj.get("node") is not None:
            node = request_obj.get("node")
        dict_res,error_code = helper.get_ecoregion_info_for_nodes(node,database,graph)
    except Exception as e:
        print(e)
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)

@app.route('/countyToNodes', methods=['POST'])
def get_associated_node_from_county():
    request_obj = request.get_json()
    limit_number = 5
    try:
        if request_obj.get("county_id") is not None:
            county_id = request_obj.get("county_id")
        subgraph_res,error_code = helper.get_associated_nodes_for_county(county_id,database,graph,limit_number)
        dict_res = helper.convert_subgraph_to_json_withR(subgraph_res,entity_identifier,graph,database,fips)
    except Exception as e:
        print(e)
        error_code = 404
    return Response(json.dumps(dict_res),status = error_code)


@app.route('/changeDataBase', methods=['POST'])
def changeDataBase():
    request_obj = request.get_json()
    global graph, entity_identifier,graph_overview,database,fips
    database = request_obj['database']
    if database=="ppod":
        graph = G1
        database = "ppod"
        entity_identifier = "label"
    else:
        graph= G2
        database = "cfs"
        entity_identifier = "county"
    schema = py2neo.database.Schema(graph)
    entity_type = list(schema.node_labels)
    relationship_type = list(schema.relationship_types)
    if len(entity_type) > 1:
        entity_type.remove("Resource")
        entity_type.remove("_GraphConfig")
    
    graph_overview = helper.get_graph_overview(graph,entity_type,relationship_type)
   
    fips = pd.read_csv(localfile_path+"county_fips.csv")
    fips = fips.astype({"fips": str})
    fips['fips'] = fips['fips'].apply(lambda x: x.zfill(5))
    fips = fips.append({'fips':'46102', 'name':'Oglala Lakota County','state':'SD'},ignore_index=True)
    return Response(json.dumps({}), status=200)

if __name__ == '__main__':
    global G1, G2
    ## local 
    # G1 = Graph("bolt://localhost:7687", auth=("neo4j", "123"), name="ppod")
    # G2 = Graph("bolt://localhost:7687", auth=("neo4j", "123"), name="cfs")
    ## server test 
    # G1 = Graph("bolt+ssc://neo1.pods.icicle.develop.tapis.io:443", auth=("neo1", "qNKvbPlIcWsXuTDK2oUKTNgYp2gRzC"), secure=True, verify=False)
    # G2 = Graph("bolt+ssc://neo2.pods.icicle.develop.tapis.io:443", auth=("neo2", "ZRGL67TXKpbkQNj7RSXA0T74zZnwet"), secure=True, verify=False)
    

    app.run()
    ## server
    # url1 = os.getenv("db_url1")
    # user1 = os.getenv("db_user1")
    # passw1 = os.getenv("db_password1")
    # url2 = os.getenv("db_url2")
    # user2 = os.getenv("db_user2")
    # passw2 = os.getenv("db_password2")
    # G1 = Graph(url1, auth=(user1, passw1), secure=True, verify=False)
    # G2 = Graph(url2, auth=(user2, passw2), secure=True, verify=False)
    # app.run(host="0.0.0.0")
    

