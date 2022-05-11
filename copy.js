#!/usr/bin/env node

const Promise = require('bluebird')

const util = require('util')
const fs = Promise.promisifyAll(require('fs'))
const path = Promise.promisifyAll(require('path'))
const minimatch = require('minimatch')

// helpers
const readdirAsync = util.promisify(fs.readdir)
const copyFileAsync = util.promisify(fs.copyFile)
const rmAsync = util.promisify(fs.rm)
const mkdirAsync = util.promisify(fs.mkdir)
const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const DESTINATION = 'copy'
const EXCLUDE = [
  '.vscode',
  '*.txt',
  '.env',
  DESTINATION
]

const copy = async (destination = '', files) => {
  const total = files.length
  const dirname = process.cwd()

  try {
    for (let i = 0; i < files.length; i++) {
      const currFile = files[i]
      const filePathArray = currFile.split(path.sep)
      const isRecursiveFile = filePathArray.length > 1

      if (isRecursiveFile) {
        const recursiveDirectory = filePathArray.slice(0, -1).join(path.sep)
        await fs.mkdirAsync(path.join(dirname, destination, recursiveDirectory), {
          recursive: true
        })
      }

      await copyFileAsync(currFile, path.join(dirname, destination, currFile))

      const percentage = Math.floor(((i + 1) / total) * 100)
      process.stdout.write(`\rCopied ${i + 1}/${total} files. Completed: ${percentage}%`)
    }
  } catch (error) {
    console.log(error)
  }
}

const getFiles = async (dir = '', paths = new Set()) => {
  try {
    const dirname = process.cwd()
    const currDir = path.join(dirname, dir)
    const files = await readdirAsync(currDir)

    for (let i = 0; i < files.length; i++) {
      const currFile = files[i]

      const isExcluded = EXCLUDE.find(blob => {
        return minimatch(currFile, blob, {
          dot: true
        })
      })

      if (isExcluded) {
        continue
      }

      const currFileDirectory = path.join(dir, currFile)
      const stat = await fs.lstatAsync(currFileDirectory)

      if (stat.isDirectory()) {
        const directoryPaths = await getFiles(path.join(dir, currFile), paths)
        directoryPaths.forEach(path => paths.add(path))
        continue
      }

      if (stat.isFile()) {
        paths.add(currFileDirectory)
        process.stdout.write(`\rRead ${paths.size} files in ${dirname}`)
      }
    }

    return Array.from(paths)
  } catch (error) {
    console.log(error)
  }
}

const createDestFolder = async () => {
  const dirname = process.cwd()

  const dest = path.join(dirname, DESTINATION)

  await rmAsync(dest, { recursive: true, force: true })

  await sleep(1000)

  await mkdirAsync(dest)
};

(async function () {
  const files = await getFiles()
  await createDestFolder()
  await copy(DESTINATION, files)
})()