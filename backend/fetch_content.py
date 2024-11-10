import requests
from bs4 import BeautifulSoup

def fetch_article_content(url, timeout=10):
    # Send GET request to the URL with a timeout
    # Send GET request to the URL
    response = requests.get(url, timeout=10)
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Remove unwanted elements (e.g., ads, footers, etc.)
        for unwanted_tag in soup(['script', 'style', 'footer', 'header', 'nav', 'aside', 'advertisement']):
            unwanted_tag.decompose()

        # Strategy 1: Look for article or main content container (e.g., <article>, <section>, <div>)
        content = soup.find('article') or soup.find('div', class_='article-body') or soup.find('section',
                                                                                               class_='main-content')

        if content is None:
            # Strategy 2: If no main content, try extracting all paragraphs
            content = soup.find_all('p')
            if content:
                content = ' '.join([p.get_text(strip=True) for p in content])
            else:
                # Strategy 3: If still no content, extract all text from the body
                content = soup.body.get_text(strip=True)

        # Clean up the extracted text (remove extra spaces and newlines)
        # Ensure content is a string before processing it
        if isinstance(content, list):
            body_text = ' '.join([p.get_text(strip=True) for p in content])
        elif isinstance(content, str):
            body_text = content.strip()
        else:
            body_text = content.get_text(strip=True)

        return body_text
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return None

# Example usage
# url = 'https://www.politifact.com/factchecks/2024/oct/24/kamala-harris/kamala-harris-correct-that-immigration-at-the-us-s/'
# article = fetch_article_content(url)
#
# if article:
#     print(article)