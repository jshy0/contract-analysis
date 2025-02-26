import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { contractText, additionalInfo } = await request.json();

    if (!contractText) {
      return NextResponse.json(
        { error: "Please provide the contract text." },
        { status: 400 }
      );
    }

    const prompt = `
    Please analyse the following UK contract text:
    
    ${contractText}
    
    ${additionalInfo ? `Additional context: ${additionalInfo}` : ""}
    
    Provide a comprehensive analysis in accordance with UK contract law including:
    1. Key terms and conditions
    2. Potential risks or ambiguities
    3. Important dates and deadlines
    4. Obligations for each party
    5. Termination conditions
    6. Any concerning clauses that might need legal review
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a legal contract analysis assistant. Provide clear, concise analysis of contract documents in a structured format. Respond in nicely formatted markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const analysis = response.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Contract analysis error", err);
    return NextResponse.json(
      { error: "Failed to analyse contract" },
      { status: 500 }
    );
  }
}
