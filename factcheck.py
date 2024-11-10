from extractor import Extractor
from RelevantResults import RelevantResults
e = Extractor(5)
claim = "The earth is flat."
metadata = e.return_docs(claim)
# r = RelevantResults()
# print(r.retrieve_relevant_results(metadata))

QA_llm_model = "mixtral:8x22b"
Ans_llm_model = "mixtral:8x22b"#"phi3:14b-instruct"

from prompting import LLMPrompter
QA_LLMEngine = LLMPrompter(QA_llm_model)
Ans_LLMEngine = LLMPrompter(Ans_llm_model)

question = QA_LLMEngine.prompt_llm("question-generation", {"claim":claim})
evidences=[]
for key in range(len(metadata)):
    evidence = Ans_LLMEngine.prompt_llm("answer-generation", {"question":question,"text":metadata[key]["text"]})
    evidences.append(evidence)
classification = Ans_LLMEngine.prompt_llm("fact-check",{"claim":claim, "statements":evidences})

