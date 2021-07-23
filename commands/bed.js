const bed = require('../data/bed.json')

const cache = new Map()

exports.hasRequested = (userId) => {
  return cache.has(userId)
}

exports.request = (userId) => {
  !this.hasRequested(userId) && cache.set(userId, new Date())
}

exports.find = (userId, location) => {
  cache.delete(userId)
  return bed[location]
}