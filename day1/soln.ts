/**
 * CodeOfAdvent - 2019
 * Solution for Day 1
 *
 * Problem: https://adventofcode.com/2019/day/1
 *
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { benchmark, readInputFile } from "../utils"

const fuelCalculator = (mass: number): number => Math.floor(mass / 3) - 2

const recursiveFuelCalculator = (mass: number, totalFuel: number = 0): number => {
    const fuel = fuelCalculator(mass)
    if (fuel > 0) {
        totalFuel += fuel
        return recursiveFuelCalculator(fuel, totalFuel)
    }

    return totalFuel
}

const totalFuel = (input: number[], calculator: (mass: number) => number): number => {
    return input.reduce((sum: number, moduleMass: number): number => {
        return sum + calculator(moduleMass)
    }, 0)
}

export default async () => {
    const input: number[] = await benchmark("Initializing", async () => {
        const inputString: string = await readInputFile(__dirname + "/input.txt")

        return inputString.split(/[\s]/).filter((num: string) => !!num).map(Number)
    })

    const totalFuelUsed = await benchmark("Part I", async () => {
        return totalFuel(input, fuelCalculator)
    })
    console.log(`Part I - Sum of the fuel requirement = ${totalFuelUsed}\n`)

    const totalFuelRecursive: number = await benchmark("Part II", async () => {
        return totalFuel(input, recursiveFuelCalculator)
    })
    console.log(`Part II - Recursive sum of the fuel requirement = ${totalFuelRecursive}`)
}
