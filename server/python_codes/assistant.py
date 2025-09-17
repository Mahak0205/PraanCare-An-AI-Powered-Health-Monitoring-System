import sys
import json
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)


def load_input():
    raw = sys.stdin.read()
    return json.loads(raw)

def build_prompt(prompt_instructions: str) -> str:
    return f"""You are PraanCare’s AI medical assistant.

Instructions:
{prompt_instructions}

Restrictions:
- Do NOT diagnose any condition.
- Do NOT mention suicide, medications, or act like a doctor.
- Use clear, non-emotional, helpful language.
"""

def format_history(context):
    history = ""
    if "history" in context:
        for record in context["history"]:
            history += f"\nDate: {record.get('date')}"
            if "depression" in record:
                history += f"\nDepression: {record['depression']}"
            if "anxiety" in record:
                history += f"\nAnxiety: {record['anxiety']}"
            if "stress" in record:
                history += f"\nStress: {record['stress']}"
            if "sleepDuration" in record:
                history += f"\nSleep Duration: {record['sleepDuration']}"
            if "qualityOfSleep" in record:
                history += f"\nQuality: {record['qualityOfSleep']}"
            if "stressLevel" in record:
                history += f"\nStress Level: {record['stressLevel']}"
            if "heartRate" in record:
                history += f"\nHeart Rate: {record['heartRate']}"
            if "bmiCategory" in record:
                history += f"\nBMI Category: {record['bmiCategory']}"
            if "prediction" in record:
                history += f"\nPrediction: {record['prediction']}"
            history += "\n"

    return history.strip()

def main():
    try:
        data = load_input()
        message = data.get("message", "")
        context = data.get("context", {})
        prompt_instructions = data.get("prompt", "")

        system_prompt = build_prompt(prompt_instructions)
        background = format_history(context)

        print(f"\n🧠 Background Injected:\n{background}\n", file=sys.stderr)
        print(f"\n💬 Message Prompted:\n{message}\n", file=sys.stderr)

        llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.7
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{background}"),
            ("human", "{message}")
        ])

        chain = prompt | llm

        result = chain.invoke({
            "background": background,
            "message": message
        })

        print(result.content.strip())

    except Exception as e:
        print(f"❌ Python assistant error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
