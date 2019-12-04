/**
 * CodeOfAdvent - 2019
 * Solution for Day 4
 * 
 * Problem: https://adventofcode.com/2019/day/4
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */
const checkCondition = (passcode: number): { first: boolean, second: boolean } => {
    const passcodeArray = `${passcode}`.split("").map(Number);

    const result = passcodeArray.reduce((res, current: number) => {
        res.repeatedCount[current] = (res.repeatedCount[current] || 0) + 1

        return {
            previous: current,
            hasAdj: res.hasAdj ? res.hasAdj : (res.previous === current),
            isInAsc: res.isInAsc === false ? false : (current >= res.previous),
            repeatedCount: res.repeatedCount
        }
    }, { previous: 0, hasAdj: false, isInAsc: true, repeatedCount: {} })

    const hasExactDouble: boolean = Object.entries(result.repeatedCount).reduce((hasDouble: boolean, [_, count]): boolean => hasDouble ? true : (count === 2), false)

    return {
        first: result.isInAsc && result.hasAdj,
        second: result.isInAsc && hasExactDouble
    }
}


export default async () => {
    const input: number[] = [353096, 843212]

    let firstCounter = 0
    let secondCounter = 0
    for (let i = input[0]; i <= input[1]; i++) {
        const result = checkCondition(i)

        if (result.first) {
            firstCounter++
        }

        if (result.second) {
            secondCounter++
        }
    }

    console.log(`Part I: ${firstCounter}`)
    console.log(`Part II: ${secondCounter}`)
}
