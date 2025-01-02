# TruthLens 

TruthLens is a fact-checking browser extension, built with the intention of convenience. While reading a blog or watching a YT video, if you're confused about something, why go through the added headache of researching and fact checking a claim? Instead, users can highlight claims within videos or articles, and TruthLens checks the accuracy by searching reliable sources. It outputs a true/false score and provides related references, giving users verified information within seconds.

How we built it 🛠️ 

Our components were built using the following technologies:

- Front-end:
  - Web-app/Browser extension : JavaScript, React, Tailwind, Material UI
- Back-end:
  - Server: Flask that hosts multiple APIs (Python)
  - Model: LLMs (Mistral via OLlama), RAG, In-Context Learning, Few-shot prompting
  - External sources queried: Google FactCheckAPI, ClaimBuster FactChecker, DuckDuckGo API for web scraping, YouTube API (for captions and video data)
- Deployment
  Deployed to .tech domain, hosting our web app for public use
  Docker containers are used to package the backend, making it portable and scalable across different environments.
  GitHub Actions automates testing, deployment, and continuous integration.
  
We developed fact-checking APIs hosted on a backend server that queries this LLMs and RAG model, and directed the result of our model to the front-end. We built a browser extension frontend, that communicates with fact-checking APIs, and our model to fetch verified information. The extension monitors selected text and video captions, processing content in real-time to support fact verification.

[Devpost](https://devpost.com/software/truthlens-wja1c7)

## Try it out :
[truthlens.tech](http://truthlens.tech/)
