const provinces = require('../data/provinces.json')
const cache = new Map()

// Levenshtein distance algorithm
// Thanks to https://stackoverflow.com/a/36566052
const similarity = (s1, s2) => {
  let longer = s1
  let shorter = s2

  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }

  const longerLength = longer.length
  if (longerLength == 0) return 1.0

  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

// Thanks to https://stackoverflow.com/a/36566052
const editDistance = (s1, s2) => {
  const costs = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) {
        costs[j] = j
      } else {
        if (j > 0) {
          let newValue = costs[j - 1]
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

exports.find = (input) => {
  if (cache.has(input)) return cache.get(input)

  const predictedResult = provinces.locale_th
      .map(item => ({ name: item, predict: similarity(input, item)}))
      .sort((a, b) => b.predict - a.predict)[0].name

  cache.set(input, predictedResult)
  return predictedResult
}
