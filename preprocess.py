import spacy

# Load the language model
nlp = spacy.load("en_core_web_sm")

# Text to extract claims from
text = "The president gave a speech. He emphasized the importance of unity. This is crucial for our country's progress."

# Process the text with SpaCy
doc = nlp(text)

# Split text into sentences
sentences = [sent.text for sent in doc.sents]
print(sentences)