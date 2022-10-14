function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = "32968f042b9745b1adce225d0323fce5";
  let AppKey = "aHOiZIzaSBsu32XyIR0X213z9zM";

  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  let HMAC = ShaObj.getHMAC("B64");
  let Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, "X-Date": GMTString };
}

function dataQuery(address) {
  const header = getAuthorizationHeader();
  const url = address;
  return fetch(url, {
    cache: "no-cache",
    headers: header,
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      return myJson;
    })
    .catch((err) => {
      console.error(err);
    });
}

function filterHavePicture(data, min = 0) {
  return data.filter((item) => Object.keys(item.Picture).length > min);
}

function GetAuthorizationHeader() {
  const parameter = {
    grant_type: "client_credentials",
    client_id: PRIVATE_CLIENT_ID,
    client_secret: PRIVATE_CLIENT_SECRET,
  };

  let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

  return $.ajax({
    type: "POST",
    url: auth_url,
    crossDomain: true,
    dataType: "JSON",
    data: parameter,
    async: false,
    success: function (data) {
      return JSON.stringify(data.access_token);
    },
    error: function (xhr, textStatus, thrownError) {
      return "error";
    },
  });
}

function GetApiResponse(address) {
  let access_token = GetAuthorizationHeader();
  let { responseJSON } = access_token;

  let accesstoken = responseJSON.access_token;

  if (accesstoken != undefined) {
    return $.ajax({
      type: "GET",
      url: address,
      headers: {
        authorization: "Bearer " + accesstoken,
      },
      async: false,
      success: function (Data) {
        // console.log("Data", Data);
        return Data;
      },
      error: function (xhr, textStatus, thrownError) {
        console.log("errorStatus:", textStatus);
        console.log("Error:", thrownError);
      },
    });
  }
}