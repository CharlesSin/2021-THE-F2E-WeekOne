const APIURL = {
  "featured-activities": "https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$format=JSON",
  "attractions-around": "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$format=JSON",
  "explore-gourmet": "https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$format=JSON",
  "accommodation-hotel": "https://ptx.transportdata.tw/MOTC/v2/Tourism/Hotel?$format=JSON",
};

const idMapping = {
  "featured-activities": "ActivityID",
  "attractions-around": "ScenicSpotID",
  "explore-gourmet": "RestaurantID",
  "accommodation-hotel": "HotelID",
};

async function attractions_contentOnInit() {
  const url = new URL(window.location.href);
  const pageName = url.searchParams.get("name") || "";
  const contentId = url.searchParams.get("id") || "";
  const fetchUri = APIURL[pageName];

  if (contentId === "" || pageName === "") {
    window.location.href = "/404.html";
  }

  const address = `${fetchUri}`;
  // const data = await dataQuery(address);
  const data = await GetApiResponse(address);
  const result = filterHavePicture(data);

  let contentData = result.filter((item) => item[idMapping[pageName]] == contentId);
  let recommendationsData = result.filter((item) => item.ID != contentId);
  recommendationsData.length = 3;

  locationInfoOnInit(contentData[0]);
  transportInfoOnInit(contentData[0]);
  otherRecommendationsOnInit(recommendationsData, pageName);
}

function locationInfoOnInit(contentData) {
  const { Picture } = contentData;
  const contentLocationInfo = document.getElementById("content-location-info");
  contentLocationInfo.innerHTML = "";

  let locationImg = locationInfoImgOnInit(Picture);
  let locationInfo = locationInfoScriptOnInit(contentData);

  contentLocationInfo.appendChild(locationImg);
  contentLocationInfo.appendChild(locationInfo);
}

function locationInfoImgOnInit(imgArr) {
  const { PictureUrl1, PictureDescription1, PictureUrl2, PictureDescription2, PictureUrl3, PictureDescription3 } = imgArr;
  let imageWrapper = dynamicCreateElement("div", "content-location-info-image");
  let mainImageWrapper = dynamicCreateElement("div", "content-location-info-image-main");
  let mainImage = dynamicCreateImgElement(PictureUrl1, PictureDescription1);

  let subImmageWrapper = dynamicCreateElement("div", "content-location-info-image-sub");

  let subImage1 = PictureUrl1 ? dynamicCreateImgElement(PictureUrl1, PictureDescription1) : null;
  let subImage2 = PictureUrl2 ? dynamicCreateImgElement(PictureUrl2, PictureDescription2) : null;
  let subImage3 = PictureUrl3 ? dynamicCreateImgElement(PictureUrl3, PictureDescription3) : null;

  subImage1 ? subImmageWrapper.appendChild(subImage1) : null;
  subImage2 ? subImmageWrapper.appendChild(subImage2) : null;
  subImage3 ? subImmageWrapper.appendChild(subImage3) : null;

  mainImageWrapper.appendChild(mainImage);
  imageWrapper.appendChild(mainImageWrapper);
  imageWrapper.appendChild(subImmageWrapper);

  return imageWrapper;
}

function locationInfoScriptOnInit(content) {
  const { Name, Description, OpenTime, TicketInfo, Address } = content;
  let infoScriptWrapper = dynamicCreateElement("div", "content-location-info-script");
  // Title
  let infoScriptWrapperTitle = dynamicCreateTextElement("span", "content-location-info-script-title", Name);
  // About
  let infoScriptWrapperAbout = dynamicCreateElement("div", "content-location-info-script-about");
  let infoScriptWrapperAboutTitle = dynamicCreateTextElement("h3", "content-location-info-script-about-title", "關於");
  let infoScriptWrapperAboutParagraph = dynamicCreateTextElement("p", "content-location-info-script-about-paragraph", Description);
  infoScriptWrapperAbout.appendChild(infoScriptWrapperAboutTitle);
  infoScriptWrapperAbout.appendChild(infoScriptWrapperAboutParagraph);
  // Opening Time
  let infoScriptWrapperOpeningTime = dynamicCreateElement("div", "content-location-info-script-opening-time");
  let infoScriptWrapperOpeningTimeTitle = dynamicCreateTextElement("span", "content-location-info-script-opening-time-title", "開放時間");
  let infoScriptWrapperOpeningTimeValue = dynamicCreateTextElement("span", "content-location-info-script-opening-time-value", OpenTime);
  infoScriptWrapperOpeningTime.appendChild(infoScriptWrapperOpeningTimeTitle);
  infoScriptWrapperOpeningTime.appendChild(infoScriptWrapperOpeningTimeValue);
  // Ticket
  let infoScriptWrapperTicket = dynamicCreateElement("div", "content-location-info-script-ticket");
  let infoScriptWrapperOpeningTicketTitle = dynamicCreateTextElement("span", "content-location-info-script-ticket-title", "票價資訊");
  let infoScriptWrapperOpeningTicketValue = dynamicCreateTextElement("span", "content-location-info-script-ticket-value", TicketInfo);
  infoScriptWrapperTicket.appendChild(infoScriptWrapperOpeningTicketTitle);
  infoScriptWrapperTicket.appendChild(infoScriptWrapperOpeningTicketValue);
  // Address
  let infoScriptWrapperAddress = dynamicCreateElement("div", "content-location-info-script-address");
  let infoScriptWrapperAddressTitle = dynamicCreateTextElement("span", "content-location-info-script-address-title", "地址");
  let infoScriptWrapperAddressValue = dynamicCreateTextElement("span", "content-location-info-script-address-value", Address);
  let locationIcon = dynamicCreateIconElement("icon-google-maps-pin");

  infoScriptWrapperAddressValue.appendChild(locationIcon);
  infoScriptWrapperAddress.appendChild(infoScriptWrapperAddressTitle);
  infoScriptWrapperAddress.appendChild(infoScriptWrapperAddressValue);

  infoScriptWrapper.appendChild(infoScriptWrapperTitle);
  infoScriptWrapper.appendChild(infoScriptWrapperAbout);
  infoScriptWrapper.appendChild(infoScriptWrapperOpeningTime);
  infoScriptWrapper.appendChild(infoScriptWrapperTicket);
  infoScriptWrapper.appendChild(infoScriptWrapperAddress);
  return infoScriptWrapper;
}

