/**
Usage:
const const result = pipe(this.resultStats, [
  val => Object.entries(val),
  val => val.sort((a, b) => b[1] - a[1]),
  val => val.slice(0, 5)
])
*/

const pipe = (initial, fns) => fns.reduce((v, f) => f(v), initial)