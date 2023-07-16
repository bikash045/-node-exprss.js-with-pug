const express = require("express");
const router = express.Router();
const clientController = require("../controller/clients.controller");
const routePermission = require("../middleware/route-permission.middleware");

router.get("/",routePermission,(request,response)=>{
  response.render("clients");
});

router.get("/count-all",(request,response)=>{
  clientController.countClients(request,response);
});

router.get("/login/:query",(request,response)=>{
  clientController.getClientsId(request,response);
});

router.get("/invitation/:clientToken",(request,response)=>{
  clientController.invitation(request,response);
});

router.get("/all/:companyId",(request,response)=>{
  clientController.allClients(request,response);
});

router.get("/:from/:to",(request,response)=>{
  clientController.paginate(request,response);
});

router.post("/",(request,response)=>{
  clientController.create(request,response);
});

router.post("/:id",(request,response)=>{
  clientController.createUser(request,response);
});

router.delete("/:id",(request,response)=>{
  clientController.deleteClients(request,response);
});

router.put("/:id",(request,response)=>{
  clientController.updateClients(request,response);
});

module.exports = router;
