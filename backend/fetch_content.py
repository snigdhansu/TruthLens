import requests
from bs4 import BeautifulSoup


def fetch_article_content(url):
    # Send GET request to the URL
    # Send GET request to the URL
    response = requests.get(url)

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

        if content is None:
            # Strategy 3: If still no content, extract all text from the body
            content = soup.body.get_text(strip=True)

        # Clean up the extracted text (remove extra spaces and newlines)
        body_text = ' '.join(content.get_text().strip().split()) if isinstance(content, (
        str, list)) else content.get_text().strip()

        # Extract title
        title = soup.title.string if soup.title else 'No title found'

        # Extract author and publication date
        author = soup.find('span', class_='author') or soup.find('div', class_='author-name')
        date = soup.find('time', class_='publish-date') or soup.find('span', class_='publish-date')

        return body_text
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return None


# Example usage
url = 'https://time.com/7171791/what-a-kamala-harris-win-would-mean-for-immigration/'
article = fetch_article_content(url)

print(article)