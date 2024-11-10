from duckduckgo_search import DDGS
import requests
from bs4 import BeautifulSoup

class Extractor:
    def __init__(self, max_results):
        self.search_engine = DDGS()
        self.max_results = max_results
    
    def extract_results_from_web(self, statement):
        urls=[]
        try:
            print("\nSearching for relevant information...")
            urls_to_check = list(self.search_engine.text(
                statement,
                max_results=self.max_results
            ))
            print(f"Found {len(urls_to_check)} regular search results")
            
            print("\nFound the following URLs to analyze:")
            for result in urls_to_check:
                url = result.get('link') or result.get('href')
                if url:
                    urls.append(url)
                print(f"- {url or 'No URL found'}")
            
        except Exception as e:
            print(f"Search error: {e}")
        return urls

    def fetch_article_content(self, url):
        print("Scraping "+url)
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            for unwanted_tag in soup(['script', 'style', 'footer', 'header', 'nav', 'aside', 'advertisement']):
                unwanted_tag.decompose()

            content = soup.find('article') or soup.find('div', class_='article-body') or soup.find('section', class_='main-content')

            if content is None:
                content = soup.find_all('p')
                if content:
                    content = ' '.join([p.get_text(strip=True) for p in content])
                else:
                    content = soup.body.get_text(strip=True)
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
    
    def extract_text_from_urls(self, urls):
        result={}
        print(urls)
        for i in range(len(urls)):
            result[i] = {"url":urls[i],"text":self.fetch_article_content(urls[i])}
        return result
    
    def return_docs(self, statement):
        urls = self.extract_results_from_web(statement)
        return self.extract_text_from_urls(urls)