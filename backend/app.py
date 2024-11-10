# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

from factcheck import fact_check
from claimbuster_fact_checker import is_fact_check_claimbuster
from google_fact_checker import is_fact_check_google

app = Flask(__name__)

CORS(app,  origins=["*"])

@app.route('/api/cors', methods=['GET'])
def check_cors():
    return {"message": "CORS is enabled!"}


@app.route('/')
def hello():
    return "Hello, This is Your TruthLens Claims Checker!"

# Flask route to handle claims
@app.route('/api/claims', methods=['POST'])
def check_claim():
    data = request.get_json()
    query = data.get('query')
    
    # Step 1: Call is_fact first
    is_fact_result, url = is_fact_check_google(query)
    
    if is_fact_result is False:
        return jsonify({"result": True, "url": url})

    # Step 2: Call is_fact_check_claimbuster if is_fact is inconclusive
    fact_check_response = is_fact_check_claimbuster(query)
    print(fact_check_response)
    if fact_check_response['result']:
        return fact_check_response

    return fact_check(query)

if __name__ == '__main__':
    app.run(debug=True)