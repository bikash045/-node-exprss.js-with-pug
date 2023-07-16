require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const issService = require("./iss.service");

const create = async (request,expiresIn)=>{
    const formdata = request.body;
    const endpoint = request.get('origin');
    const api = request.originalUrl;
    const iss = endpoint+api;
    const token = await jwt.sign({
      iss: iss,
      data: formdata
    },secretKey,{expiresIn:expiresIn});
    return token;
}

const createCustom = async (data,expiresIn)=>{
    const formdata = data.body;
    const endpoint = data.endpoint;
    const api = data.originalUrl;
    const iss = data.iss;
    const token = await jwt.sign({
      iss: iss,
      data: formdata
    },secretKey,{expiresIn:expiresIn});
    return token;
}

const verify = (request)=>{
  let token = "";
  if(request.method == "GET")
  {
    if(request.headers['x-auth-token'])
    {
      token = request.headers['x-auth-token'];
    }
    else{
      if(request.originalUrl.indexOf("/clients/invitation") != -1)
      {
        let tmp = request.originalUrl.split("/");
        token = tmp[3];
      }
      else {
          token = request.cookies.authToken;
      }
    }
  }
  else{
      token = request.body.token;
  }

  if(token)
  {
    try
    {
      const tmp = jwt.verify(token,secretKey);
      const requestCommingFrom = tmp.iss;

      if(issService.indexOf(requestCommingFrom) != -1)
      {
        return {
          isVerified: true,
          data: tmp.data
        };
      }
      else{
        return {
          isVerified: false,
        };
      }
    }
    catch(error)
    {
      return {
        isVerified: false,
      };
    }

  }
  else{
    return {
      isVerified: false,
    };
  }
}

const customTokenVerification = (token)=>{
  try
  {
    const tmp = jwt.verify(token,secretKey);
    const requestCommingFrom = tmp.iss;

    if(issService.indexOf(requestCommingFrom) != -1)
    {
      return {
        isVerified: true,
        data: tmp.data
      };
    }
    else{
      return {
        isVerified: false,
      };
    }
  }
  catch(error)
  {
    return {
      isVerified: false,
    };
  }
}

module.exports = {
  createToken: create,
  verifyToken: verify,
  createCustomToken: createCustom,
  customTokenVerification: customTokenVerification
}
