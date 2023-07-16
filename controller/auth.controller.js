const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const refreshToken = async (uid,request)=>{
  const endpoint = request.get('origin') || "http://"+request.get('host');
  const option = {
    body: uid,
    endpoint: endpoint,
    originalUrl: request.originalUrl,
    iss: endpoint+request.originalUrl
  }
  const expiresIn = 86400;

  const newToken = await tokenService.createCustomToken(option,expiresIn);

  const updateMe = {
    token: newToken,
    expiresIn: 86400,
    updatedAt: Date.now()
  }

  await dbService.updateByQuery(uid,'user',updateMe);
  return newToken;
}

const checkUserLog = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const query = {
      token: request.cookies.authToken,
      isLogged: true
    };
    const userData = await dbService.getRecordByQuery(query,'user');
    if(userData.length > 0)
    {
      const newToken = await refreshToken(tokenData.data,request);
      response.cookie("authToken",newToken,{maxAge:(86400*1000)});
      return true;
    }
  }
  else{
    return false;
  }
}

const logout = async (request,response)=>{
  const tokenData = await tokenService.verifyToken(request);
  if(tokenData.isVerified)
  {
    const query = {
      token: request.cookies.authToken
    }
    const updateMe = {
      isLogged: false,
      updatedAt: Date.now()
    }

    const userRes = await dbService.updateByQuery(query,'user',updateMe);
    if(userRes.nModified)
    {
      await response.clearCookie("authToken");
      response.redirect("/");
    }
    else {
      response.redirect("/profile");
    }
  }
  else{
    response.status(401);
    response.json({
      message: "Permission denied"
    });
  }
}

module.exports = {
  checkUserLog: checkUserLog,
  logout: logout
}
