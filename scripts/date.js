// date.js — dynamically outputs the copyright year and last-modified date
document.getElementById("currentyear").textContent = new Date().getFullYear();

document.getElementById(
  "lastModified"
).textContent = `Last Modification: ${document.lastModified}`;
