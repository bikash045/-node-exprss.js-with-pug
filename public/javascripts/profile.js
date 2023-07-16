// load access
$(document).ready(async function(){
  const request = {
    type: "GET",
    url: "/access"
  }
  const response = await ajax(request);
  showToolbar(response.data.toolbar);
});

function showToolbar(toolbar) {
  for(let menu of toolbar)
  {
    let li = `
      <li class="nav-item">
        <button class="btn toolbar ml-3 p-0 ${menu.design}">
          <a href="${menu.link}" class="${menu.design}">
            <i class="${menu.icon}"></i>
          </a>
        </button>
      </li>
    `;
    $("#toolbar").append(li);
  }
}

// admin layout control
$(document).ready(function(){
  $(".toggler").click(function(){
    const state = $(".sidenav").hasClass("sidenav-open");
    if(state)
    {
      $(".sidenav").removeClass("sidenav-open");
      $(".sidenav").addClass("sidenav-close");

      // section control
      $(".section").removeClass("section-open");
      $(".section").addClass("section-close");
    }
    else {
      $(".sidenav").removeClass("sidenav-close");
      $(".sidenav").addClass("sidenav-open");

      // section control
      $(".section").removeClass("section-close");
      $(".section").addClass("section-open");
    }
  });
});

// show company info
$(document).ready(function(){
  const token = getCookie("authToken");
  let company = decodeToken(token).data.companyInfo;
  $(".company-name").html(company.company_name);
  $(".company-email").html(company.email);
  $(".company-mobile").html(company.mobile);
  if(company.isLogo)
  {
    $(".logo-box").html("");
    $(".logo-box").css({
      background: `url(${company.logoUrl})`,
      backgroundSize: "cover"
    });
  }
});

// upload logo
$(document).ready(function(){
  $(".logo-box").click(function(){
    const ext = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "Image/*";
    input.click();

    input.onchange = async function(){
      const file = input.files[0];
      const imageUrl = URL.createObjectURL(file);
      // show uploader
      $(".file-name").html(file.name);
      $(".uploader").removeClass("d-none");
      $(".uploader").addClass("animate__animated animate__slideInLeft");
      $(".uploader").toast('show');
      if(ext.indexOf(file.type) != -1)
      {
        const objectUrl = await uploadFileOnS3(file);
        $(".logo-box").html("Wait..");
        const isUpdated = await updateLogoUrl(objectUrl);
        if(isUpdated)
        {
          $(".logo-box").html("");
          $(".logo-box").css({
            background: `url(${imageUrl})`,
            backgroundSize: "cover"
          });
        }
        else {
          alert("Unable to upload logo please try again later !");
        }
      }
      else {
        alert("Upload a valid file");
      }
    }
  });
});

async function updateLogoUrl(url) {
  const token = getCookie("authToken");
  const company = decodeToken(token);
  let id = company.data.uid;

  const formdata = new FormData();
  formdata.append("isLogo",true);
  formdata.append("logoUrl",url);
  formdata.append("token",token);

  const request = {
    type: "PUT",
    url: "/api/private/company/"+id,
    data: formdata
  }

  try {
      await ajax(request);
      return true;
  }
  catch(err)
  {
    return false;
  }

}
