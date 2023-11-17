import { useState } from "react";
import { cn } from "../helpers/cn";
import { Link } from "react-router-dom";

type SuggestionStatus = "idle" | "chatting" | "loading";

type Message = {
  content: string;
  role: "user" | "assistant";
};

export function SuggestionBox() {
  const [status, setStatus] = useState<SuggestionStatus>("idle");
  const [history, setHistory] = useState<Message[]>([
    {
      content: "Hello there! 👋 What kind of film are you looking for?",
      role: "assistant",
    },
  ]);

  const lastAssistantMessage = history.filter((message) => message.role === "assistant").slice(-1)[0];

  async function getNextMessage(content?: string) {
    const conversationSoFar = content ? [...history, { content, role: "user" }] : history;
    try {
      const data = await fetch("http://localhost:3000/get-completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationSoFar,
        }),
      }).then((res) => res.json());

      setHistory([...conversationSoFar, data.message]);
    } catch (err) {
      console.error(err);
    } finally {
      setStatus("chatting");
    }
  }

  let messageContent = lastAssistantMessage.content
  try {
    messageContent = JSON.parse(lastAssistantMessage.content)
  } catch (_) {}

  return (
    <div
      className={cn(
        "border-2 fixed bottom-0 right-0 mb-5 mr-10 text-xl rounded-[50px] grid transition-all border-purple-700/80 overflow-hidden",
        status === "idle"
          ? "bg-purple-700/50 w-20 h-20 cursor-pointer hover:bg-purple-600/50 place-items-center backdrop-blur-lg"
          : "w-72 h-96 rounded-[5px] backdrop-blur-lg bg-white/80",
      )}
      onClick={() => {
        if (status === "idle") {
          setStatus("chatting");
        }
      }}
    >
      {status === "idle" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
      )}

      {status !== "idle" && (
        <div className="p-4 grid grid-rows-[1fr,auto] text-slate-900 gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 stroke-purple-700 absolute top-3 right-3"
            onClick={(e) => {
              e.stopPropagation();
              setStatus("idle");
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          {status === "loading" && (
            <div className="border-2 border-purple-700/80 border-l-transparent w-5 h-5 rounded-full animate-spin"></div>
          )}
          {status !== "loading" && typeof messageContent === 'string' && (
            <p className="pr-5 overflow-y-auto max-h-[300px]">{lastAssistantMessage.content}</p>
          )}
          {status !== "loading" && Array.isArray(messageContent) && messageContent.length && (
            <ul>
              {messageContent.map((item) => (
                <li key={item}>
                  <Link to={`/films/`} />
                </li>
              ))}
            </ul>
          )}

          <form
            className="grid"
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus("loading");

              const content = e.currentTarget.text.value;
              e.currentTarget.reset();

              await getNextMessage(content);
            }}
          >
            <input
              className="border-2 rounded p-2 border-purple-700/80 bg-white/50"
              type="text"
              name="text"
              autoComplete="off"
            />
          </form>
        </div>
      )}
    </div>
  );
}
