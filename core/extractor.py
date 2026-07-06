from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
import os


def get_llm():
    return ChatMistralAI(
        model="ministral-3b-2512",
        mistral_api_key=os.getenv("MISTRAL_API_KEY"),
        temperature=0.2,
    )


def build_chain(system_prompt: str):
    llm = get_llm()

    return (
        RunnablePassthrough()
        | RunnableLambda(lambda x: {"text": x})
        | ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{text}"),
            ]
        )
        | llm
        | StrOutputParser()
    )


def extract_action_items(transcript: str) -> list[str]:
    chain = build_chain(
        "You are an expert meeting analyst.\n"
        "Extract all action items from the meeting transcript.\n\n"
        "For each action item include:\n"
        "- Task description\n"
        "- Owner (if mentioned)\n"
        "- Deadline (if mentioned, otherwise 'Not specified')\n\n"
        "Return ONLY one action item per line.\n"
        "Do NOT use numbering or bullet points.\n"
        "If no action items exist, return exactly:\n"
        "No action items found."
    )

    result = chain.invoke(transcript)

    return [line.strip() for line in result.split("\n") if line.strip()]


def extract_key_decisions(transcript: str) -> list[str]:
    chain = build_chain(
        "You are an expert meeting analyst.\n"
        "Extract all key decisions made during the meeting.\n\n"
        "Return ONLY one decision per line.\n"
        "Do NOT use numbering or bullet points.\n"
        "If no decisions exist, return exactly:\n"
        "No key decisions found."
    )

    result = chain.invoke(transcript)

    return [line.strip() for line in result.split("\n") if line.strip()]


def extract_questions(transcript: str) -> list[str]:
    chain = build_chain(
        "You are an expert meeting analyst.\n"
        "Extract ONLY the questions that were explicitly asked during the meeting "
        "or topics that were explicitly left unresolved.\n\n"
        "Do NOT generate new questions.\n"
        "Do NOT infer or imagine follow-up questions.\n"
        "Return one question per line.\n"
        "If there are no explicit questions or unresolved topics, return No open questions found."

    )

    result = chain.invoke(transcript)

    return [line.strip() for line in result.split("\n") if line.strip()]