/**
 * CodeOfAdvent - 2019
 * Solution for Day 10
 * 
 * Problem: https://adventofcode.com/2019/day/10
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const ASTEROID = "#"
const EMPTY = "."

const extractAsteroids = (space: string[][]): string[] => {
    return space.reduce((asteroids: string[], asteroidsInLine: string[], yIndex: number) => {
        return asteroidsInLine.reduce((asteroids: string[], asteroid: string, xIndex: number) => {
            if (asteroid === ASTEROID) {
                asteroids.push(`${xIndex},${yIndex}`)

                return asteroids
            }

            return asteroids
        }, asteroids)
    }, [])
}

const angleBetweenAsteroids = (asteroidFirst: string, asteroidSecond: string): number => {
    const [x1, y1] = asteroidFirst.split(",").map(Number)
    const [x2, y2] = asteroidSecond.split(",").map(Number)

    return (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI
}

type AsteroidInLOS = { coord: string, angle: number }
const getAsteroidsInLOS = (monitoringAsteroid: string, asteroids: string[]): AsteroidInLOS[] => {
    return asteroids.reduce((asteroidsInLOS: AsteroidInLOS[], asteroid: string) => {
        if (asteroid === monitoringAsteroid) {
            return asteroidsInLOS
        }

        const angle: number = angleBetweenAsteroids(monitoringAsteroid, asteroid)
        const isBlocked = asteroidsInLOS.find((asteroidInLOS: AsteroidInLOS) => asteroidInLOS.angle === angle)

        if (!isBlocked) {
            asteroidsInLOS.push({
                coord: asteroid,
                angle: angle
            })
        }

        return asteroidsInLOS
    }, [])
}

type MonitoringStation = { losAsteroidsCount: number, coord: string }
const monitoringStationFinder = (asteroids: string[]): MonitoringStation => {
    return asteroids.reduce((monitoringStation: MonitoringStation, asteroid: string) => {
        const count = getAsteroidsInLOS(asteroid, asteroids).length

        return monitoringStation.losAsteroidsCount > count ? monitoringStation : { losAsteroidsCount: count, coord: asteroid }
    }, { losAsteroidsCount: 0, coord: "" })
}

const asteroidsVaporizedAtNth = (asteroids: string[], monitoringStation: string, n: number): AsteroidInLOS => {
    const asteroidsInLOS = getAsteroidsInLOS(monitoringStation, asteroids).sort((a, b) => (a.angle - b.angle === 0 ? a.angle - b.angle : a.angle - b.angle))
    const asteroidIndexAtUp = asteroidsInLOS.findIndex(asteroid => asteroid.angle === 90)

    return asteroidsInLOS[n - 1 + asteroidIndexAtUp - asteroidsInLOS.length]
}

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: string[][] = inputString.split(/[\s]/).filter((ast: string) => !!ast).map(ast => ast.split(""))
    console.timeEnd("Initializing")

    console.time("Extracting Asteroids")
    const asteroids = extractAsteroids(input)
    console.timeEnd("Extracting Asteroids")

    console.time("Counting Asteroids with LOS")
    const monitoringStation = monitoringStationFinder(asteroids)
    console.timeEnd("Counting Asteroids with LOS")

    console.log(`Part I: No. of LOS = ${monitoringStation.losAsteroidsCount} for Station at ${monitoringStation.coord}`)

    console.time("Vaporization")
    const { coord } = asteroidsVaporizedAtNth(asteroids, monitoringStation.coord, 200)
    console.timeEnd("Vaporization")

    const [x, y] = coord.split(",").map(Number)
    console.log(`Part II: Asteroids vaporized at 200th number is at coord: ${coord}, and answer is: ${x * 100 + y}`)
}
