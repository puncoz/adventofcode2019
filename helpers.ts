import { exists as checkIfFileExists, readFile } from "fs"

export const isFileExists = (filename: string): Promise<boolean> => new Promise(resolve => {
    checkIfFileExists(filename, (exists: boolean) => {
        resolve(exists)
    })
})

export const readInputFile = (fileName: string): any => new Promise((resolve, reject) => {
    readFile(fileName, { encoding: 'utf-8' }, (error, data) => {
        if (error) reject(error)
        else resolve(data)
    })
})