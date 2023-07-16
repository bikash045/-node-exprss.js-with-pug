// redirect user if already logged
if(document.cookie.indexOf("authToken") != -1)
{
  window.location = "/clients";
}

// requesting login modal
$(document).ready(()=>{
  $("#request-login-modal").click((e)=>{
    e.preventDefault();
    $("#signup-modal").modal('hide');
    $("#login-modal").modal('show');
  });
});

// requesting signup modal
$(document).ready(()=>{
  $("#request-signup-modal").click((e)=>{
    e.preventDefault();
    $("#login-modal").modal('hide');
    $("#signup-modal").modal('show');
  });
});

// signup request
$(document).ready(()=>{
  $("#signup-form").submit((e)=>{
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/signup",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: ()=>{
        $(".before-send").removeClass("d-none");
        $(".signup-btn").addClass("d-none");
      },
      success: (response)=>{
        $(".before-send").addClass("d-none");
        $(".signup-btn").removeClass("d-none");
        if(response.isUserCreated)
        {
          window.location = "";
        }
      },
      error: (error)=>{
        $(".before-send").addClass("d-none");
        $(".signup-btn").removeClass("d-none");

        if(error.status == 409)
        {
          const errorRes = JSON.parse(error.responseJSON.text);
          const message = errorRes.message;

          const field = "."+message.field;
          const label = message.label;
          $(field).addClass("border border-danger");
          $(field+"-error").html(label);
          setTimeout(()=>{
            resetValidator(field);
          },3000);
        }
        else {
          alert("Internal server error");
        }
      }
    });
  });
});

// enable and disable login btn
$(document).ready(function(){
  $(".login-as").each(function(){
    $(this).on("change",function(){
      $(".login-btn").prop('disabled',false);
    });
  });
});

// login request
$(document).ready(()=>{
  $("#login-form").submit((e)=>{
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/login",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: ()=>{
        $(".before-send").removeClass("d-none");
        $(".login-btn").addClass("d-none");
      },
      success: (response)=>{
          if(response.isLogged)
          {
            if(response.role == "admin")
            {
              window.location = "/clients";
            }
            else if(response.role == "client")
            {
              window.location = "/business";
            }
            else {
              // teams
            }

          }
          else{
            $(".company-password").addClass("border border-danger");
            $(".password-error").html("Wrong password !");
          }
      },
      error: (error)=>{
        $(".before-send").addClass("d-none");
        $(".login-btn").removeClass("d-none");

        if(error.status == 404)
        {
          $(".username").addClass("border border-danger");
          $(".username-error").html("User not found !");
        }
        else if(error.status == 401)
        {
          $(".company-password").addClass("border border-danger");
          $(".password-error").html("Wrong password !");
        }
        else if(error.status == 406)
        {
          $(".company-password").addClass("border border-danger");
          $(".password-error").html(error.responseJSON.message);
        }
        else{
          alert("Internal server error");
        }
      }
    });
  });
});

function resetValidator(field)
{
  $(field).removeClass("border-danger");
  $(field+"-error").html("");
}
