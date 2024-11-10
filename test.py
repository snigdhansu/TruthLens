from allennlp.predictors import Predictor
import allennlp_models.coref

# Load the co-reference resolution model
predictor = Predictor.from_path("https://storage.googleapis.com/allennlp-public-models/coref-spanbert-large-2021.03.10.tar.gz")

# Input text
text = "The president gave a speech. He emphasized the importance of unity. This is crucial for our country's progress."

# Perform co-reference resolution
result = predictor.predict(document=text)

# Show co-reference clusters (e.g., [[0, 1], [7, 7]] means "He" (index 0) is co-referential with "The president" (index 1))
clusters = result['clusters']
print(clusters)

# Function to replace pronouns with antecedents
def replace_pronouns_with_antecedents(text, clusters):
    words = text.split()
    resolved_text = words[:]
    
    # Iterate through the co-reference clusters
    for cluster in clusters:
        if len(cluster) > 1:
            # Get the first reference in the cluster (antecedent)
            antecedent = ' '.join([words[i] for i in cluster[0]])
            
            # Replace all pronouns in the cluster with the antecedent
            for pronoun_index in cluster[1:]:
                pronoun = ' '.join([words[i] for i in pronoun_index])
                # Replace the pronoun with the antecedent
                resolved_text = [antecedent if word == pronoun else word for word in resolved_text]
    
    # Join the resolved words back into text
    return ' '.join(resolved_text)

# Replace pronouns and print the result
resolved_text = replace_pronouns_with_antecedents(text, clusters)
print("Resolved Text: ", resolved_text)