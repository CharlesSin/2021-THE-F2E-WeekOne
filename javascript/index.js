function filterHavePicture(data, min = 0) {
  return data.filter((item) => Object.keys(item.Picture).length > min);
}

const idMapping = {
  "featured-activities": "ActivityID",
  "attractions-around": "ScenicSpotID",
  "explore-gourmet": "RestaurantID",
};

async function excitingActivitiesOnInit() {
  const limit = 50;
  const address = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$top=${limit}&$format=JSON`;
  const data = await GetApiResponse(address);
  const result = filterHavePicture(data);

  let contentBox = document.getElementById("exciting-activities-contents");
  contentBox.innerHTML = "";
  result.length = 4;
  result.forEach((item) => {
    const { Description, Location, Name, Picture, StartTime, EndTime, ID } = item;
    const { PictureUrl1, PictureDescription1 } = Picture;

    let card = dynamicCreateElement("div", "horizontal-card");

    // Card Image
    let cardImg = dynamicCreateElement("div", "horizontal-card-image");
    let img = dynamicCreateImgElement(PictureUrl1, PictureDescription1);
    cardImg.appendChild(img);

    // Card Info
    let cardInfo = dynamicCreateElement("div", "horizontal-card-info");
    // Info Title
    let infoTitle = dynamicCreateTextElement("div", "horizontal-card-info-title", Name);
    // Info Time
    let infoTimeWrapper = dynamicCreateElement("div", "horizontal-card-info-time");
    let infoTimeTitle = dynamicCreateTextElement("span", "horizontal-card-info-time-title", "時間");
    let infoTimeValue = dynamicCreateTextElement(
      "span",
      "horizontal-card-info-time-value",
      `${new Date(StartTime).toISOString().slice(0, 10).replace(/-/g, "/")} - ${new Date(EndTime).toISOString().slice(0, 10).replace(/-/g, "/")}`
    );
    infoTimeWrapper.appendChild(infoTimeTitle);
    infoTimeWrapper.appendChild(infoTimeValue);

    // Info Location
    let infoLocationWrapper = dynamicCreateElement("div", "horizontal-card-info-location");
    let infoLocationTitle = dynamicCreateTextElement("span", "horizontal-card-info-location-title", "地點");
    let infoLocationValue = dynamicCreateTextElement("span", "horizontal-card-info-location-value", `${Location}`);
    infoLocationWrapper.appendChild(infoLocationTitle);
    infoLocationWrapper.appendChild(infoLocationValue);

    // Info Description
    let infoDescription = dynamicCreateTextElement("p", "horizontal-card-info-paragraph", `${Description}`);

    // Info Footer Button
    let cardFooterWrapper = dynamicCreateElement("div", "horizontal-card-info-footer");
    let moreInfoButton = dynamicCreateButtonElement(
      "a",
      "horizontal-card-info-footer-text",
      "活動詳情",
      `./attractions_content.html?id=${item[idMapping["featured-activities"]]}&name=featured-activities`
    );
    cardFooterWrapper.appendChild(moreInfoButton);

    // Append All Info Child
    cardInfo.appendChild(infoTitle);
    cardInfo.appendChild(infoTimeWrapper);
    cardInfo.appendChild(infoLocationWrapper);
    cardInfo.appendChild(infoDescription);
    cardInfo.appendChild(cardFooterWrapper);

    // Append All Child
    card.appendChild(cardImg);
    card.appendChild(cardInfo);
    contentBox.appendChild(card);
  });
}

async function popularDestinationOnInit() {
  const limit = 50;
  const address = `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=${limit}&$format=JSON`;
  const data = await GetApiResponse(address);
  const result = filterHavePicture(data);

  let contentBox = document.getElementById("popular-destination-contents");
  contentBox.innerHTML = "";
  result.length = 4;
  result.forEach((item) => {
    const { Address, Name, Picture, ID } = item;
    const { PictureUrl1, PictureDescription1 } = Picture;

    let card = dynamicCreateElement("a", "vertical-card");

    card.setAttribute("href", `/attractions_content.html?id=${item[idMapping["attractions-around"]]}&name=attractions-around`);

    // Card Image
    let cardImg = dynamicCreateElement("div", "vertical-card-images");
    let img = dynamicCreateImgElement(PictureUrl1, PictureDescription1);
    cardImg.appendChild(img);

    // Card Info
    let cardInfo = dynamicCreateElement("div", "vertical-card-info");
    // Info Title
    let infoTitle = dynamicCreateTextElement("div", "vertical-card-info-title", Name);

    // Info Location
    let infoAddressWrapper = dynamicCreateElement("div", "vertical-card-info-location");
    let infoAddressIcon = dynamicCreateIconElement("icon-location");
    let infoAddressValue = dynamicCreateTextElement("span", "vertical-card-info-location-text", `${Address}`);
    infoAddressWrapper.appendChild(infoAddressIcon);
    infoAddressWrapper.appendChild(infoAddressValue);

    // Append All Info Child
    cardInfo.appendChild(infoTitle);
    cardInfo.appendChild(infoAddressWrapper);

    // Append All Child
    card.appendChild(cardImg);
    card.appendChild(cardInfo);
    contentBox.appendChild(card);
  });
}

async function recommendedFoodOnInit() {
  const limit = 50;
  const address = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=${limit}&$format=JSON`;
  const data = await GetApiResponse(address);
  const result = filterHavePicture(data);

  let contentBox = document.getElementById("recommended-food-contents");
  contentBox.innerHTML = "";
  result.length = 4;
  result.forEach((item) => {
    const { Address, Name, Picture, ID } = item;
    const { PictureUrl1, PictureDescription1 } = Picture;

    let card = dynamicCreateElement("a", "vertical-card");

    card.setAttribute("href", `/attractions_content.html?id=${item[idMapping["explore-gourmet"]]}&name=explore-gourmet`);

    // Card Image
    let cardImg = dynamicCreateElement("div", "vertical-card-images");
    let img = dynamicCreateImgElement(PictureUrl1, PictureDescription1);
    cardImg.appendChild(img);

    // Card Info
    let cardInfo = dynamicCreateElement("div", "vertical-card-info");
    // Info Title
    let infoTitle = dynamicCreateTextElement("div", "vertical-card-info-title", Name);

    // Info Location
    let infoAddressWrapper = dynamicCreateElement("div", "vertical-card-info-location");
    let infoAddressIcon = dynamicCreateIconElement("icon-location");
    let infoAddressValue = dynamicCreateTextElement("span", "vertical-card-info-location-text", `${Address}`);
    infoAddressWrapper.appendChild(infoAddressIcon);
    infoAddressWrapper.appendChild(infoAddressValue);

    // Append All Info Child
    cardInfo.appendChild(infoTitle);
    cardInfo.appendChild(infoAddressWrapper);

    // Append All Child
    card.appendChild(cardImg);
    card.appendChild(cardInfo);
    contentBox.appendChild(card);
  });
}

excitingActivitiesOnInit();
popularDestinationOnInit();
recommendedFoodOnInit();
