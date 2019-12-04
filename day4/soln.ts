/**
 * CodeOfAdvent - 2019
 * Solution for Day 4
 * 
 * Problem: https://adventofcode.com/2019/day/4
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */
const checkFirstCondition = (password: number): boolean => {
    const passwordArray = `${password}`.split("").map(Number);

    const result = passwordArray.reduce(({ previous, hasAdj, status }, current: number) => ({
        previous: current,
        hasAdj: hasAdj ? hasAdj : (previous === current),
        status: status === false ? false : (current >= previous)
    }), { previous: 0, hasAdj: false, status: true })

    // console.log(result)
    return result.status && result.hasAdj
}

const checkSecondCondition = (password: number): boolean => {
    const passwordArray = `${password}`.split("").map(Number);

    const result = passwordArray.reduce(({ previous, repeated, status }, current: number) => {
        repeated[current] = (repeated[current] || 0) + 1

        return {
            previous: current,
            repeated,
            status: status === false ? false : (current >= previous)
        }
    }, { previous: 0, repeated: {}, status: true })

    // console.log(result)
    return result.status && (Object.entries(result.repeated).reduce((status, [key, count]) => status ? true : (count === 2), false))
}


export default async () => {
    const input: number[] = [353096, 843212]

    let firstCounter = 0
    let secondCounter = 0
    for (let i = input[0]; i <= input[1]; i++) {
        if (checkFirstCondition(i)) {
            firstCounter++
        }

        if (checkSecondCondition(i)) {
            secondCounter++
        }
    }

    console.log(`Part I: ${firstCounter}`)
    console.log(`Part II: ${secondCounter}`)
}
