const tokenService = require("../services/token.service");

const getToken = async (request,response)=>{
  const expiresIn = request.params.expires;
  const data = JSON.parse(request.body.data);

  const endpoint = request.get('origin') || "http://"+request.get('host');
  const option = {
    body: data,
    endpoint: endpoint,
    originalUrl: request.originalUrl,
    iss: endpoint+"/get-token"
  }
  const newToken = await tokenService.createCustomToken(option,expiresIn);

  response.status(200);
  response.json({
    token: newToken
  });
}

module.exports = {
  getToken: getToken
}
