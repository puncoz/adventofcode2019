/**
 * CodeOfAdvent - 2019
 * Solution for Day 6
 * 
 * Problem: https://adventofcode.com/2019/day/6
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const prepareTree = (node, inputHashTable: { string?: string }, tree: Array<string> = []): Array<string> => {
    if (!inputHashTable.hasOwnProperty(node)) {
        return tree
    }

    const child = inputHashTable[node]
    tree = [...tree, child]

    return prepareTree(child, inputHashTable, tree)
}

const orbitCounter = (node, inputHashTable) => {
    const tree = prepareTree(node, inputHashTable)

    // console.log(tree)

    return tree.length
}

const shortestLengthBetweenTwoNodes = (node1: string, node2: string, inputHashTable: { string?: string }): number => {
    const firstPath = prepareTree(node1, inputHashTable)
    const secondPath = prepareTree(node2, inputHashTable)

    let count = 0
    for (let i = 0; i < firstPath.length; i++) {
        const indexIfCollides = secondPath.indexOf(firstPath[i])
        if (indexIfCollides !== -1) {
            count = i + indexIfCollides
            break
        }
    }

    return count
}

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    //     const inputString: string = `
    //     COM)B
    // B)C
    // C)D
    // D)E
    // E)F
    // B)G
    // G)H
    // D)I
    // E)J
    // J)K
    // K)L
    // K)YOU
    // I)SAN
    //     `
    const inputArray: Array<string[]> = inputString.split(/[\s]/).filter(d => !!d).map((d: string): string[] => d.split(")"))
    const inputHashTable: { string?: string } = inputArray.reduce((hash, [parent, child]) => ({ ...hash, [child]: parent }), {})
    const allObjectList: { string?: boolean } = inputArray.reduce((objects, [parent, child]) => ({ ...objects, [parent]: true, [child]: true }), {})
    console.timeEnd("Initializing")

    console.time("Part I")
    const totalOrbitsCount = Object.entries(allObjectList).reduce((total, [object]) => {
        return total + orbitCounter(object, inputHashTable)
    }, 0)
    console.timeEnd("Part I")

    console.time("Part II")
    const shortestLength = shortestLengthBetweenTwoNodes("YOU", "SAN", inputHashTable)
    console.timeEnd("Part II")

    console.log(`Part I: Total direct and indirect orbits count: ${totalOrbitsCount}`)
    console.log(`Part II: Shortest path length between "YOU" and "SAN": ${shortestLength}`)
}