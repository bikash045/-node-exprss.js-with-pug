const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/",(request,response)=>{
  userController.createUser(request,response);
});

router.get("/:query",(request,response)=>{
  userController.getUserPassword(request,response);
});

router.put("/:id",(request,response)=>{
  userController.createLog(request,response);
});

module.exports = router;
