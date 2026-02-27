import gameState from "./gameState.js";

//Starting goal for unlocking the first achievement
let clickGoal = 25;
let spriteGoal = 5;

//Achievement icons
const images = [
  "assets/images/icon1.png",
  "assets/images/icon2.png",
  "assets/images/icon3.png",
  "assets/images/icon4.png",
  "assets/images/icon5.png",
  "assets/images/icon6.png",
  "assets/images/icon7.png",
  "assets/images/icon8.png",
  "assets/images/icon9.png",
  "assets/images/icon10.png",
  "assets/images/icon11.png",
  "assets/images/icon12.png",
];

/**
 * Create the rewards system
 * Reveals a banner and achievement when the user reaches a certain goal
 */
export function initRewards() {

  // if (document.getElementById("rewards-banner")) return;

  //creates a banner element
  const banner = document.createElement("div");
  banner.id = "rewards-banner";
  banner.classList.add("hidden");
  document.body.prepend(banner);

  let bannerTimer = null;

  /*
   * Displays the banner with a message for a short period of time
   * @param {string} message - Text to display
   * @param {number} ms - How long banner stays visible
   */
  function showBanner(message, ms = 2500) {
    banner.textContent = message;
    clearTimeout(bannerTimer);
    banner.classList.add("hidden");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.classList.remove("hidden"); // fade in
        bannerTimer = setTimeout(() => {
          banner.classList.add("hidden"); // fade out
        }, ms);
      });
    });
  }

  const achievementsContainer = document.querySelector(".achievements");

  /*
  * Displays a new achievement in the rewards panel
  * @param {string} message - Text to display
  * @param {number} goalReached - The goal value achieved
  */
  function addAchievement(goalReached, type) {
    const randIndex = Math.floor(Math.random() * images.length);
    const randImg = images[randIndex];

    const achievement = document.createElement("div");
    achievement.classList.add("achievement");

    const img = document.createElement("img");
    img.src = randImg;
    img.classList.add("achievement-img");

    const text = document.createElement("span");
    text.textContent = `Unlocked: ${goalReached} ${type} !!`;

    achievement.appendChild(img);
    achievement.appendChild(text);
    achievementsContainer.appendChild(achievement);

    requestAnimationFrame(() => achievement.classList.add("show"));
  }

  /**
   * Listener that tracks when user meets the certain amount of clicks
   * Shows banner, add achievement and double the goal when the amount of clicks reaches or exceeds the goal
   */
  gameState.addClickListener((clicks) => {
    if (clicks >= clickGoal) {
      showBanner(`Reached ${clickGoal} clicks!`);
      addAchievement(clickGoal, "clicks")

      clickGoal *= 2;
      console.log(`next goal: ${clickGoal}`)
    }
  });

  gameState.addClickListener((balance) => {
    if (balance >= spriteGoal) {
      showBanner(`Collected ${spriteGoal} sprites!`);
      addAchievement(spriteGoal, "sprites");

      spriteGoal *= 2;
      console.log(`next goal: ${spriteGoal}`)
    }
  });
}