// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// // Check if API key exists
// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("Missing OpenAI API Key");
// }

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     // Log to help debug
//     console.log("API Route: Starting request");

//     const { messages } = await req.json();

//     // Validate messages
//     if (!messages || !Array.isArray(messages)) {
//       return NextResponse.json(
//         { error: "Invalid messages format" },
//         { status: 400 }
//       );
//     }

//     console.log("Making OpenAI API call with messages:", messages);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: messages.map((message: any) => ({
//         role: message.role,
//         content: message.content,
//       })),
//     });

//     console.log("OpenAI API response received");

//     return NextResponse.json({
//       message: completion.choices[0].message,
//     });
//   } catch (error: any) {
//     // Detailed error logging
//     console.error("Detailed API error:", {
//       name: error.name,
//       message: error.message,
//       stack: error.stack,
//     });

//     // Return more specific error message
//     return NextResponse.json(
//       {
//         error: "OpenAI API Error",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

//! this is a moc data api route

import { NextResponse } from "next/server";

// Categories of responses for different types of queries
const responses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    "Greetings! How may I be of service?",
  ],
  question: [
    "Based on your question, I would say that...",
    "That's an interesting question. Here's what I think...",
    "Let me help you understand this better...",
  ],
  technical: [
    "From a technical perspective, we should consider...",
    "The technical solution for this would be...",
    "Let me explain the technical aspects...",
  ],
  creator: [
    "I was created by Hasib Ahamed Sakib, who worked tirelessly to bring me to life.",
    "My developer, Hasib Ahamed Sakib, is the genius behind my creation.",
    "This chatbot is the brainchild of Hasib Ahamed Sakib.",
    "I owe my existence to the creativity and expertise of Hasib Ahamed Sakib.",
    "Hasib Ahamed Sakib is my creator and the mastermind behind my development.",
  ],
  general: [
    "I understand what you're saying. Here's my thought...",
    "That's a good point. Let me elaborate...",
    "I can help you with that. Here's what I suggest...",
  ],
};

function categorizeMessage(message: string): keyof typeof responses {
  message = message.toLowerCase();
  if (
    message.includes("creator") ||
    message.includes("ownar") ||
    message.includes("developer") ||
    message.includes("created") ||
    message.includes("develope")
  ) {
    return "creator";
  }
  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return "greeting";
  }

  if (
    message.includes("?") ||
    message.includes("how") ||
    message.includes("what") ||
    message.includes("why")
  ) {
    return "question";
  }

  if (
    message.includes("code") ||
    message.includes("programming") ||
    message.includes("technical")
  ) {
    return "technical";
  }

  return "general";
}

function getSmartResponse(message: string): string {
  const category = categorizeMessage(message);
  const responseArray = responses[category];
  const randomResponse =
    responseArray[Math.floor(Math.random() * responseArray.length)];

  // Create a more contextual response by including parts of the user's message
  const words = message.split(" ").filter((word) => word.length > 3);
  if (words.length > 0) {
    const contextWord = words[Math.floor(Math.random() * words.length)];
    return `Regarding "${contextWord}": ${randomResponse}`;
  }

  return randomResponse;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1].content;

    // Add artificial delay to simulate thinking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate smart response
    const response = getSmartResponse(lastUserMessage);

    return NextResponse.json({
      message: {
        role: "assistant",
        content: response,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
