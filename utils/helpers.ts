import { readFile, stat } from "fs"

export const isFileExists = (filename: string): Promise<boolean> => new Promise((resolve, reject) => {
    stat(filename, (err) => {
        if (err) reject(err)
        else resolve(true)
    })
})

export const readInputFile = (fileName: string): any => new Promise((resolve, reject) => {
    readFile(fileName, {encoding: "utf-8"}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
    })
})

export const benchmark = async (title: string, func: () => Promise<any>): Promise<any> => {
    console.time(title)
    const result = await func()
    console.timeEnd(title)

    return result
}
