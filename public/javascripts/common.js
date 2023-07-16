const config = {
  accessKeyId: "AKIAY7V4FA6S4B7Z2RFL",
  secretAccessKey: "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",
  region: "ap-south-1",
  params: {
    Bucket: "docs.frontwap.com"
  }
}

const s3 = new AWS.S3(config);

function ajax(request) {
  return new Promise(function(resolve,reject){
    let options = {
      type: request.type,
      url: request.url,
      beforeSend: function() {
        if(request.isLoader)
        {
          $(request.commonBtn).addClass("d-none");
          $(request.loaderBtn).removeClass("d-none");
        }
      },
      success: function(response) {
        if(request.isLoader)
        {
          $(request.commonBtn).removeClass("d-none");
          $(request.loaderBtn).addClass("d-none");
        }
        resolve(response);
      },
      error: function(error) {
        if(request.isLoader)
        {
          $(request.commonBtn).removeClass("d-none");
          $(request.loaderBtn).addClass("d-none");
        }
        reject(error);
      }
    }

    if(request.type == "POST" || request.type == "PUT")
    {
      options['data'] = request.data;
      options['processData'] = false;
      options['contentType'] = false;
    }

    if(request.type == "DELETE")
    {
      options['data'] = request.data;
    }

    $.ajax(options);
  });

}

function getCookie(cookieName){
  const allCookie = document.cookie;
  let cookies = allCookie.split(";");
  let cookieValue = "";
  for(let cookie of cookies)
  {
    let currentCookie = cookie.split("=");
    if(currentCookie[0] == cookieName)
    {
      cookieValue = currentCookie[1];
      break;
    }
  }
  return cookieValue;
}

function formatDate(dateString){
  const date = new Date(dateString);
  let dd = date.getDate();
  // insert 0 before date
  if(dd < 10)
  {
    dd = '0'+dd;
  }
  let mm = date.getMonth()+1;
  // insert 0 before month
  if(mm < 10)
  {
    mm = '0'+mm;
  }
  const yy = date.getFullYear();
  // get time
  const time = date.toLocaleTimeString();
  return dd+"-"+mm+"-"+yy+" "+time;
}

function decodeToken(token){
  let payload = token.split(".")[1];
  let string = atob(payload);
  let dataObject = JSON.parse(string);
  return dataObject;
}

async function uploadFileOnS3(file) {
  const fileInfo = {
    Key: file.name,
    Body: file,
    ACL: "public-read"
  }
  try {
      const object = await s3.upload(fileInfo)
      .on("httpUploadProgress",(progress)=>{
        let loaded = progress.loaded;
        let total = progress.total;
        let percentage = Math.floor((loaded*100)/total);
        $(".progress-width").css({width:percentage+"%"});
        $(".progress-text").html(percentage+"%");

        // calculate mb
        let totalMb = (total/1024/1024).toFixed(1);
        let loadedMb = (loaded/1024/1024).toFixed(1);
        $(".progress-in-mb").html(loadedMb+"Mb / "+totalMb+"Mb");
      })
      .promise();
      return object.Location;
  }
  catch(err)
  {
    return err;
  }

}

function ajaxDownloader(request) {
  return $.ajax({
    type: request.type,
    url: request.url,
    xhr: function(){
      const xml = new XMLHttpRequest();
      xml.responseType = "blob";
      return xml;
    }
  }).promise();
}
