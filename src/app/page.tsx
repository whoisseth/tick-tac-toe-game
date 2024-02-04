/** @format */
"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function getRandomXOrO() {
  // Generate a random number (0 or 1)
  const randomNum = Math.floor(Math.random() * 2);
  // Return 'X' if randomNum is 0, otherwise return 'O'
  return randomNum === 0 ? "X" : "O";
}

// Example usage:
const randomSymbol = getRandomXOrO();

type boxesNumberType = {
  boxNo: number;
  chance: "X" | "0" | null;
};

export default function Home() {
  // const boxes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const boxesNumber: boxesNumberType[] = [
    { boxNo: 1, chance: null },
    { boxNo: 2, chance: null },
    { boxNo: 3, chance: null },
    { boxNo: 4, chance: null },
    { boxNo: 5, chance: null },
    { boxNo: 6, chance: null },
    { boxNo: 7, chance: null },
    { boxNo: 8, chance: null },
    { boxNo: 9, chance: null }
  ];

  const winingStates = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    //
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    //
    [1, 5, 9],
    [3, 5, 7]
  ];

  const [boxes, setBoxes] = useState<boxesNumberType[]>(boxesNumber);
  const [currentChance, setCurrentChance] = useState(randomSymbol);
  const [xChances, setXChances] = useState<number[]>([]);
  const [ZeroChances, setZeroChances] = useState<number[]>([]);
  const [win, setWin] = useState<"X" | "0" | "Draw" | null>(null);

  function checkWinningCondition(array: number[]) {
    for (const winState of winingStates) {
      // Check if every element in winState is present in the array
      if (winState.every((num) => array.includes(num))) {
        return true; // If found, return true
      }
    }
    return false; // If no winning state is found, return false
  }

  function handleReset() {
    setCurrentChance(randomSymbol);
    setXChances([]);
    setZeroChances([]);
    setWin(null);
    setBoxes(boxesNumber);
  }

  useEffect(() => {
    const xWin = checkWinningCondition(xChances);
    const ZeroWin = checkWinningCondition(ZeroChances);
    const allBoxesFill = boxes.every((d) => typeof d.chance == "string");

    if (xWin) {
      setWin("X");
    }
    if (ZeroWin) {
      setWin("0");
    }
    if (!xWin && !ZeroWin && allBoxesFill) {
      setWin("Draw");
    }
  }, [xChances, ZeroChances]);

  function handleOnClickBox(boxNumber: number) {
    // x chnace
    if (currentChance === "X") {
      const updatedBoxes: boxesNumberType[] = boxes.map((d) =>
        d.boxNo == boxNumber ? { boxNo: boxNumber, chance: "X" } : d
      );
      setBoxes(updatedBoxes);

      setXChances([...xChances, boxNumber]);
      setCurrentChance("0");
    }

    // zero chnace
    if (currentChance === "0") {
      const updatedBoxes: boxesNumberType[] = boxes.map((d) =>
        d.boxNo == boxNumber ? { boxNo: boxNumber, chance: "0" } : d
      );
      setBoxes(updatedBoxes);

      setZeroChances([...ZeroChances, boxNumber]);
      setCurrentChance("X");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-black text-white flex-col">
      <main className="w-full  max-w-[400px] flex flex-col gap-4">
        {/* chance */}
        <section className="flex justify-between  ">
          <p className="text-2xl">
            <span>Chance : </span>
            <span className="font-bold text-3xl text-blue-400">
              {currentChance}
            </span>
          </p>
          <button
            onClick={handleReset}
            className="bg-white text-black px-4 rounded font-semibold"
          >
            Rematch
          </button>
        </section>

        {/* boxes */}
        <section className=" gap-2 grid grid-cols-3 w-full  max-w-[400px] h-[400px]  ">
          {boxes.map((d, i) => (
            <Box
              win={win}
              xChances={xChances}
              ZeroChances={ZeroChances}
              chance={d.chance}
              boxNumber={d.boxNo}
              handleOnClickBox={handleOnClickBox}
              key={i}
            />
          ))}
        </section>
        {/* winners */}
        <section className="text-3xl">
          {win === "0" && <p> 0 Win </p>}
          {win === "X" && <p> X Win </p>}
          {win === "Draw" && <p> Draw </p>}
        </section>
      </main>
    </div>
  );
}

function Box({
  boxNumber,
  handleOnClickBox,
  xChances,
  ZeroChances,
  chance,
  win
}: {
  boxNumber: number;
  chance: "X" | "0" | null;
  win: "X" | "0" | "Draw" | null;
  xChances: number[];
  ZeroChances: number[];
  handleOnClickBox: (boxNumber: number) => void;
}) {
  function handleClick() {
    handleOnClickBox(boxNumber);
  }

  const btnDisabled =
    xChances.includes(boxNumber) ||
    ZeroChances.includes(boxNumber) ||
    win !== null;

  return (
    <button
      disabled={btnDisabled}
      onClick={handleClick}
      className={twMerge(
        clsx(
          "min-w-32 min-h-32  rounded-md bg-white text-black  flex items-center justify-center text-4xl font-bold  border-4 border-transparent   ",
          btnDisabled && "cursor-not-allowed",
          chance == "X" && "text-blue-400  border-blue-400 "
        )
      )}
    >
      {chance}
    </button>
  );
}
