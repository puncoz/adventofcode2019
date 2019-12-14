import * as instructions from "./Instructions"

enum MODES {
    POSITION = 0,
    IMMEDIATE = 1,
    RELATIVE = 2
}

const INSTRUCTIONS = {
    "99": instructions.HALT,
    "01": instructions.ADD,
    "02": instructions.MULTIPLY,
    "03": instructions.INPUT,
    "04": instructions.OUTPUT,
    "05": instructions.JUMP_IF_NOT_EQUAL,
    "06": instructions.JUMP_IF_EQUAL,
    "07": instructions.LESS_THAN,
    "08": instructions.GREATER_THAN,
    "09": instructions.RELATIVE,
}

type InputCallback = () => number
type OutputCallback = (op: number) => void

export interface IntCodeComputerParams {
    program: number[]
    pointer?: number
    relativeBase?: number
    input?: InputCallback
    output?: OutputCallback
    verbose?: boolean
}

export interface IntCodeComputerResponse {
    program: number[]
    pointer: number
    relativeBase: number
    halted: boolean
    hibernated: boolean
}

class IntCodeComputer {
    private readonly program: number[]
    private readonly pointer: number = 0
    private readonly relativeBase: number = 0
    private readonly input: InputCallback
    private readonly output: OutputCallback
    private readonly verbose: boolean
    private opCode: number[]
    private modes: [number, number, number]
    private params: [number, number, number]
    private values: [number, number, number]
    private writeIndex: number
    private instructionCode: string

    constructor(computerParams: IntCodeComputerParams) {
        this.program = computerParams.program
        this.pointer = computerParams.pointer || 0
        this.relativeBase = computerParams.relativeBase || 0
        this.input = computerParams.input || (() => undefined)
        this.output = computerParams.output || ((op: number) => { console.log(`Output: ${op}`) })
        this.verbose = computerParams.verbose || false

        this.boot()
    }

    private boot() {
        this.opCode = `${this.program[this.pointer]}`.padStart(5, "0").split("").map(Number)

        this.modes = [
            this.opCode[2],
            this.opCode[1],
            this.opCode[0],
        ]

        this.params = [
            this.program[this.pointer + 1] || 0,
            this.program[this.pointer + 2] || 0,
            this.program[this.pointer + 3] || 0,
        ]

        this.values = [
            this._getValue(0),
            this._getValue(1),
            this._getValue(2),
        ]

        this.writeIndex = this._getWriteIndex()

        this.instructionCode = `${this.opCode[3]}${this.opCode[4]}`
    }

    public execute(): IntCodeComputerResponse {
        this._log()

        if (!INSTRUCTIONS.hasOwnProperty(this.instructionCode)) {
            throw new Error(`Something went wrong for opCode: ${this.opCode.join("")} at pointer ${this.pointer}`)
        }

        return INSTRUCTIONS[this.instructionCode](
            this._prepareComputerParams(),
            this._prepareOperationParams(),
        )
    }

    protected _log() {
        if (!this.verbose) {
            return
        }

        console.info(JSON.stringify({
            pointer: this.pointer,
            relativeBase: this.relativeBase,
            opCode: this.opCode,
            params: this.params,
            values: this.values,
            writeIndex: this.writeIndex,
        }))
    }

    private _prepareComputerParams(): IntCodeComputerParams {
        return {
            program: this.program,
            pointer: this.pointer,
            relativeBase: this.relativeBase,
            input: this.input,
            output: this.output,
            verbose: this.verbose,
        }
    }

    private _prepareOperationParams(): instructions.OperationParams {
        return {
            params: this.params,
            values: this.values,
            writeIndex: this.writeIndex,
        }
    }

    private _getValue(index: number) {
        const mode = this.modes[index]
        const param = this.params[index]

        if (mode === MODES.POSITION) {
            return this.program[param] || 0
        }

        if (mode === MODES.IMMEDIATE) {
            return param
        }

        if (mode === MODES.RELATIVE) {
            return this.program[param + this.relativeBase] || 0
        }

        throw new Error(`Unknown mode: ${mode}`)
    }

    private _getWriteIndex() {
        const param = this.params[2]

        return this.modes[2] === MODES.RELATIVE ? (this.relativeBase + param) : param
    }
}

export default IntCodeComputer
