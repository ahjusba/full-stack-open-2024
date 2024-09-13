const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
var morgan = require('morgan')

//POST url status responsetime person
morgan.token('person', function (req) { return JSON.stringify(req.body) })

const PORT = config.PORT || 3001
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})