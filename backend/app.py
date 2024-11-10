# app.py
from flask import Flask, request, jsonify
from claimbuster_fact_checker import is_fact_check_claimbuster
from google_fact_checker import is_fact_check_google

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello, This is Your TruthLens Claims Checker!"

# Flask route to handle claims
@app.route('/api/claims', methods=['GET'])
def check_claim():
    data = request.get_json()
    query = data.get('query')
    
    # Step 1: Call is_fact first
    is_fact_result, message = is_fact_check_google(query)
    
    if is_fact_result is True:
        return jsonify({"result": True, "message": message})
    elif is_fact_result is False:
        return jsonify({"result": False, "message": message})
    
    # Step 2: Call is_fact_check_claimbuster if is_fact is inconclusive
    fact_check_response = is_fact_check_claimbuster(query)
    if fact_check_response:
        return jsonify({
            "result": fact_check_response["truth_rating"],
            "claims": fact_check_response["claims"],
            "urls": fact_check_response["urls"]
        })
    
    return jsonify({"result": None, "message": "No definitive result could be determined."})

if __name__ == '__main__':
    app.run(debug=True)