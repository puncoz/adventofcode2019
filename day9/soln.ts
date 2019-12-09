/**
 * CodeOfAdvent - 2019
 * Solution for Day 5
 * 
 * Problem: https://adventofcode.com/2019/day/5
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"
import { relative } from "path"

const FIRST_USER_INPUT = 1
const SECOND_USER_INPUT = 2

const POSITION = 1
const IMMEDIATE = 2
const RELATIVE = 3

const getValue = (inputArray: number[], mode: number, param: number, relativeBase: number): number => {
    if (mode === POSITION) {
        return (inputArray[param] || 0)
    }

    if (mode === IMMEDIATE) {
        return param
    }

    if (mode === RELATIVE) {
        return (inputArray[param + relativeBase] || 0)
    }

    throw new Error("Unknown mode.")
}

const intCodeComputer = (inputArray: number[], currentIndex: number, userInput: number, relativeBase: number = 0): number[] => {
    const opCode = `${inputArray[currentIndex]}`.padStart(5, "0").split("").map(Number)

    if (opCode[4] === 9 && opCode[3] === 9) {
        return inputArray
    }

    const modes = [
        opCode[2] === 0 ? POSITION : (opCode[2] === 1 ? IMMEDIATE : (opCode[2] === 2 ? RELATIVE : 99999)),
        opCode[1] === 0 ? POSITION : (opCode[1] === 1 ? IMMEDIATE : (opCode[1] === 2 ? RELATIVE : 99999)),
        opCode[0] === 0 ? POSITION : (opCode[0] === 1 ? IMMEDIATE : (opCode[0] === 2 ? RELATIVE : 99999)),
    ]

    const firstParam = inputArray[currentIndex + 1] || 0
    const secondParam = inputArray[currentIndex + 2] || 0
    const thirdParam = inputArray[currentIndex + 3] || 0
    const first = getValue([...inputArray], modes[0], firstParam, relativeBase)
    const second = getValue([...inputArray], modes[1], secondParam, relativeBase)
    const third = getValue([...inputArray], modes[2], thirdParam, relativeBase)

    if (opCode[4] === 1) {
        inputArray[modes[2] === RELATIVE ? relativeBase + thirdParam : thirdParam] = first + second

        return intCodeComputer([...inputArray], currentIndex + 4, userInput, relativeBase)
    }

    if (opCode[4] === 2) {
        inputArray[modes[2] === RELATIVE ? relativeBase + thirdParam : thirdParam] = first * second

        return intCodeComputer([...inputArray], currentIndex + 4, userInput, relativeBase)
    }

    if (opCode[4] === 3) {
        inputArray[modes[0] === RELATIVE ? relativeBase + firstParam : firstParam] = userInput

        return intCodeComputer([...inputArray], currentIndex + 2, userInput, relativeBase)
    }

    if (opCode[4] === 4) {
        console.log(`For user input, "${userInput}" , output is "${first}}"`)

        return intCodeComputer([...inputArray], currentIndex + 2, userInput, relativeBase)
    }

    if (opCode[4] === 5) {
        const nextIndex = first !== 0 ? second : (currentIndex + 3)

        return intCodeComputer([...inputArray], nextIndex, userInput, relativeBase)
    }

    if (opCode[4] === 6) {
        const nextIndex = first === 0 ? second : (currentIndex + 3)

        return intCodeComputer([...inputArray], nextIndex, userInput, relativeBase)
    }

    if (opCode[4] === 7) {
        inputArray[modes[2] === RELATIVE ? relativeBase + thirdParam : thirdParam] = first < second ? 1 : 0

        return intCodeComputer([...inputArray], currentIndex + 4, userInput, relativeBase)
    }

    if (opCode[4] === 8) {
        inputArray[modes[2] === RELATIVE ? relativeBase + thirdParam : thirdParam] = first === second ? 1 : 0

        return intCodeComputer([...inputArray], currentIndex + 4, userInput, relativeBase)
    }

    if (opCode[4] === 9 && opCode[3] === 0) {
        return intCodeComputer([...inputArray], currentIndex + 2, userInput, relativeBase + first)
    }

    throw new Error("Something went wrong." + opCode.join("") + "c: " + currentIndex)
}

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    // const inputString = "1102,34915192,34915192,7,4,7,99,0"
    const input: number[] = inputString.split(/[,]/).filter((num: string) => !!num).map(Number)
    console.timeEnd("Initializing")

    console.time("Part I")
    intCodeComputer([...input], 0, FIRST_USER_INPUT)
    console.timeEnd("Part I")

    console.time("Part II")
    intCodeComputer([...input], 0, SECOND_USER_INPUT)
    console.timeEnd("Part II")
}
