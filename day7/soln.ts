/**
 * CodeOfAdvent - 2019
 * Solution for Day 5
 * 
 * Problem: https://adventofcode.com/2019/day/5
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const POSITION = 0
const IMMEDIATE = 1

type UserInputCallback = () => number
type OutputCallback = (op: number) => void

type IntCodeComputerResponse = {
    program: number[],
    currentIndex: number,
    isHalted: boolean,
    isPaused: boolean
}

const intCodeComputer = (inputArray: number[], currentIndex: number, userInput: UserInputCallback, output: OutputCallback): IntCodeComputerResponse => {
    const opCode = `${inputArray[currentIndex]}`.padStart(5, "0").split("").map(Number)

    if (opCode[4] === 9 && opCode[3] === 9) {
        return { program: inputArray, currentIndex, isHalted: true, isPaused: false }
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
        const input = userInput()
        if (typeof input === "undefined") {
            return { program: inputArray, currentIndex, isHalted: false, isPaused: true }
        }

        inputArray[firstParam] = input

        return intCodeComputer(inputArray, currentIndex + 2, userInput, output)
    }

    if (opCode[4] === 4) {
        const op = modes[0] === POSITION ? inputArray[firstParam] : firstParam
        output(op)

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
const permutation = (ar: number[]): number[][] =>
    ar.length === 1 ? ar : ar.reduce((ac, _, i) => { permutation([...ar.slice(0, i), ...ar.slice(i + 1)]).map(v => ac.push([].concat(ar[i], v))); return ac; }, []);


const computeForFirstPart = (program: number[]): number => permutation([0, 1, 2, 3, 4]).reduce((output: number, phase: number[]): number => {
    let amplifierOutput = []
    for (let i = 0; i < 5; i++) {
        let isFirstInput = true
        intCodeComputer([...program], 0, () => {
            const input = isFirstInput ? phase[i] : (amplifierOutput[i - 1] || 0)
            isFirstInput = false

            return input
        }, (op: number) => {
            amplifierOutput[i] = op
        })
    }

    return amplifierOutput[4] > output ? amplifierOutput[4] : output
}, 0)

const computeForSecondPart = (program: number[]): number => {
    return permutation([5, 6, 7, 8, 9]).reduce((output: number, phase: number[]): number => {
        const amplifiers = [
            { program, currentIndex: 0, input: undefined, isFirstInput: true, isSecondInput: true, output: 0 },
            { program, currentIndex: 0, input: undefined, isFirstInput: true, isSecondInput: true, output: 0 },
            { program, currentIndex: 0, input: undefined, isFirstInput: true, isSecondInput: true, output: 0 },
            { program, currentIndex: 0, input: undefined, isFirstInput: true, isSecondInput: true, output: 0 },
            { program, currentIndex: 0, input: undefined, isFirstInput: true, isSecondInput: true, output: 0 },
        ]

        while (true) {
            let halt = false
            for (let i = 0; i < 5; i++) {
                const response = intCodeComputer([...amplifiers[i].program], amplifiers[i].currentIndex, () => {
                    if (amplifiers[i].isFirstInput) {
                        amplifiers[i].isFirstInput = false

                        return phase[i]
                    }

                    if (i === 0 && amplifiers[i].isSecondInput) {
                        amplifiers[i].isSecondInput = false

                        return 0
                    }

                    const input = amplifiers[i].input
                    amplifiers[i].input = undefined

                    return input
                }, (op: number) => {
                    amplifiers[i === 4 ? 0 : i + 1].input = op
                    amplifiers[i].output = op
                })

                if (response.isHalted) {
                    halt = true
                }

                amplifiers[i] = { ...amplifiers[i], program: response.program, currentIndex: response.currentIndex }
            }

            if (halt) {
                break
            }
        }

        return amplifiers[4].output > output ? amplifiers[4].output : output
    }, 0)
}

export default async () => {
    console.time("Initializing")
    const programString: string = await readInputFile(__dirname + "/input.txt")
    // const programString = `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`
    const program: number[] = programString.split(/[,]/).filter((num: string) => !!num).map(Number)
    console.timeEnd("Initializing")

    const outputToThrusters = []

    console.time("Part I")
    outputToThrusters[0] = computeForFirstPart([...program])
    console.timeEnd("Part I")

    console.time("Part II")
    outputToThrusters[1] = computeForSecondPart([...program])
    console.timeEnd("Part II")

    console.log(`Highest signal to the thrusters without feedback: ${outputToThrusters[0]}`)
    console.log(`Highest signal to the thrusters with feedback: ${outputToThrusters[1]}`)
}
