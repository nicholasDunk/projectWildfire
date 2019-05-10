

function initializeSystem() {
  rootDiv = document.getElementById('root');
  greeting = document.createTextNode("Hello World Dynamic");
  rootDiv.appendChild(greeting)
}

document.addEventListener('DOMContentLoaded', initializeSystem);

