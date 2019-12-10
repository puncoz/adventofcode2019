/**
 * CodeOfAdvent - 2019
 * Solution for Day 10
 * 
 * Problem: https://adventofcode.com/2019/day/10
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"
import { strict } from "assert"

const ASTEROID = "#"
const EMPTY = "."

const DIRECTIONS = {
    R: [1, 0],
    L: [-1, 0],
    T: [0, 1],
    D: [0, -1],
    RT: [1, 1],
    LT: [-1, 1],
    RD: [1, -1],
    LD: [-1, -1],
}

const extractAsteroids = (space: string[][]): string[] => {
    const asteroids = []
    space.forEach((asteroidsLine: string[], xIndex: number) => asteroidsLine.forEach((asteroid: string, yIndex) => {
        if (asteroid === ASTEROID) {
            asteroids.push(`${xIndex},${yIndex}`)
        }
    }))

    return asteroids
}

const angleBetweenAsteroids = (asteroidFirst: string, asteroidSecond: string) => {
    const coordFirst = asteroidFirst.split(",").map(Number)
    const coordSecond = asteroidSecond.split(",").map(Number)

    return Math.atan2(coordFirst[0] - coordSecond[0], coordFirst[1] - coordSecond[1])
}

const counter = (asteroid: string, asteroids: string[]) => {
    const asteroidAngleOnLOS = []
    asteroids.forEach((asteroidToCheck: string) => {
        if (asteroidToCheck === asteroid) {
            return
        }
        const angle = angleBetweenAsteroids(asteroidToCheck, asteroid)
        if (asteroidAngleOnLOS.indexOf(angle) === -1) {
            asteroidAngleOnLOS.push(angle)
        }
    })

    return asteroidAngleOnLOS.length
}

const asteroidsOnLOS = (asteroids: string[]) => {
    return asteroids.map((asteroid: string) => {
        return counter(asteroid, asteroids)
    })
}

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    // const inputString = `.#..#
    //                     .....
    //                     #####
    //                     ....#
    //                     ...##`
    const input: string[][] = inputString.split(/[\s]/).filter((ast: string) => !!ast).map(ast => ast.split(""))
    console.timeEnd("Initializing")

    console.time("Extracting Asteroids")
    const asteroids = extractAsteroids(input)
    console.timeEnd("Extracting Asteroids")

    console.time("Counting Asteroids with LOS")
    const maxCount = asteroidsOnLOS(asteroids).reduce((max, count: number) => {
        return max > count ? max : count
    }, 0)
    console.timeEnd("Counting Asteroids with LOS")

    console.log(maxCount)
}
