/**
 * CodeOfAdvent - 2019
 * Solution for Day 7
 * 
 * Problem: https://adventofcode.com/2019/day/7
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const POSITION = 0
const IMMEDIATE = 1

const intCodeComputer = (inputArray: number[], currentIndex: number, userInput: number[], output: (op: number) => void, inputIter: number = 0): number[] => {
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

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output, inputIter)
    }

    if (opCode[4] === 2) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam
        inputArray[thirdParam] = first * second

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output, inputIter)
    }

    if (opCode[4] === 3) {
        inputArray[firstParam] = userInput[inputIter]
        inputIter++

        return intCodeComputer(inputArray, currentIndex + 2, userInput, output, inputIter)
    }

    if (opCode[4] === 4) {
        const op = modes[0] === POSITION ? inputArray[firstParam] : firstParam

        output(op)
        return intCodeComputer(inputArray, currentIndex + 2, userInput, output, inputIter)
    }

    if (opCode[4] === 5) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        const nextIndex = first !== 0 ? second : currentIndex + 3

        return intCodeComputer(inputArray, nextIndex, userInput, output, inputIter)
    }

    if (opCode[4] === 6) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        const nextIndex = first === 0 ? second : currentIndex + 3

        return intCodeComputer(inputArray, nextIndex, userInput, output, inputIter)
    }

    if (opCode[4] === 7) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        inputArray[thirdParam] = first < second ? 1 : 0

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output, inputIter)
    }

    if (opCode[4] === 8) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        inputArray[thirdParam] = first === second ? 1 : 0

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output, inputIter)
    }

    throw new Error("Something went wrong." + opCode.join("") + "c: " + currentIndex)
}

// https://stackoverflow.com/questions/9960908/permutations-in-javascript
const permute = (ar) =>
    ar.length === 1 ? ar : ar.reduce((ac, _, i) => { permute([...ar.slice(0, i), ...ar.slice(i + 1)]).map(v => ac.push([].concat(ar[i], v))); return ac; }, []);

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: number[] = inputString.split(/[,]/).filter((num: string) => !!num).map(Number)
    console.timeEnd("Initializing")

    console.time("Part I")
    const outputToThrusters = permute([0, 1, 2, 3, 4]).reduce((output, phase) => {
        let outputA = 0
        intCodeComputer([...input], 0, [phase[0], 0], (op: number) => {
            outputA = op
        })

        let outputB = 0
        intCodeComputer([...input], 0, [phase[1], outputA], (op: number) => {
            outputB = op
        })

        let outputC = 0
        intCodeComputer([...input], 0, [phase[2], outputB], (op: number) => {
            outputC = op
        })

        let outputD = 0
        intCodeComputer([...input], 0, [phase[3], outputC], (op: number) => {
            outputD = op
        })

        let outputE = 0
        intCodeComputer([...input], 0, [phase[4], outputD], (op: number) => {
            outputE = op
        })

        return outputE > output ? outputE : output
    }, 0)
    console.timeEnd("Part I")

    console.log(outputToThrusters)
}
