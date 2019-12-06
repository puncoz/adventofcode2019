/**
 * CodeOfAdvent - 2019
 * Solution for Day 5
 * 
 * Problem: https://adventofcode.com/2019/day/5
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const FIRST_USER_INPUT = 1
const SECOND_USER_INPUT = 5

const POSITION = 0
const IMMEDIATE = 1

const intCodeComputer = (inputArray: number[], currentIndex: number, userInput: number): number[] => {
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

        return intCodeComputer(inputArray, currentIndex + 4, userInput)
    }

    if (opCode[4] === 2) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam
        inputArray[thirdParam] = first * second

        return intCodeComputer(inputArray, currentIndex + 4, userInput)
    }

    if (opCode[4] === 3) {
        inputArray[firstParam] = userInput

        return intCodeComputer(inputArray, currentIndex + 2, userInput)
    }

    if (opCode[4] === 4) {
        const op = modes[0] === POSITION ? inputArray[firstParam] : firstParam

        console.log(`For user input, "${userInput}" , output is "${op}"`)
        return intCodeComputer(inputArray, currentIndex + 2, userInput)
    }

    if (opCode[4] === 5) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        const nextIndex = first !== 0 ? second : currentIndex + 3

        return intCodeComputer(inputArray, nextIndex, userInput)
    }

    if (opCode[4] === 6) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        const nextIndex = first === 0 ? second : currentIndex + 3

        return intCodeComputer(inputArray, nextIndex, userInput)
    }

    if (opCode[4] === 7) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        inputArray[thirdParam] = first < second ? 1 : 0

        return intCodeComputer(inputArray, currentIndex + 4, userInput)
    }

    if (opCode[4] === 8) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        inputArray[thirdParam] = first === second ? 1 : 0

        return intCodeComputer(inputArray, currentIndex + 4, userInput)
    }

    throw new Error("Something went wrong." + opCode.join("") + "c: " + currentIndex)
}

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: number[] = inputString.split(/[,]/).filter((num: string) => !!num).map(Number)
    console.timeEnd("Initializing")

    console.time("Part I")
    const inputForFirstPart = [...input]
    intCodeComputer(inputForFirstPart, 0, FIRST_USER_INPUT)
    console.timeEnd("Part I")

    console.time("Part II")
    const inputForSecondPart = [...input]
    intCodeComputer(inputForSecondPart, 0, SECOND_USER_INPUT)
    console.timeEnd("Part II")
}
