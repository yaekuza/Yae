import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const input = 'src/assets/img7.png'
const output = 'src/assets/about-ascii.txt'
const width = 96
const ramp = ' .,:;/<>JORGE'

const result = spawnSync(
  'convert',
  [input, '-background', 'black', '-alpha', 'remove', '-resize', `${width}x`, '-colorspace', 'Gray', '-compress', 'none', 'pgm:-'],
  { encoding: 'buffer' },
)

if (result.status !== 0) {
  process.stderr.write(result.stderr)
  process.exit(result.status || 1)
}

const tokens = result.stdout.toString('ascii').split(/\s+/).filter(Boolean)

if (tokens[0] !== 'P2') {
  throw new Error('Expected ImageMagick to output a plain PGM image.')
}

let index = 1
const imageWidth = Number(tokens[index++])
const imageHeight = Number(tokens[index++])
const maxValue = Number(tokens[index++])
const pixels = tokens.slice(index).map(Number)
let ascii = ''

for (let y = 0; y < imageHeight; y += 2) {
  for (let x = 0; x < imageWidth; x += 1) {
    const pixel = pixels[y * imageWidth + x] ?? 0
    const rampIndex = Math.round((pixel / maxValue) * (ramp.length - 1))
    ascii += ramp[rampIndex]
  }

  ascii += '\n'
}

fs.writeFileSync(output, ascii.trimEnd() + '\n')
console.log(`${output} ${imageWidth}x${Math.ceil(imageHeight / 2)}`)
