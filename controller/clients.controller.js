const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const create = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const data = request.body;
    data['companyId'] = tokenData.data.uid;
    try {
        const dataRes = await dbService.createRecord(data,'client');
        response.status(200);
        response.json({
          message: "Record created",
          data: dataRes
        });
    }
    catch(error)
    {
      response.status(409);
      response.json({
        message: "Record not created",
        error: error
      });
    }

  }
  else {
    response.status(401);
    response.json({
      message: "Permission denied"
    });
  }
}

const countClients = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const dataRes = await dbService.countData('client');
    response.status(200);
    response.json({
      data: dataRes
    })
  }
  else {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

const paginate = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    let from = Number(request.params.from);
    let to = Number(request.params.to);
    const query = {
      companyId: tokenData.data.uid
    };
    const dataRes = await dbService.paginate(query,from,to,'client');
    response.status(200);
    response.json({
      data: dataRes
    });
  }
  else  {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

const allClients = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const query = {
      companyId: request.params.companyId
    };
    const dataRes = await dbService.getRecordByQuery(query,'client');
    response.status(200);
    response.json({
      data: dataRes
    });
  }
  else  {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

const deleteClients = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const id = request.params.id;
    const deleteRes = await dbService.deleteById(id,'client');
    response.status(200);
    response.json({
      data: deleteRes
    });
  }
  else  {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

const updateClients = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const id = request.params.id;
    const data = request.body;
    const updateRes = await dbService.updateById(id,data,'client');
    response.status(201);
    response.json({
      data: updateRes
    });
  }
  else  {
    response.status(401);
    response.json({
      message: "permission denied !"
    });
  }
}

const invitation = async (request,response)=>{
  const token = request.params.clientToken;
  const tokenData = await tokenService.customTokenVerification(token);
  if(tokenData.isVerified)
  {
    const clientId = tokenData.data.clientId;
    const client = await getClientInfo(clientId);
    if(!client.isUser)
    {
      response.render("invitation");
    }
    else {
      response.redirect("/");
    }
  }
  else {
    response.status(401);
    response.redirect("/");
  }
}

const getClientInfo = async (id)=>{
  const query = {
    _id: id
  }
  const dataRes = await dbService.getRecordByQuery(query,'client');
  return dataRes[0];
}

const createUser = async (request,response)=>{
  const query = {
    _id: request.params.id
  }
  const updateMe = {
    updatedAt: Date.now(),
    isUser: true
  }
  await dbService.updateByQuery(query,'client',updateMe);

  const userData = {
    uid: request.params.id,
    password: request.body.password,
    role: "client"
  }

  await dbService.createRecord(userData,'user');

  response.status(200);
  response.json({message:"success"});
}

const getClientsId = async (request,response)=>{
  const token = tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const query = {
      clientEmail: token.data.email
    }
    const companyRes = await dbService.getRecordByQuery(query,'client');
    if(companyRes.length > 0)
    {
      response.status(200);
      response.json({
        isCompanyExist: true,
        message: "Company available",
        data: companyRes
      })
    }
    else{
      response.status(404);
      response.json({
        isCompanyExist: false,
        message: "Company not found"
      })
    }
  }
  else{
    response.status(401);
    response.json({
      message: "Permission denied"
    })
  }
}

module.exports = {
  create: create,
  countClients: countClients,
  paginate: paginate,
  deleteClients: deleteClients,
  updateClients: updateClients,
  allClients: allClients,
  invitation: invitation,
  createUser: createUser,
  getClientsId: getClientsId
}
