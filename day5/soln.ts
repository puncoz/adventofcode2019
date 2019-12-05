/**
 * CodeOfAdvent - 2019
 * Solution for Day 5
 * 
 * Problem: https://adventofcode.com/2019/day/5
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const USER_INPUT = 1

const POSITION = 0
const IMMEDIATE = 1

const intCodeComputer = (inputArray: number[], currentIndex: number = 0): number[] => {
    const opCode = `${inputArray[currentIndex]}`.padStart(5, "0").split("").map(Number)

    if (opCode[4] === 9 && opCode[3] === 9) {
        return inputArray
    }

    const modes = [
        opCode[2] === 0 ? POSITION : IMMEDIATE,
        opCode[1] === 0 ? POSITION : IMMEDIATE,
        opCode[0] === 0 ? POSITION : IMMEDIATE,
    ]

    const firstParam = inputArray[currentIndex + 1]
    const secondParam = inputArray[currentIndex + 2]
    const thirdParam = inputArray[currentIndex + 3]

    if (opCode[4] === 1) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam
        inputArray[thirdParam] = first + second

        return intCodeComputer(inputArray, currentIndex + 4)
    }

    if (opCode[4] === 2) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam
        inputArray[thirdParam] = first * second

        return intCodeComputer(inputArray, currentIndex + 4)
    }

    if (opCode[4] === 3) {
        inputArray[firstParam] = USER_INPUT

        return intCodeComputer(inputArray, currentIndex + 2)
    }

    if (opCode[4] === 4) {
        const op = modes[0] === POSITION ? inputArray[firstParam] : firstParam

        console.log(`Output "${op}" for iteration: ${currentIndex}`)
        return intCodeComputer(inputArray, currentIndex + 2)
    }

    throw new Error("Something went wrong." + opCode.join("") + "c: " + currentIndex)
}

export default async () => {
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: number[] = inputString.split(/[,]/).filter((num: string) => !!num).map(Number)

    const inputForFirstPart = [...input]

    const output: number[] = intCodeComputer(inputForFirstPart)
}
