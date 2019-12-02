/**
 * CodeOfAdvent - 2019
 * Solution for Day 1
 * 
 * Problem: https://adventofcode.com/2019/day/1
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

export default async () => {
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: number[] = inputString.split(/[\s]/).filter((num: string) => !!num).map(Number)
    const fuelCalculator = (mass: number): number => Math.floor(mass / 3) - 2

    // Part I
    const totalFuel: number = input.reduce((sum: number, moduleMass: number): number => {
        sum += fuelCalculator(moduleMass)

        return sum
    }, 0)

    console.log(`Part I - Sum of the fuel requirement = ${totalFuel}`)

    // Part II
    const totalFuelRecursive: number = input.reduce((sum: number, moduleMass: number): number => {
        const recursiveFuelCalculator = (mass: number, totalFuel: number = 0): number => {
            const fuel = fuelCalculator(mass)
            if (fuel > 0) {
                totalFuel += fuel
                return recursiveFuelCalculator(fuel, totalFuel)
            }

            return totalFuel
        }

        return sum + recursiveFuelCalculator(moduleMass)
    }, 0)

    console.log(`Part II - Recursive sum of the fuel requirement = ${totalFuelRecursive}`)
}
