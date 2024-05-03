"use client";
import Header from "@/components/Header";
import { apiURL } from "@/components/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";

export const runtime = "edge";

const useChat = () => {
  const [counter, setCounter] = useState(0);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch(`${apiURL}/chat`, {
      method: "GET",
      headers: {
        token: "emil:1234",
      },
    })
      .then((res) => res.json())
      .then((data) => setChats(data.chats))
      .catch((error) => console.error(error));
  }, [counter, setChats]);

  return [
    chats,
    useCallback((question: string) => {
      fetch(`${apiURL}/chat`, {
        method: "POST",
        body: JSON.stringify({ question }),
        headers: {
          token: "emil:1234",
        },
      })
        .then((res) => res.json())
        .then((data) => setCounter((prev) => prev + 1))
        .catch((error) => console.error(error));
    }, []),
  ] as const;
};

export default function ChatPage() {
  const [chats, ask] = useChat();
  const [question, setQuestion] = useState("");

  const chat = useMemo(() => {
    return chats.length > 0 ? (
      <div className="flex flex-col gap-4 px-4">
        {chats.map((chat, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-base font-bold capitalize">{chat.role}</p>
                <p className="text-base text-gray-500">
                  <Markdown>{chat.content}</Markdown>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">
        No chats yet. Ask a question to start a conversation.
      </p>
    );
  }, [chats]);

  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatRef.current?.scrollTo({ top: chatRef.current?.scrollHeight });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <div className="flex flex-col flex-grow max-h-screen pb-24">
      <Header backlinkUrl="/" />

      <div className="flex-grow overflow-y-auto" ref={chatRef}>
        {chat}
      </div>

      <form
        className="w-full p-4 bg-white flex"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
          setQuestion("");
        }}
      >
        <input
          type="text"
          placeholder="Type your message here..."
          className="w-full p-2 border border-gray-300 rounded flex-grow-1 rounded-r-none"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 px-4 bg-blue-500 text-white rounded rounded-l-none"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
