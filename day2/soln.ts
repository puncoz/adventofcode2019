/**
 * CodeOfAdvent - 2019
 * Solution for Day 2
 * 
 * Problem: https://adventofcode.com/2019/day/2
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const ADDITION = 1
const MULTIPLICATION = 2
const HALT = 99

const intCodeComputer = (inputArray: number[], currentIndex: number = 0): number[] => {
    const opCode = inputArray[currentIndex]

    if (opCode === HALT) {
        return inputArray
    }

    const firstInput = inputArray[inputArray[currentIndex + 1]]
    const secondInput = inputArray[inputArray[currentIndex + 2]]
    const outputIndex = inputArray[currentIndex + 3]
    const nextIndex = currentIndex + 4

    if (opCode === ADDITION) {
        inputArray[outputIndex] = firstInput + secondInput

        return intCodeComputer(inputArray, nextIndex)
    }

    if (opCode === MULTIPLICATION) {
        inputArray[outputIndex] = firstInput * secondInput

        return intCodeComputer(inputArray, nextIndex)
    }

    throw new Error("Something went wrong.")
}

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: number[] = inputString.split(/[,]/).filter((num: string) => !!num).map(Number)
    console.timeEnd("Initializing")

    console.time("Part I")
    const inputForFirstPart = [...input]
    inputForFirstPart[1] = 12
    inputForFirstPart[2] = 2

    const output: number[] = intCodeComputer(inputForFirstPart)
    console.timeEnd("Part I")

    console.log(`Part I: Value left at position 0 after the program halts = ${output[0]}`)

    console.time("Part II")
    let isBreak: boolean = false
    let noun = 0
    let verb = 0
    for (let tempNoun = 0; tempNoun <= 99; tempNoun++) {
        for (let tempVerb = 0; tempVerb <= 99; tempVerb++) {
            const tempInput = [...input]
            tempInput[1] = tempNoun
            tempInput[2] = tempVerb

            const output: number[] = intCodeComputer(tempInput)

            if (output[0] === 19690720) {
                noun = tempNoun
                verb = tempVerb
                isBreak = true
                break
            }
        }

        if (isBreak) {
            break
        }
    }
    console.timeEnd("Part II")

    console.log(`Part II: ${100 * noun + verb}`)
}
