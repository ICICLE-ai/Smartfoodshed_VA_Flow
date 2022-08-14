from flask import Flask, jsonify,request, Response
from flask_cors import CORS
import json
####
#from corenlp import getPhrase
####
import pandas as pd 
import networkx as nx 
from helper import oneTable, generateWhole, nx2neo
import os

# configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
UPLOAD_FOLDER = 'uploaded_files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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


@app.route('/upload_graphfile', methods=['POST'])
def upload_file():
  # check if the post request has the file part
  for file in request.files.getlist('files'):
    if file and file.filename.split('.')[-1].lower() in ['pdf', 'csv']:
      filename = file.filename
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      print(' * file uploaded', filename)
  return Response(json.dumps({'status': 'finished'}), status=200, mimetype="application/json")

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