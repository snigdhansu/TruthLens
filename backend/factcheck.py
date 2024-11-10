from extractor import Extractor
import re

QA_llm_model = "mistral"
Ans_llm_model = "mistral"  # "phi3:14b-instruct"

from prompting import LLMPrompter
QA_LLMEngine = LLMPrompter(QA_llm_model)
Ans_LLMEngine = LLMPrompter(Ans_llm_model)

def fact_check(claim):
    e = Extractor(3)
    metadata = e.return_docs(claim)
    # r = RelevantResults()
    # print(r.retrieve_relevant_results(metadata))

    question = QA_LLMEngine.prompt_llm("question-generation", {"claim": claim})
    print(question)
    evidences = []
    for key in range(len(metadata)):
        evidence = Ans_LLMEngine.prompt_llm("answer-generation", {"question": question, "text": metadata[key]["text"]})
        evidences.append(evidence)
    print(evidences)
    result = Ans_LLMEngine.prompt_llm("fact-check", {"claim": claim, "statements": evidences})
    print("######################################## "+result)
    pattern = r"(\w+), (\d+)"
    pattern_wospace = r"(\w+),(\d+)"
    match = re.search(pattern,result)
    match2 = re.search(pattern_wospace, result)
    # if '(' in result:
    #     start_index = result.find('(')
    #     end_index = result.find(')')
    #     print(result[start_index + 1:end_index])
    #     truncated_result = result[start_index + 1:end_index]
    # else:
    #     truncated_result = result.strip()
    classification = None
    index = None
    if match:
        classification = match.group(1)  # 'Refuted'
        index = int(match.group(2))  # '
    elif match2:
        classification = match2.group(1)  # 'Refuted'
        index = int(match2.group(2))  # '
    # classification, index = truncated_result.split(',')[:2]
    # index = int(index[1:])
    print("Classification: ", classification)
    print(index)
    print("Final: ", metadata[index - 1])

    if classification == "Supported":
        return {"result": True, "url":metadata[index - 1]["url"]}
    else:
        return {"result": False, "url": metadata[index - 1]["url"]}

#
# print(fact_check("Biden is the president of the USA"))
