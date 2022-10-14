export function renderFunction(bindDom, renderContent, contentData = []) {
  if (contentData.length) bindDom.innerHTML = updateElement([...contentData]);

  function updateElement(newData) {
    contentData = newData;
    bindDom.innerHTML = newData.map(renderContent).join("");
  }

  return updateElement;
}

export function createCard(data) {
  let {
    Address,
    Description,
    Name,
    StartTime,
    EndTime,
    Picture,
  } = data
  const { PictureUrl1, PictureDescription1 } = Picture;
  const beginTime = StartTime
    ? `${new Date(StartTime).toISOString().slice(0, 10).replace(/-/g, "/")}`
    : null;
  const finishTime = EndTime
    ? `${new Date(EndTime).toISOString().slice(0, 10).replace(/-/g, "/")}`
    : null;

  const url = new URL(window.location.href);
  const pageName = url.searchParams.get("name") || "featured-activities";
  const nameMapping = {
    "featured-activities": `${data.ActivityName}`,
    "attractions-around": `${data.ScenicSpotName}`,
    "explore-gourmet": `${data.RestaurantName}`,
    "accommodation-hotel": `${data.HotelName}`,
  };
  const idMapping = {
    "featured-activities": `${data.ActivityID}`,
    "attractions-around": `${data.ScenicSpotID}`,
    "explore-gourmet": `${data.RestaurantID}`,
    "accommodation-hotel": `${data.HotelID}`,
  };

  return /*html*/ `
      <div class="horizontal-card">
        <div class="horizontal-card-image">
            <img src="${PictureUrl1}" alt="${PictureDescription1}">
        </div>
        <div class="horizontal-card-info">
            <div class="horizontal-card-info-title debugger">${
              nameMapping[pageName]
            }</div>
            ${
              beginTime !== null
                ? `<div class="horizontal-card-info-time">
                  <span class="horizontal-card-info-time-title">時間</span>
                  <span class="horizontal-card-info-time-value">
                    ${beginTime} - ${finishTime}
                  </span>
                </div>`
                : ""
            }
            <div class="horizontal-card-info-location">
                <span class="horizontal-card-info-location-title">地點</span>
                <span class="horizontal-card-info-location-value">${Address}</span>
            </div>
            <p class="horizontal-card-info-paragraph">
              ${Description}
            </p>
            <div class="horizontal-card-info-footer">
                <a href="/attractions_content.html?name=${pageName}&id=${idMapping[pageName]}" class="horizontal-card-info-footer-text">活動詳情</a>
            </div>
        </div>
    </div>
    `;
}

function clsx(...args) {
  return args.filter(Boolean).join(" ");
}

function propsToAttribute(props) {
  return Object.entries(props)
    .reduce((array, [key, value]) => array.concat(`${key}="${value}"`), [])
    .join(" ");
}

function Item({ value, className, status, ...props }) {
  let activeState = status ? "active" : "";
  value = value === "Prev" ? "&lt;" : value === "Next" ? "&gt;" : value;

  return /*html*/ `
  <li class="content-footer-list-item ${activeState}">
      <a 
        href="?page=${value}"
        onclick="return false"
        class="${className}"
        ${propsToAttribute(props)}
      >
        ${value}
      </a>
    </li>
  `;
}

export function createPaginationItem({ value, action, isActive }) {
  if (!action) {
    return Item({ value, className: "content-footer-list-item-text" });
  }

  if (isActive) {
    return Item({
      value,
      className: "content-footer-list-item-text",
      "data-action": action,
      "data-value": value,
      status: true,
    });
  }

  return Item({
    value,
    className: "content-footer-list-item-text",
    "data-action": action,
    "data-value": value,
  });
}

export default { renderFunction, createCard, createPaginationItem };
