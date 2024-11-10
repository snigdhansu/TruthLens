from extractor import Extractor

QA_llm_model = "mistral"
Ans_llm_model = "mistral"  # "phi3:14b-instruct"

from prompting import LLMPrompter
QA_LLMEngine = LLMPrompter(QA_llm_model)
Ans_LLMEngine = LLMPrompter(Ans_llm_model)

def fact_check(claim):
    e = Extractor(5)
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
    print("########################################")
    start_index = result.find('(')
    end_index = result.find(')')
    print(result[start_index + 1:end_index])
    truncated_result = result[start_index + 1:end_index]
    classification, index = truncated_result.split(',')
    index = int(index[1:])
    print("Classification: ", classification)
    print("Final: ", metadata[index - 1])

    if classification == "Supported":
        return {"result": True, "url":metadata[index - 1]["url"]}
    else:
        return {"result": False, "url": metadata[index - 1]["url"]}

#
# print(fact_check("Biden is the president of the USA"))
