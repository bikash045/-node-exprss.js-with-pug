const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const createCompany = async (request,response)=>{
  const token = tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const data = token.data;
    // now you can store the data
    try{
      const dataRes = await dbService.createRecord(data,'company');
      response.status(200);
      response.json({
        isCompanyCreated: true,
        message: "Company created !",
        data: dataRes
      });
    }
    catch(error)
    {
      response.status(409);
      response.json({
        isCompanyCreated: false,
        message: error,
      });
    }

  }
  else{
    response.status(401);
    response.json({
      message: "Permission denied"
    });
  }
}

const getCompanyId = async (request,response)=>{
  const token = tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const query = {
      email: token.data.email
    }
    const companyRes = await dbService.getRecordByQuery(query,'company');
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

const updateCompanyData = async (request,response)=>{
  const token = tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const id = request.params.id;
    const data = request.body;
    try {
          const dataRes = await dbService.updateById(id,data,'company');
          const newToken = await refreshToken(request,id,dataRes);
          response.cookie("authToken",newToken,{maxAge:(86400*1000)});
          response.status(201);
          response.json({
            message: "Update success",
            data: dataRes
          });
    }
    catch(err)
    {
      response.status(424);
      response.json({
        message: "Update failed"
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

const refreshToken = async (request,id,dataRes)=>{
  const data = {
    uid: id,
    companyInfo: dataRes
  }

  const query = {
    uid: id
  }

  const endpoint = request.get('origin') || "http://"+request.get('host');
  const option = {
    body: data,
    endpoint: endpoint,
    originalUrl: request.originalUrl,
    iss: endpoint+"/api/private/company"
  }
  const expiresIn = 86400;

  const newToken = await tokenService.createCustomToken(option,expiresIn);

  const updateMe = {
    token: newToken,
    expiresIn: 86400,
    updatedAt: Date.now()
  }

  await dbService.updateByQuery(query,'user',updateMe);
  return newToken;
}

module.exports = {
  createCompany: createCompany,
  getCompanyId: getCompanyId,
  updateCompanyData: updateCompanyData
}
