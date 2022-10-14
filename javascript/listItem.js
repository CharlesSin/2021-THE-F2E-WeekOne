import { renderFunction, createCard, createPaginationItem } from "../module/createElements.js";
import createPagination from "../module/createPagination.js";

const APIURL = {
  "featured-activities": "https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$format=JSON",
  "attractions-around": "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$format=JSON",
  "explore-gourmet": "https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$format=JSON",
  "accommodation-hotel": "https://ptx.transportdata.tw/MOTC/v2/Tourism/Hotel?$format=JSON",
};

const PAGEKEYMAPPING = {
  "featured-activities": "精選活動",
  "attractions-around": "各地景點",
  "explore-gourmet": "探索美食",
  "accommodation-hotel": "住宿飯店",
};

function changeHeaderListState(activeTag) {
  const listItem = document.querySelectorAll(".content-header-list-item");
  listItem.forEach((item) => {
    item.classList.contains("active") ? item.classList.remove("active") : null;
  });

  const newActiveTag = document.getElementById(activeTag);
  newActiveTag.classList.add("active");
}

function changeBanner(bannerName) {
  const bannerImg = document.getElementById("banner-img");
  const bannerTextContent = document.getElementById("banner-text");
  const imgPath = `../images/${bannerName}_banner.png`;
  const text = PAGEKEYMAPPING[bannerName];
  bannerImg.src = imgPath;
  bannerImg.alt = bannerName;
  bannerTextContent.textContent = text;
}

async function listItemOnInit() {
  const url = new URL(window.location.href);
  const pageName = url.searchParams.get("name") || "featured-activities";
  const fetchUri = APIURL[pageName];

  changeHeaderListState(pageName);
  changeBanner(pageName);

  const address = `${fetchUri}`;
  // const data = await dataQuery(address);
  const data = await GetApiResponse(address);
  const result = filterHavePicture(data);

  return result;
}

async function main() {
  // per page item.
  const PAGE_ITEM_QUANTITY = 10;

  const returnData = await listItemOnInit();

  const contents = document.querySelector("#contents-body");
  const paginationElement = document.querySelector("#pagination");

  const updateInfoCard = renderFunction(contents, createCard);
  const updatePagination = renderFunction(paginationElement, createPaginationItem);

  const pagesLength = returnData.length % PAGE_ITEM_QUANTITY === 0 ? returnData.length / PAGE_ITEM_QUANTITY : Math.trunc(returnData.length / PAGE_ITEM_QUANTITY) + 1;

  const pagination = createPagination({
    pagesLength,
    onChange: updateElements,
  });

  function updateElements({ currentPage, pages }) {
    const currentIndex = (currentPage - 1) * PAGE_ITEM_QUANTITY;
    updateInfoCard(returnData.slice(currentIndex, currentIndex + PAGE_ITEM_QUANTITY));
    updatePagination(pages);
  }

  paginationElement.addEventListener("click", (e) => {
    const { action, value } = e.target.dataset;
    const newPage = Number(value);
    const currentPage = pagination.getCurrentPage();

    if (!action || currentPage === newPage) return;

    const { currentPage: newCurrentPage } = pagination[action](newPage);

    history.pushState({ page: newCurrentPage }, "", "?page=" + newCurrentPage);
  });

  window.addEventListener("popstate", ({ state }) => {
    const { page = 1 } = state || {};
    updateElements(pagination.setPage(page));
  });

  const url = new URL(window.location.href);
  const pageParams = url.searchParams.get("page") || 1;
  updateElements(pagination.setPage(pageParams));
}

main();