function transportInfoOnInit(contentData) {
  const { TravelInfo, Position } = contentData;
  const contentTransportInfo = document.getElementById("content-transport-info");

  contentTransportInfo.innerHTML = "";

  if (!TravelInfo) {
    return contentTransportInfo;
  }

  let transportInfoScript = transportInfoScriptOnInit(TravelInfo);
  let transportInfoMaps = transportInfoMapOnInit(Position);
  contentTransportInfo.appendChild(transportInfoScript);
  contentTransportInfo.appendChild(transportInfoMaps);
}

function transportInfoScriptOnInit(TravelInfo) {
  // transport Info Wrapper
  let transportInfoWrapper = dynamicCreateElement("div", "content-transport-info-script");
  //   Title
  let transportInfoTitle = dynamicCreateTextElement("h2", "content-transport-info-script-title", "交通資訊");
  // paragraph
  let transportInfoParagraph = dynamicCreateElement("div", "content-transport-info-script-paragraph");
  let transportInfoParagraphValue = dynamicCreateTextElement("span", "content-transport-info-script-paragraph-value", TravelInfo);
  transportInfoParagraph.appendChild(transportInfoParagraphValue);

  //   append all data
  transportInfoWrapper.appendChild(transportInfoTitle);
  transportInfoWrapper.appendChild(transportInfoParagraph);

  return transportInfoWrapper;
}

function transportInfoMapOnInit(position) {
  const { PositionLon, PositionLat } = position;

  let mapWrapper = dynamicCreateElement("div", "content-transport-info-maps");
  let mapImg = dynamicCreateImgElement("../images/attractions_content-map.png", "attractions_content-map.png");

  mapWrapper.appendChild(mapImg);
  return mapWrapper;
}

function otherRecommendationsOnInit(contentData, category) {
  const contentRecommendations = document.getElementById("content-other-recommendations-contents");

  contentRecommendations.innerHTML = "";
  contentData.forEach((item) => {
    const { Location, Name, Picture, ID, Address } = item;
    const { PictureDescription1, PictureUrl1 } = Picture;

    let verticalCard = dynamicCreateElement("a", "vertical-card");

    verticalCard.setAttribute("href", `/attractions_content.html?id=${item[idMapping[category]]}&name=${category}`);

    // Recommendations Image
    let verticalCardImgWrapper = dynamicCreateElement("div", "vertical-card-images");
    let verticalCardImage = dynamicCreateImgElement(PictureUrl1, PictureDescription1);
    verticalCardImgWrapper.appendChild(verticalCardImage);
    // Recommendations Info
    let verticalCardInfo = dynamicCreateElement("div", "vertical-card-info");
    let verticalCardInfoTitle = dynamicCreateTextElement("span", "vertical-card-info-title", Name);
    let verticalCardInfoLocation = dynamicCreateElement("span", "vertical-card-info-location");
    let verticalCardInfoLocationIcon = dynamicCreateIconElement("icon-location");
    let verticalCardInfoLocationText = Location
      ? dynamicCreateTextElement("span", "vertical-card-info-location-text", Location)
      : dynamicCreateTextElement("span", "vertical-card-info-location-text", Address);
    verticalCardInfoLocation.appendChild(verticalCardInfoLocationIcon);
    verticalCardInfoLocation.appendChild(verticalCardInfoLocationText);
    // Append Info Title & Location.
    verticalCardInfo.appendChild(verticalCardInfoTitle);
    verticalCardInfo.appendChild(verticalCardInfoLocation);
    // Append All Element.
    verticalCard.appendChild(verticalCardImgWrapper);
    verticalCard.appendChild(verticalCardInfo);
    contentRecommendations.appendChild(verticalCard);
  });
}

attractions_contentOnInit();

// AIzaSyBcQ9yTyD3FfmhikV9DMEi3Up3xtqkILmQ
