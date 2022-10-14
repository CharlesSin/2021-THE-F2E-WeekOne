function dropdownFunc(key) {
  let selectDropdown = document.getElementById(key);
  let selectDropdownParent = selectDropdown.parentNode;
  let selectDropdownList = selectDropdownParent.querySelectorAll(`[data-container="${key}"]`)[0];

  let selectDropdownChild = selectDropdownList.children;
  let selectDropdownSpan = selectDropdown.children;
  for (let i = 0; i < selectDropdownChild.length; i++) {
    selectDropdownChild[i].addEventListener("click", function () {
      selectDropdownSpan[0].textContent = selectDropdownChild[i].textContent;
      selectDropdown.classList.remove("active");
      selectDropdownList.classList.remove("active");
    });
  }

  if (!selectDropdown.classList.contains("active")) {
    selectDropdown.classList.add("active");
    selectDropdownList.classList.add("active");
  } else {
    closeDropdown(key);
  }
}

function closeDropdown(key) {
  if (key) {
    let selectDropdown = document.getElementById(key);
    let selectDropdownParent = selectDropdown.parentNode;
    let selectDropdownList = selectDropdownParent.querySelectorAll(`[data-container="${key}"]`)[0];

    selectDropdown.classList.remove("active");
    selectDropdownList.classList.remove("active");
  } else {
    let allDropdown = document.querySelectorAll(".custom-dropdown");
    for (let i = 0; i < allDropdown.length; i++) {
      let dropdownSpan = allDropdown[i].children[0];
      let dropdownList = allDropdown[i].children[1];

      dropdownSpan.classList.contains("active") ? dropdownSpan.classList.remove("active") : null;

      dropdownList.classList.contains("active") ? dropdownList.classList.remove("active") : null;
    }
  }
}

// Listen to the doc click
window.addEventListener("click", function (e) {
  // Close the menu if click happen outside menu
  if (e.target.closest(".custom-dropdown") === null) {
    // Close the opend dropdown
    closeDropdown();
  }
});
