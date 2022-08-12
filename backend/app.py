from flask import Flask, jsonify,request, Response
from flask_cors import CORS
import json
####
#from corenlp import getPhrase
####
import pandas as pd 
import networkx as nx 
from helper import oneTable, generateWhole, nx2neo

# configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)


# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})



@app.route('/getTable', methods=['GET'])
def getTable():
    data = pd.read_excel('data/Master_PPOD.xlsx', None)
    with open('data/PPOD_ontology.json','r') as j:
        ont = json.load(j)
    output = {}
    ## currently we only show the tables with defined ontology 
    for key in ont.keys():
        temp_df = data[key]
        temp_df.fillna('None', inplace=True)
        output[key] = temp_df.to_dict(orient="index")
        
    return Response(json.dumps(output), status=200, mimetype="application/json")

@app.route('/getOntology', methods=['POST'])
def getOntology():
    with open('data/PPOD_ontology.json','r') as j:
        ont = json.load(j)
    G = nx.DiGraph()
    G = generateWhole(ont, 'PeopleOrg')
    output = nx2neo(G)
    return Response(json.dumps(output), status=200, mimetype="application/json")


if __name__ == '__main__':
    app.run(port=5000)