import requests

def is_true_or_false(truth_rating):
    # Split the truth_rating by space and check the first token
    first_token = truth_rating.split()[0].strip().lower()
    if first_token == "true":
        return True
    elif first_token == "false":
        return False
    return None  # If it doesn't match true/false, return None

def is_fact_check_claimbuster(claim):
    api_key = "e0a48310ef5c47c296a9d265e4180341"
    input_claim = claim

    # Define the endpoint (url) with the claim formatted as part of it, api-key (api-key is sent as an extra header)
    api_endpoint = f"https://idir.uta.edu/claimbuster/api/v2/query/fact_matcher/{input_claim}"
    request_headers = {"x-api-key": api_key}

    # Send the GET request to the API and store the api response
    api_response = requests.get(url=api_endpoint, headers=request_headers)

    # Check if the response was successful (status code 200)
    if api_response.status_code != 200:
        print(f"Error: {api_response.status_code}")
        return None

    data = api_response.json()  # Correctly call json() here to get the dictionary

    # Initialize counters for true and false values
    true_count = 0
    false_count = 0

    # Initialize lists for storing URLs and claims
    urls = []
    claims = []

    # Process the justification entries
    for entry in data.get("justification", []):
        truth_rating = entry.get("truth_rating", "")
        claim = entry.get("claim")
        url = entry.get("url")

        # Check if the truth_rating is True or False based on the first token
        truth_value = is_true_or_false(truth_rating)

        if truth_value is True:
            true_count += 1
        elif truth_value is False:
            false_count += 1

        # Collect URLs and claims
        urls.append(url)
        claims.append(claim)

    # Determine whether there are more True or False values
    if true_count > false_count:
        result = {
            "truth_rating": True,
            "claims": claims,
            "urls": urls
        }
    else:
        result = {
            "truth_rating": False,
            "claims": claims,
            "urls": urls
        }

    return result

# Example usage
# fact_check_response = is_fact_check_claimbuster("Biden is president")
# print(fact_check_response)
