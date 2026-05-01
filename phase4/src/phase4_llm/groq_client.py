from groq import Groq


def generate_with_groq(api_key: str, model: str, prompt: str) -> str:
    client = Groq(api_key=api_key)
    response = client.chat.completions.create(
        model=model,
        temperature=0.2,
        messages=[
            {
                "role": "system",
                "content": "Return JSON only. No markdown, no extra text.",
            },
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content or ""
