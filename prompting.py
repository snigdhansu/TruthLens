from langchain_community.llms import Ollama

class LLMPrompter:
    def __init__(self, model_name):
        self.llm = Ollama(model=model_name, temperature=0.0)

    def choose_prompt(self, task, input):
        if task=="question-generation":
            prompt = f"""
                Convert the following claim to one neutral question. Do not miss out anything important form the claim. Question the claim, not the fact.
                Look at the examples carefully and construct the question accordingly:

                Example:

                Claim: 'Donald Trump has stated he will not contest for the next elections'
                Incorrect Question: 'What did Donald Trump state for the next elections?'
                Correct Question: 'Did Donald Trump state that he will not contest for the next elections?'

                Claim: 'The population of nigera is 2.5 million'
                Incorrect Question: 'What is the population of nigera?'
                Correct Question: 'Is the population of nigera 2.5 million?'

                Given Claim: {input["claim"]}

                Write only the question you generate. Not anything else.
                """
        elif task=="answer-generation":
            prompt = f"""
                Your task is to extract a portion of the provided text that directly answers the given question. The extracted information should be a conclusive answer, either affirmative or negative, and concise, without any irrelevant words. 

                Question: {input["question"]}
                Pay more attention to the later parts of the evidences, as the initial sentences are only the introduction.
                Document Text: {input["text"]}

                You do not need to provide any explanation. Only return the extracted sentence as instructed. You are strictly forbidden from generating any text of your own.
                """
        elif task=="fact-check":
            prompt = f"""
                You are tasked with classifying a given claim based on provided statements into one of the following four categories:

                Supported: If there is sufficient evidence indicating that the claim is legitimate, classify it as Supported.
                Refuted: If there is any evidence contradicting the claim, classify it as Refuted.
                Not Enough Evidence: If you cannot find any conclusive factual evidence either supporting or refuting the claim, classify it as Not Enough Evidence. This means the available information is insufficient to make a definitive judgment.
                Conflicting Evidence/Cherry-picking: If there is factual evidence both supporting and refuting the claim, classify it as Conflicting Evidence/Cherrypicking. This indicates that the evidence is mixed, and there are evidences both supporting and refuting the claim.

                Along with the category, please also provide the index of the statement that was the most helpful and accurate towards deciding the classification.

                Examples:

                Example 1:
                Claim: The new drug is effective in treating diabetes.
                Statements: ['Clinical trials have shown no significant reduction in blood sugar levels among patients.', 'Several patients reported no change in their blood sugar levels after using the drug', 'The drug has not been widely tested in clinical trials.']
                Final Classification: (Refuted,1)
                
                Example 2:
                Claim: The new drug is effective in treating diabetes.
                Statements: ['Clinical trials have shown a significant reduction in blood sugar levels among patients.', 'Many patients reported positive results in managing their blood sugar levels.', 'Experts in the field have praised the effectiveness of the drug.']
                Final Classification: (Supported,3)

                Given Claim: {input["claim"]}
                Given Statements: {input["statements"]}
                """
        return prompt

    def prompt_llm(self, task, input):
        prompt = self.choose_prompt(task, input)
        return self.llm.invoke(prompt).strip()


