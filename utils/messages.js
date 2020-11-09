const moment = require("moment")

const formatMessage = (user, text, avatarUrl="") => (
    {
        user,
        text,
        avatarUrl,
        time: moment().format("hh:mm a")
    }
)

module.exports = formatMessage