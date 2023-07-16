const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

router.get("/",(request,response)=>{
  authController.logout(request,response);
});

module.exports = router;
