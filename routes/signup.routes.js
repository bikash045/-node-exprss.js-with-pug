const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");

router.post("/",async (request,response)=>{
    const expiresIn = 120;
    const token = await tokenService.createToken(request,expiresIn);

    // requesting company api
    const companyRes = await httpService.postRequest({
      endpoint: request.get('origin'),
      api: "/api/private/company",
      data: token
    });

    // requesting user api
    if(companyRes.body.isCompanyCreated)
    {
      const newUser = {
        body: {
          uid: companyRes.body.data._id,
          password: request.body.password,
          companyInfo: companyRes.body.data
        },
        endpoint: request.get('origin'),
        originalUrl: request.originalUrl,
        iss: request.get('origin')+request.originalUrl,
      }

      const userToken = await tokenService.createCustomToken(newUser,expiresIn);

      const userRes = await httpService.postRequest({
        endpoint: request.get('origin'),
        api: "/api/private/user",
        data: userToken
      });

      // return user response
      response.cookie("authToken",userRes.body.token,{maxAge:(86400*1000)});
      response.status(userRes.status);
      response.json(userRes.body);
    }
    else{
      response.status(companyRes.status);
      response.json(companyRes);
    }
});

module.exports = router;
