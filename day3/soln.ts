/**
 * CodeOfAdvent - 2019
 * Solution for Day 3
 * 
 * Problem: https://adventofcode.com/2019/day/3
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const MAX = 999999
const DISTANCE_MAGNITUDE = [
    { U: 0, D: 0, R: 1, L: -1 },
    { U: 1, D: -1, R: 0, L: 0 },
]

const findTravelledPoints = (inputArray: string[]): Array<string> => {
    const travelledPointsString: Array<string> = []
    let current = [0, 0]

    inputArray.forEach((input: string) => {
        const direction: string = input[0]
        const distance: number = parseInt(input.substr(1))

        for (let d = 1; d <= distance; d++) {
            const x = DISTANCE_MAGNITUDE[0][direction] + current[0]
            const y = DISTANCE_MAGNITUDE[1][direction] + current[1]
            current = [x, y]

            travelledPointsString.push(`${x},${y}`)
        }
    })

    return travelledPointsString
}

export default async () => {
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    // const inputString = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51 U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`
    const input = inputString.split(/[\s]/).filter((num: string) => !!num).map((data: string): string[] => data.split(/[,]/))

    const firstTravelledPoints = findTravelledPoints(input[0])
    const secondTravelledPoints = findTravelledPoints(input[1])

    interface Result {
        distance: number,
        steps: number
    }

    const result: Result = firstTravelledPoints.reduce((res: Result, point: string, firstIndex: number): Result => {
        const secondIndex: number = secondTravelledPoints.indexOf(point)

        if (secondIndex >= 0) {
            const xy = point.split(",").map(Number)
            const distance = Math.abs(xy[0]) + Math.abs(xy[1])
            const step = firstIndex + secondIndex + 2

            return {
                steps: res.steps < step ? res.steps : step,
                distance: res.distance < distance ? res.distance : distance
            }
        }

        return res
    }, { distance: MAX, steps: MAX })

    console.log(`Part I: Manhattan distance to a closest intersection = ${result.distance}`)
    console.log(`Part II: Fewest combined steps the wires must take to reach an intersection = ${result.steps}`)
}
