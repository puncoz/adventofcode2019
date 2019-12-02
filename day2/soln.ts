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

export default async () => {
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: number[] = inputString.split(/[,]/).filter((num: string) => !!num).map(Number)

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

    input[1] = 12
    input[2] = 2

    const output: number[] = intCodeComputer(input)

    console.log(`Part I: Value left at position 0 after the program halts = ${output[0]}`)
}
