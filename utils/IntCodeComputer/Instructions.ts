import IntCodeComputer, { IntCodeComputerParams, IntCodeComputerResponse } from "./IntCodeComputer"

export interface OperationParams {
    params: [number, number, number]
    values: [number, number, number]
    writeIndex: number
}

// 99
export const HALT = (computerParams: IntCodeComputerParams, _): IntCodeComputerResponse => {
    const {program, pointer, relativeBase} = computerParams

    return {program, pointer: pointer + 1, relativeBase, hibernated: false, halted: true}
}

// 01
export const ADD = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {program, pointer} = computerParams
    const {writeIndex, values} = opsParam

    program[writeIndex] = values[0] + values[1]

    return (new IntCodeComputer({...computerParams, program, pointer: pointer + 4})).execute()
}

// 02
export const MULTIPLY = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {program, pointer} = computerParams
    const {writeIndex, values} = opsParam

    program[writeIndex] = values[0] * values[1]

    return (new IntCodeComputer({...computerParams, program, pointer: pointer + 4})).execute()
}

// 03
export const INPUT = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {input, program, pointer, relativeBase} = computerParams
    const {writeIndex} = opsParam

    const userInput = input()
    if (typeof userInput === "undefined") {
        return {program, pointer, relativeBase, halted: false, hibernated: true}
    }

    program[writeIndex] = userInput

    return (new IntCodeComputer({...computerParams, program, pointer: pointer + 2})).execute()
}

// 04
export const OUTPUT = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {output, pointer} = computerParams
    const {values} = opsParam

    output(values[0])

    return (new IntCodeComputer({...computerParams, pointer: pointer + 2})).execute()
}

// 05
export const JUMP_IF_NOT_EQUAL = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {pointer} = computerParams
    const {values} = opsParam

    const jumpTo = values[0] !== 0 ? values[1] : pointer + 3

    return (new IntCodeComputer({...computerParams, pointer: jumpTo})).execute()
}

// 06
export const JUMP_IF_EQUAL = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {pointer} = computerParams
    const {values} = opsParam

    const jumpTo = values[0] === 0 ? values[1] : pointer + 3

    return (new IntCodeComputer({...computerParams, pointer: jumpTo})).execute()
}

// 07
export const LESS_THAN = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {program, pointer} = computerParams
    const {writeIndex, values} = opsParam

    program[writeIndex] = values[0] < values[1] ? 1 : 0

    return (new IntCodeComputer({...computerParams, program, pointer: pointer + 4})).execute()
}

// 08
export const GREATER_THAN = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {program, pointer} = computerParams
    const {writeIndex, values} = opsParam

    program[writeIndex] = values[0] === values[1] ? 1 : 0

    return (new IntCodeComputer({...computerParams, program, pointer: pointer + 4})).execute()
}

// 09
export const RELATIVE = (computerParams: IntCodeComputerParams, opsParam: OperationParams): IntCodeComputerResponse => {
    const {relativeBase, pointer} = computerParams
    const {values} = opsParam

    const newRelativeBase = relativeBase + values[0]

    return (new IntCodeComputer({...computerParams, pointer: pointer + 2, relativeBase: newRelativeBase})).execute()
}
