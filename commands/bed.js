const bed = require('../data/bed.json')

const cache = new Map()

exports.hasRequested = (userId) => {
  return cache.has(userId)
}

exports.request = (userId) => {
  !this.hasRequested(userId) && cache.set(userId, new Date())
}

exports.find = (userId, province) => {
  cache.delete(userId)
  return bed[province]
}

exports.hasData = (province) => {
  return typeof bed[province] !== 'undefined'
}