/**
 * CodeOfAdvent - 2019
 * Solution for Day 2
 * 
 * Problem: https://adventofcode.com/2019/day/2
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile, benchmark, IntCodeComputer, IntCodeComputerResponse } from "../utils"

const nounVerbFinder = (program: number[], expectedOutput: number): [number, number] => {
    let breakFlag: boolean = false
    let noun: number = 0
    let verb: number = 0

    for (let tempNoun = 0; tempNoun <= 99; tempNoun++) {
        for (let tempVerb = 0; tempVerb <= 99; tempVerb++) {
            const tempProrgam = [...program]
            tempProrgam[1] = tempNoun
            tempProrgam[2] = tempVerb

            const response: IntCodeComputerResponse = (new IntCodeComputer({ program: tempProrgam })).execute()

            if (response.program[0] === expectedOutput) {
                noun = tempNoun
                verb = tempVerb
                breakFlag = true
                break
            }
        }

        if (breakFlag) {
            break
        }
    }

    return [noun, verb]
}

export default async () => {
    const input: number[] = await benchmark("Initializing", async () => {
        const inputString: string = await readInputFile(__dirname + "/input.txt")

        return inputString.split(/[,]/).filter((num: string) => !!num).map(Number)
    })

    const partI: number = await benchmark("Part I", async () => {
        const program = [...input]
        program[1] = 12
        program[2] = 2
        const response: IntCodeComputerResponse = (new IntCodeComputer({ program })).execute()

        return response.program[0]
    })
    console.log(`Part I: ${partI}\n`)

    const partII: number = await benchmark("Part II", async () => {
        const [noun, verb] = nounVerbFinder([...input], 19690720)

        return 100 * noun + verb
    })
    console.log(`Part II: ${partII}`)
}
