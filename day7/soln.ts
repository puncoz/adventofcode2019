/**
 * CodeOfAdvent - 2019
 * Solution for Day 7
 * 
 * Problem: https://adventofcode.com/2019/day/7
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const FIRST_USER_INPUT = 1
const SECOND_USER_INPUT = 5

const POSITION = 0
const IMMEDIATE = 1

const intCodeComputer = (inputArray: number[], currentIndex: number, userInput: number = undefined, output: (op: number) => void): { input: number[], currentIndex: number, isHalted: boolean } => {
    const opCode = `${inputArray[currentIndex]}`.padStart(5, "0").split("").map(Number)

    if (opCode[4] === 9 && opCode[3] === 9) {
        return { input: inputArray, currentIndex, isHalted: true }
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

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output)
    }

    if (opCode[4] === 2) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam
        inputArray[thirdParam] = first * second

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output)
    }

    if (opCode[4] === 3) {
        if (typeof userInput !== "undefined") {
            inputArray[firstParam] = userInput
            return intCodeComputer(inputArray, currentIndex + 2, undefined, output)
        }

        return { input: inputArray, currentIndex, isHalted: false }
    }

    if (opCode[4] === 4) {
        const op = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        // return { input: inputArray, currentIndex, isHalted: false }

        // if (op !== 0) {
        output(op)
        // }

        return intCodeComputer(inputArray, currentIndex + 2, userInput, output)
    }

    if (opCode[4] === 5) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        const nextIndex = first !== 0 ? second : currentIndex + 3

        return intCodeComputer(inputArray, nextIndex, userInput, output)
    }

    if (opCode[4] === 6) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        const nextIndex = first === 0 ? second : currentIndex + 3

        return intCodeComputer(inputArray, nextIndex, userInput, output)
    }

    if (opCode[4] === 7) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        inputArray[thirdParam] = first < second ? 1 : 0

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output)
    }

    if (opCode[4] === 8) {
        const first = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        const second = modes[1] === POSITION ? inputArray[secondParam] : secondParam

        inputArray[thirdParam] = first === second ? 1 : 0

        return intCodeComputer(inputArray, currentIndex + 4, userInput, output)
    }

    throw new Error("Something went wrong." + opCode.join("") + "c: " + currentIndex)
}

// https://stackoverflow.com/questions/9960908/permutations-in-javascript
const permute = (ar) =>
    ar.length === 1 ? ar : ar.reduce((ac, _, i) => { permute([...ar.slice(0, i), ...ar.slice(i + 1)]).map(v => ac.push([].concat(ar[i], v))); return ac; }, []);

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    // const inputString = `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`
    const input: number[] = inputString.split(/[,]/).filter((num: string) => !!num).map(Number)
    console.timeEnd("Initializing")

    console.time("Part II")
    const outputToThrusters = permute([5, 6, 7, 8, 9]).reduce((output: number, phase: number) => {
        console.log(phase.toString())
        let outputA = 0
        let amplifierA = intCodeComputer([...input], 0, phase[0], (op: number) => {
            outputA = op
        })
        console.log(JSON.stringify(amplifierA), outputA)

        let outputB = 0
        let amplifierB = intCodeComputer([...input], 0, phase[1], (op: number) => {
            outputB = op
        })
        console.log(JSON.stringify(amplifierB), outputB)

        let outputC = 0
        let amplifierC = intCodeComputer([...input], 0, phase[2], (op: number) => {
            outputC = op
        })
        console.log(JSON.stringify(amplifierC), outputC)

        let outputD = 0
        let amplifierD = intCodeComputer([...input], 0, phase[3], (op: number) => {
            outputD = op
        })
        console.log(JSON.stringify(amplifierD), outputD)

        let outputE = 0
        let amplifierE = intCodeComputer([...input], 0, phase[4], (op: number) => {
            outputE = op
        })
        console.log(JSON.stringify(amplifierE), outputE)

        let inputA = 0
        while (true) {
            amplifierA = intCodeComputer(amplifierA.input, amplifierA.currentIndex, inputA, (op: number) => {
                outputA = op
            })
            console.log(JSON.stringify(amplifierA), outputA)

            amplifierB = intCodeComputer(amplifierB.input, amplifierB.currentIndex, outputA, (op: number) => {
                outputB = op
            })
            console.log(JSON.stringify(amplifierB), outputB)

            amplifierC = intCodeComputer(amplifierC.input, amplifierC.currentIndex, outputB, (op: number) => {
                outputC = op
            })
            console.log(JSON.stringify(amplifierC), outputC)

            amplifierD = intCodeComputer(amplifierD.input, amplifierD.currentIndex, outputC, (op: number) => {
                outputD = op
            })
            console.log(JSON.stringify(amplifierD), outputD)

            amplifierE = intCodeComputer(amplifierE.input, amplifierE.currentIndex, outputD, (op: number) => {
                outputE = op
            })
            console.log(JSON.stringify(amplifierE), outputE)

            if (amplifierA.isHalted || amplifierB.isHalted || amplifierC.isHalted || amplifierD.isHalted || amplifierE.isHalted) {
                break
            }

            inputA = outputE
        }

        return outputE > output ? outputE : output
    }, 0)
    console.timeEnd("Part II")

    console.log(outputToThrusters)
}
