const fetch = require('node-fetch')

exports.getLatestCase = async() => {
  const reportedCases = await fetch('https://raw.githubusercontent.com/wiki/djay/covidthailand/situation_reports')
    .then(response => response.json())

  const briefCases = await fetch('https://raw.githubusercontent.com/wiki/djay/covidthailand/cases_briefings')
    .then(response => response.json())

  const latestReport = reportedCases.slice(-1).pop()
  const latestDate = latestReport['Date']
  const latestBrief = briefCases.slice(-3).find((data) => data['Date'] == latestDate)
  
  return {
    date: latestDate,
    cases: latestReport.Cases,
    tested: latestReport.Tested,
    deaths: latestBrief.Deaths,
    hospitalized: latestBrief.Hospitalized,
    recovered: latestBrief.Recovered
  }
}