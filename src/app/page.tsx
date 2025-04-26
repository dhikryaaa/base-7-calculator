"use client";

import { useState } from "react";

export default function Home() {
  const buttons = [
    "AC", "DEL", "%", "÷",
    "4", "5", "6", "×",
    "1", "2", "3", "+",
    "0", "=", "-"
  ];

  const isOperator = (btn: string) => ["%", "÷", "×", "+", "-"].includes(btn);

  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState("");
  const [isResult, setIsResult] = useState(false);

  const sanitizeInput = (prev: string, newChar: string) => {
    const parts = prev.split(/([%÷×+\-])/g).filter(p => p !== "");
    const lastPart = parts[parts.length - 1];

    if (!isOperator(newChar)) {
      if (lastPart === "0") {
        return parts.slice(0, -1).join("") + newChar;
      }
      return prev + newChar;
    }

    if (isOperator(prev.slice(-1))) {
      return prev.slice(0, -1) + newChar;
    }

    return prev + newChar;
  };

  const handleClick = (btn: string) => {
    if (btn === "AC") {
      setInput("");
      setResult("0");
      setHistory("");
      setIsResult(false);
    } else if (btn === "DEL") {
      setInput((prev) => {
        const updatedInput = prev.slice(0, -1);
        if (updatedInput === "") {
          setResult("0");
        } else {
          setResult(updatedInput);
        }
        return updatedInput;
      });
    } else if (btn === "=") {
      try {
        const expression = input
          .replace(/[0-6]+/g, (match) => parseInt(match, 7).toString(10))
          .replace(/÷/g, "/")
          .replace(/×/g, "*");

        const evalResult = eval(expression);
        const calcResult = Number(Math.floor(evalResult)).toString(7);

        setHistory(input.replace(/[0-6]+/g, (match) => parseInt(match, 7).toString(10)));
        setResult(calcResult);
        setInput(calcResult);
        setIsResult(true);
      } catch {
        setResult("Error");
        setIsResult(true);
      }
    } else {
      if (isResult) {
        setInput(isOperator(btn) ? result + btn : btn);
        setResult(isOperator(btn) ? result + btn : btn);
        setHistory("");
        setIsResult(false);
      } else {
        setInput((prev) => sanitizeInput(prev, btn));
        setResult((prev) => sanitizeInput(prev, btn));
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen"
      style={{ background: "linear-gradient(to right, #B7B7B7, #F1E1A6)" }}>
      <div className="bg-neutral-800 rounded-2xl w-full max-w-xs overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col p-4 bg-neutral-700 text-white">
          <div className="text-sm text-right opacity-70 break-words min-h-[20px]">
            {history}
          </div>
          <div className="text-4xl text-right font-bold break-words">
            {result}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 p-4">
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => handleClick(btn)}
              className={`h-[60px] ${btn === "=" ? "col-span-2" : "w-full"} rounded-lg text-white text-xl font-bold cursor-pointer transition 
                ${["AC", "DEL", "=", "%", "÷", "×", "+", "-"].includes(btn)
                  ? "bg-orange-400 hover:bg-orange-300 active:bg-orange-200"
                  : "bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400"}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
