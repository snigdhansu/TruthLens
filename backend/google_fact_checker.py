import requests

API_KEY = 'AIzaSyDuB2u-QTHdGiUTKlaL8nlzZgY5JWpJ7kk'  # Replace with your Google Fact Check Tools API key
BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search'

def is_fact_check_google(query):
    params = {
        'query': query,
        'key': API_KEY,
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        print(data)
        # Check if there are any claims
        if 'claims' in data and data['claims']:
            # Look for a verdict in the claim reviews
            for claim in data['claims']:
                claim_text = claim.get('text')
                claim_reviews = claim.get('claimReview', [])

                print(f"\nEvaluating Claim: {claim_text}")

                for review in claim_reviews:
                    publisher = review.get('publisher', {}).get('name')
                    title = review.get('title')
                    url = review.get('url')
                    verdict = review.get('textualRating')

                    # Output the result
                    print(f"Reviewed by: {publisher}\nTitle: {title}\nURL: {url}\nVerdict: {verdict}\n")

                    # Simple check: consider it a fact if verdict is "True" or similar
                    if verdict and verdict.lower() in ["true", "correct", "verified"]:
                        return True, f"The statement is factual based on review by {publisher}."
                    elif verdict and verdict.lower() in ["false", "misleading", "not true"]:
                        return False, f"The statement is not factual based on review by {publisher}."

            return None, "No conclusive verdict found in claim reviews."
        else:
            return None, "No claims found for this query."
    else:
        return None, f"Error: {response.status_code}, {response.text}"

# Example usage
# query = "Covid 19 vaccine does not contains microchip"
# is_fact_result, message = is_fact(query)
# print(message)