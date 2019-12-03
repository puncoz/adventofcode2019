/**
 * CodeOfAdvent - 2019
 * Solution for Day 3
 * 
 * Problem: https://adventofcode.com/2019/day/3
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const UP = "U"
const DOWN = "D"
const RIGHT = "R"
const LEFT = "L"
const MAX = 999999

const findTravelledPoints = (input: string[]): Array<number>[] => {
    const travelledPoints: Array<number>[] = []
    let currentPosition = [0, 0]
    for (let i = 0; i < input.length; i++) {
        const nextDirection = input[i]
        const direction = nextDirection[0]
        const distance = parseInt(nextDirection.substr(1))

        if ([RIGHT, LEFT].includes(direction)) {
            for (let j = 1; j <= distance; j++) {
                const reducer = direction === RIGHT ? currentPosition[0] + 1 : currentPosition[0] - 1
                travelledPoints.push([reducer, currentPosition[1]])

                currentPosition[0] = reducer
            }
            continue;
        }

        for (let j = 1; j <= distance; j++) {
            const reducer = direction === UP ? currentPosition[1] + 1 : currentPosition[1] - 1
            travelledPoints.push([currentPosition[0], reducer])

            currentPosition[1] = reducer
        }
    }

    return travelledPoints
}

export default async () => {
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    // const inputString = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51 U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`
    const input = inputString.split(/[\s]/).filter((num: string) => !!num).map((data: string): string[] => data.split(/[,]/))

    const firstTravelledPoints = findTravelledPoints(input[0])
    const secondTravelledPoints = findTravelledPoints(input[1])

    let closestIntersectionDistance = MAX
    let lowestSteps = MAX
    for (let i = 0; i < firstTravelledPoints.length; i++) {
        for (let j = 0; j < secondTravelledPoints.length; j++) {
            if (firstTravelledPoints[i][0] === secondTravelledPoints[j][0] && firstTravelledPoints[i][1] === secondTravelledPoints[j][1]) {
                const distance = Math.abs(firstTravelledPoints[i][0]) + Math.abs(firstTravelledPoints[i][1])
                const steps = i + j + 2
                lowestSteps = lowestSteps < steps ? lowestSteps : steps
                closestIntersectionDistance = closestIntersectionDistance < distance ? closestIntersectionDistance : distance
            }
        }
    }

    console.log(`Part I: Manhattan distance to a closest intersection = ${closestIntersectionDistance}`)
    console.log(`Part II: Fewest combined steps the wires must take to reach an intersection = ${lowestSteps}`)
}
