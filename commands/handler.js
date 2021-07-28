const BedCommand    = require('./bed')
const CaseCommand   = require('./case')

const commands = ['หาเตียง', 'สถิติ']

exports.isInterrupt = (input, currentCommand) => {
  return commands
    .filter(command => command != currentCommand)
    .includes(input)
}

exports.handle = async (event) => {
  const userId = event.source.userId
  const message = event.message.text
  const replyToken = event.replyToken

  const response = await Promise.all([
    BedCommand.handle(userId, message, replyToken),
    CaseCommand.handle(userId, message, replyToken)
  ])

  return response
}