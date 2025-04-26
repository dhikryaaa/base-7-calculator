"use client";

import { useState } from "react";

export default function Home() {
  const buttons = [
    'AC', 'DEL', '%', '/',
    '6', '5', '4', '*',
    '3', '2', '1', '+',
    '0', '=', '-'
  ];

  const isOperator = (btn: string) =>
    ['AC', 'DEL', '%', '/', '*', '+', '-', '='].includes(btn);

  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');

  const handleClick = (btn: string) => {
    if (btn === 'AC') {
      setInput('');
      setResult('0');
    } else if (btn === 'DEL') {
      setInput((prev) => prev.slice(0, -1));
    } else if (btn === '=') {
      try {
        const expression = input.replace(/[0-6]+/g, (match) => {
          return parseInt(match, 7).toString(10);
        });

        const evalResult = eval(expression);

        setResult(Number(Math.floor(evalResult)).toString(7));
      } catch (error) {
        setResult('Error');
      }
    } else {
      if (isOperator(btn) && isOperator(input.slice(-1))) return;
      setInput((prev) => prev + btn);
    }
  };

  const formatInput = (input: string) => {
    return input
      .split(/([+\-*/%])/g)
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        background: 'linear-gradient(to right, #B7B7B7, #F1E1A6)',
      }}
    >
      <div className="bg-neutral-800 rounded-2xl w-full max-w-xs overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col p-4 bg-neutral-700 text-white">
        <div className="text-sm text-right opacity-70 break-words min-h-[20px]">
          {formatInput(input) || '0'}
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
              className={`h-[60px] ${btn === '=' ? 'col-span-2' : 'w-full'} rounded-lg text-white text-xl font-bold cursor-pointer transition 
                ${isOperator(btn)
                  ? 'bg-orange-400 hover:bg-orange-300 active:bg-orange-200'
                  : 'bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400'}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
