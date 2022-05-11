/**
Sampe usage:
const items = [
  { name: 'asasdd', age: 1 },
  { name: 'asd  ', age: '1' }
]
const found = looseFind(items, {
  name: 'asd',
  age: 1
})
 */

const _trim = require('lodash/trim')

const looseFind = (arr, predicate) => {
  const predicateKeys = Object.keys(predicate)

  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i]

    const isPass = predicateKeys.every(key => {
      const predicateValue = _trim(predicate[key])
      const currValue = _trim(curr[key])

      return currValue == predicateValue
    })

    if (isPass) {
      return curr
    }
  }
}