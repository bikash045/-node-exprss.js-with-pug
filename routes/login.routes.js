const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");
const bcryptService = require("../services/bcrypt.service");

router.post("/",async (request,response)=>{
  const loginAs = request.body.loginAs;
  if(loginAs == "admin")
  {
    adminLogger(request,response);
  }
  if(loginAs == "client")
  {
    clientLogger(request,response);
  }
  if(loginAs == "team")
  {
    teamLogger(request,response);
  }
});

const adminLogger = async (request,response)=>{
  const expiresIn = 120;
  const token = await tokenService.createToken(request,expiresIn);

  // getting user id
  const companyRes = await httpService.getRequest({
    endpoint: request.get('origin'),
    api: '/api/private/company',
    data: token
  });
  if(companyRes.body.isCompanyExist)
  {
    const query = {
      body: {
        uid: companyRes.body.data[0]._id,
        companyInfo: companyRes.body.data[0]
      },
      endpoint: request.get('origin'),
      api: "/api/private/user",
      iss: request.get('origin')+request.originalUrl
    }

    const uidToken = await tokenService.createCustomToken(query,expiresIn);

    const passwordRes = await httpService.getRequest({
      endpoint: request.get('origin'),
      api: '/api/private/user',
      data: uidToken
    });

    // update role in authToken
    const role = passwordRes.body.data[0].role;
    query.body['role'] = role;

    // getting user password
    if(passwordRes.body.isCompanyExist)
    {
      // allow single device login
      /*
      if(passwordRes.body.data[0].isLogged)
      {
        response.status(406);
        response.json({
          message: "Please logout from other device"
        });
        return false;
      }
      */


      const realPassword = passwordRes.body.data[0].password;
      const isLogged = await bcryptService.decrypt(realPassword,request.body.password);
      if(isLogged)
      {
        const secondsInOneDay = 86400; // 1 day
        const authToken = await tokenService.createCustomToken(query,secondsInOneDay);
        // update token in database
        const dbToken = await httpService.putRequest({
          endpoint: request.get('origin'),
          api: '/api/private/user',
          data: authToken
        });

        response.cookie("authToken",authToken,{maxAge:(secondsInOneDay*1000)});

        response.status(200);
        response.json({
          role: "admin",
          isLogged: true,
          message: "Success"
        });
      }
      else{
        response.status(401);
        response.json({
          isLogged: false,
          message: "Wrong password"
        });
      }
    }
    else{
      response.status(passwordRes.status);
      response.json(passwordRes.body);
    }
  }
  else{
    response.status(companyRes.status);
    response.json(companyRes.body);
  }
}

const clientLogger = async (request,response)=>{
  const expiresIn = 120;
  const token = await tokenService.createToken(request,expiresIn);

  // getting user id
  const companyRes = await httpService.getRequest({
    endpoint: request.get('origin'),
    api: '/clients/login',
    data: token
  });
  if(companyRes.body.isCompanyExist)
  {
    const query = {
      body: {
        uid: companyRes.body.data[0]._id,
        clientInfo: companyRes.body.data[0]
      },
      endpoint: request.get('origin'),
      api: "/api/private/user",
      iss: request.get('origin')+request.originalUrl
    }

    const uidToken = await tokenService.createCustomToken(query,expiresIn);

    const passwordRes = await httpService.getRequest({
      endpoint: request.get('origin'),
      api: '/api/private/user',
      data: uidToken
    });

    // update role in authToken
    const role = passwordRes.body.data[0].role;
    query.body['role'] = role;

    // getting user password
    if(passwordRes.body.isCompanyExist)
    {
      // allow single device login
      /*
      if(passwordRes.body.data[0].isLogged)
      {
        response.status(406);
        response.json({
          message: "Please logout from other device"
        });
        return false;
      }
      */


      const realPassword = passwordRes.body.data[0].password;
      const isLogged = await bcryptService.decrypt(realPassword,request.body.password);
      if(isLogged)
      {
        const secondsInOneDay = 86400; // 1 day
        const authToken = await tokenService.createCustomToken(query,secondsInOneDay);
        // update token in database
        const dbToken = await httpService.putRequest({
          endpoint: request.get('origin'),
          api: '/api/private/user',
          data: authToken
        });

        response.cookie("authToken",authToken,{maxAge:(secondsInOneDay*1000)});

        response.status(200);
        response.json({
          role: "client",
          isLogged: true,
          message: "Success"
        });
      }
      else{
        response.status(401);
        response.json({
          isLogged: false,
          message: "Wrong password"
        });
      }
    }
    else{
      response.status(passwordRes.status);
      response.json(passwordRes.body);
    }
  }
  else{
    response.status(companyRes.status);
    response.json(companyRes.body);
  }
}

const teamLogger = async (request,response)=>{
  const expiresIn = 120;
  const token = await tokenService.createToken(request,expiresIn);

  // getting user id
  const companyRes = await httpService.getRequest({
    endpoint: request.get('origin'),
    api: '/api/private/company',
    data: token
  });
  if(companyRes.body.isCompanyExist)
  {
    const query = {
      body: {
        uid: companyRes.body.data[0]._id,
        teamInfo: companyRes.body.data[0]
      },
      endpoint: request.get('origin'),
      api: "/api/private/user",
      iss: request.get('origin')+request.originalUrl
    }

    const uidToken = await tokenService.createCustomToken(query,expiresIn);

    const passwordRes = await httpService.getRequest({
      endpoint: request.get('origin'),
      api: '/api/private/user',
      data: uidToken
    });

    // update role in authToken
    const role = passwordRes.body.data[0].role;
    query.body['role'] = role;

    // getting user password
    if(passwordRes.body.isCompanyExist)
    {
      // allow single device login
      /*
      if(passwordRes.body.data[0].isLogged)
      {
        response.status(406);
        response.json({
          message: "Please logout from other device"
        });
        return false;
      }
      */


      const realPassword = passwordRes.body.data[0].password;
      const isLogged = await bcryptService.decrypt(realPassword,request.body.password);
      if(isLogged)
      {
        const secondsInOneDay = 86400; // 1 day
        const authToken = await tokenService.createCustomToken(query,secondsInOneDay);
        // update token in database
        const dbToken = await httpService.putRequest({
          endpoint: request.get('origin'),
          api: '/api/private/user',
          data: authToken
        });

        response.cookie("authToken",authToken,{maxAge:(secondsInOneDay*1000)});

        response.status(200);
        response.json({
          role: "team",
          isLogged: true,
          message: "Success"
        });
      }
      else{
        response.status(401);
        response.json({
          isLogged: false,
          message: "Wrong password"
        });
      }
    }
    else{
      response.status(passwordRes.status);
      response.json(passwordRes.body);
    }
  }
  else{
    response.status(companyRes.status);
    response.json(companyRes.body);
  }
}

module.exports = router;
