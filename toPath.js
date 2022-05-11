/**
Usage:
const obj = {
  eslint: '^7.32.0',
  'eslint-config-standard': '^16.0.2',
  'eslint-plugin-import': '^2.20.1',
  'eslint-plugin-node': '^11.1.0',
  'eslint-plugin-promise': '^4.2.1',
  'eslint-plugin-standard': '4.0.1'
}

toPaths(obj)

[
  { path: 'eslint', type: 'string' },
  { path: 'eslint-config-standard', type: 'string' },
  { path: 'eslint-plugin-import', type: 'string' },
  { path: 'eslint-plugin-node', type: 'string' },
  { path: 'eslint-plugin-promise', type: 'string' },
  { path: 'eslint-plugin-standard', type: 'string' }
]

*/

// libs
const _last = require('lodash/last')
const _upperFirst = require('lodash/upperFirst')

// helpers
const isArray = hit => Array.isArray(hit)
const isObject = hit => !isArray(hit) && typeof hit === 'object'
const isNonIterable = hit => !isArray(hit) && !isObject(hit)
const isBoolean = hit => typeof hit === 'boolean'
const isNumber = hit => typeof hit === 'number' || (!isNaN(Number(hit)) && !isBoolean(hit))
const isString = hit => typeof hit === 'string'
const isDate = hit => new Date(hit).toString() !== 'Invalid Date'

const getType = payload => {
  if (isArray(payload)) {
    return 'array'
  }

  if (isObject(payload)) {
    return 'object'
  }

  if (isNumber(payload)) {
    return 'number'
  }

  if (isDate(payload)) {
    return 'date'
  }

  if (isString(payload)) {
    return 'string'
  }

  if (isBoolean(payload)) {
    return 'boolean'
  }

  if (isBoolean(payload)) {
    return 'boolean'
  }
}

const toPaths = (payload, { prefix, store = [] }) => {
  const logger = (payload, prefix) => store.push({ path: prefix, type: getType(payload) })

  if (isArray(payload)) {
    if (prefix) logger(payload, prefix)

    toPaths({ payload: payload[0], prefix: `${prefix}[i]`, store })
    return store
  }

  if (isObject(payload)) {
    if (prefix) logger(payload, prefix)

    for (const key in payload) {
      const currData = payload[key]
      const currPrefix = prefix ? `${prefix}.${key}` : key

      isNonIterable(currData)
        ? logger(currData, currPrefix)
        : toPaths({ payload: currData, prefix: currPrefix, store })
    }

    return store
  }

  return store
}

module.exports = toPaths