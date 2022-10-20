function dynamicCreateElement(tagName, classification) {
  const element = document.createElement(tagName);
  element.className = classification;

  return element;
}

function dynamicCreateImgElement(source, alt) {
  const imgElement = document.createElement("img");
  imgElement.src = source;
  imgElement.alt = alt;
  imgElement.setAttribute('loading', 'lazy');

  return imgElement;
}

function dynamicCreateTextElement(tagName, classification, content) {
  const textElement = document.createElement(tagName);
  textElement.className = classification;
  textElement.textContent = content;

  return textElement;
}

function dynamicCreateButtonElement(tagName, classification, content, link) {
  const buttonElement = document.createElement(tagName);
  buttonElement.className = classification;
  buttonElement.textContent = content;
  buttonElement.href = link;

  return buttonElement;
}

function dynamicCreateIconElement(classification) {
  const iconElement = document.createElement("i");
  iconElement.className = classification;

  return iconElement;
}
