from duckduckgo_search import DDGS

def duckduckgo_search(query, max_results=5):
    # Initialize the DDGS object
    ddgs = DDGS()

    # Perform the search
    results = ddgs.text(query, max_results=max_results)

    # Initialize an empty list to store the URLs
    urls = []

    # Check if the results are not empty
    if results:
        for result in results:
            # Append only the URL to the list
            urls.append(result['href'])
    else:
        print("No results found.")

    # Return the list of URLs
    return urls


# Example usage
query = "kamala Harris immigrant"
print(duckduckgo_search(query))