window.addEventListener("load", () => {
  const title = document.querySelector(".title");
  const subtitle = document.querySelector(".subtitle");
  const button = document.querySelector(".start-button");
  const quote = document.querySelector(".quote");

  setTimeout(() => title.classList.add("fade-in"), 100);
  setTimeout(() => subtitle.classList.add("fade-in"), 400);
  setTimeout(() => button.classList.add("fade-in"), 700);
  setTimeout(() => quote.classList.add("fade-in"), 1000);
});

const button = document.querySelector(".start-button");
const sound = document.getElementById("hoverSound");

button.addEventListener("mouseenter", () => {
  sound.currentTime = 0; 
  sound.play();
});
