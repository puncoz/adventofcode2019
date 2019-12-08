/**
 * CodeOfAdvent - 2019
 * Solution for Day 1
 * 
 * Problem: https://adventofcode.com/2019/day/1
 * 
 * @author Puncoz Nepal <github.com/puncoz>
 */

import { readInputFile } from "../helpers"

const MAX = 999999999

const extractLayers = (pixels: number[], [width, height]: [number, number]): number[][] => {
    return pixels.reduce((layers: number[][], pixel, index) => {
        const layerIndex = Math.floor(index / (width * height))
        const pixelIndex = index - layerIndex * (width * height)

        if (!layers[layerIndex]) {
            layers[layerIndex] = []
        }

        layers[layerIndex][pixelIndex] = pixel

        return layers
    }, []).filter((layer: number[]) => layer.length === width * height)
}

const digitsCounter = (layers: number[][]) => {
    return layers.map((layer: number[]) => {
        return layer.reduce((count, pixel) => {
            const cnt = count.hasOwnProperty(pixel) ? count[pixel] + 1 : 1

            return { ...count, [pixel]: cnt }
        }, {})
    })
}

const layersWithLessDigits = (layers: number[][], digit: string) => {
    return digitsCounter(layers).reduce((layerWithLessDigits, layer) => {
        const lowestCount = layerWithLessDigits.hasOwnProperty(digit) ? layerWithLessDigits[digit] : MAX

        return lowestCount < layer[digit] ? layerWithLessDigits : layer
    }, {})
}

const imageDecoder = (layers: number[][]): number[] => {
    return layers[0].map((pixel, pixelIndex) => {
        if (pixel === 2) {
            for (let i = 0; i < layers.length; i++) {
                if (layers[i][pixelIndex] !== 2) {
                    pixel = layers[i][pixelIndex]
                    break
                }
            }
        }

        return pixel
    })
}

const renderImage = (image: number[], [width, height]: [number, number]): void => {
    const toRender = image.reduce(({ imageString, prevHeight }, pixel: number, pixelIndex: number) => {
        const currentHeight = Math.floor(pixelIndex / width)
        const newLine = currentHeight !== prevHeight ? "\n" : ""

        return {
            imageString: `${imageString}${newLine}${pixel === 0 ? " " : pixel}`,
            prevHeight: currentHeight
        }
    }, { imageString: "", prevHeight: 0 })

    console.log(toRender.imageString)
}

export default async () => {
    console.time("Initializing")
    const inputString: string = await readInputFile(__dirname + "/input.txt")
    const input: number[] = inputString.split("").filter((num: string) => !!num).map(Number)
    console.timeEnd("Initializing")

    console.time("Extract Layers")
    const layers: number[][] = extractLayers(input, [25, 6])
    console.timeEnd("Extract Layers")

    console.time("Part I")
    const layerWithLessZero = layersWithLessDigits(layers, "0")
    console.timeEnd("Part I")

    console.time("Part II")
    const image = imageDecoder(layers)
    console.log("PArt II:")
    renderImage(image, [25, 6])
    console.timeEnd("Part II")
}
