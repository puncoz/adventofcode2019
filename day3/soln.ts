/**
 * CodeOfAdvent - 2019
 * Solution for Day 3
 *
 * Problem: https://adventofcode.com/2019/day/3
 *
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { benchmark, readInputFile } from "../utils"

const MAX = 999999
const DISTANCE_MAGNITUDE = [
    {U: 0, D: 0, R: 1, L: -1},
    {U: 1, D: -1, R: 0, L: 0},
]

const manhattanDistance = ([x, y]: [number, number]): number => {
    return Math.abs(x) + Math.abs(y)
}

type Point = { coord: string, distance: number, steps: number }

const travelledPoints = (line: string[]): Array<Point> => {
    const travelledPoints: Array<Point> = []
    let currentPoint = [0, 0]
    let steps = 0

    line.forEach((path: string) => {
        const direction: string = path[0]
        const distance: number = parseInt(path.substr(1))

        for (let d = 1; d <= distance; d++) {
            const x = DISTANCE_MAGNITUDE[0][direction] + currentPoint[0]
            const y = DISTANCE_MAGNITUDE[1][direction] + currentPoint[1]
            currentPoint = [x, y]

            const point: string = `${x},${y}`
            steps = steps + 1

            travelledPoints.push({
                coord: point,
                distance: manhattanDistance([x, y]),
                steps: steps,
            })
        }
    })

    return travelledPoints
}

const findIntersections = (lines: [Array<Point>, Array<Point>]): Array<Point> => {
    // Put the smallest array in the beginning
    if (lines[0].length > lines[1].length) {
        const temp = lines[0]
        lines[0] = lines[1]
        lines[1] = temp
    }

    const hashMap = new Map()
    for (const point of lines[0]) {
        hashMap.set(point.coord, point)
    }

    return lines[1].reduce((intersections, secondPoint) => {
        const firstPoint = hashMap.get(secondPoint.coord)
        if (firstPoint) {
            intersections.push({...secondPoint, steps: secondPoint.steps + firstPoint.steps})
        }

        return intersections
    }, [])
}

export default async () => {
    const lines: [string[], string[]] = await benchmark("Initializing", async () => {
        const inputString: string = await readInputFile(__dirname + "/input.txt")
        // const inputString = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51 U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`

        return inputString.split(/[\s]/).filter((line: string) => !!line).map((line: string): string[] => line.split(/[,]/))
    })

    const firstTravelledPoints: Array<Point> = await benchmark("firstTravelledPoints", async () => {
        return travelledPoints(lines[0])
    })

    const secondTravelledPoints: Array<Point> = await benchmark("secondTravelledPoints", async () => {
        return travelledPoints(lines[1])
    })

    const intersections: Array<Point> = await benchmark("Finding intersection", async () => {
        return findIntersections([firstTravelledPoints, secondTravelledPoints])
    })

    const closestDistance: number = await benchmark("closestDistance", async () => {
        return intersections.reduce((min: number, point): number => {
            return min < point.distance ? min : point.distance
        }, MAX)
    })

    const closestSteps: number = await benchmark("closestDistance", async () => {
        return intersections.reduce((min: number, point): number => {
            return min < point.steps ? min : point.steps
        }, MAX)
    })

    console.log(`Part I: ${closestDistance}`)
    console.log(`Part I: ${closestSteps}`)
}
