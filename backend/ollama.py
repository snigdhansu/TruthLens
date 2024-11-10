import requests
import json


def generate_text(prompt):
    # Define the API endpoint
    url = "http://localhost:11434/api/generate"

    # Set up the request payload
    payload = {
        "model": "llama3.2:3b",
        "prompt": prompt,
        "stream": False
    }

    # Set the headers
    headers = {
        "Content-Type": "application/json"
    }

    try:
        # Make the POST request
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            return data.get("response", "No response found")
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None


# Example usage
if __name__ == "__main__":
    prompt_text = "Given the claim, "

    result = generate_text(prompt_text)
    if result:
        print("Generated Text:", result)
    else:
        print("Failed to generate text.")