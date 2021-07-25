// TODO: refactor like bed.js

// THIS COMMAND HAS DISABLED

const fetch = require('node-fetch')

const cache = new Map()

exports.hasRequested = (userId) => {
  return cache.has(userId)
}

exports.request = (userId) => {
  !this.hasRequested(userId) && cache.set(userId, new Date())
}

exports.find = async (province) => {
  const result = await fetch('https://covid-lab-data.pages.dev/latest.json')
    .then(response => response.json())

  return result.items
    .filter(item => item.p == province && !item.ic)
    .map(item => ({
      name: item.n,
      address: item.adr,
      type: (item.pp == 'pu') ? 'รัฐบาล' : 'เอกชน',
      tel: item.mob,
      line: item.line,
      note: item.rm
    }))
}

exports.format = (data) => {
  return data.map(item => {
    const name = `${item.name} (${item.type})`
    //const address = `ที่อยู่: ${item.address}`
    
    const tel = item.tel && `ติดต่อ: ${item.tel}`
    const lineId = item.line && `line: ${item.line}`
    const note = item.note

    const other = [tel, lineId, note].filter(Boolean).join('\n')
    let result = `${name}\n`

    if (other) result = result.concat(other)

    return result.concat('\n')
  })
}