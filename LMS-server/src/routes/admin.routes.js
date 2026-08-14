let express = require("express");
const { getDasboard } = require("../controllers/admin.controller");
let router = express.Router()





router.get('/', getDasboard)







module.exports = router