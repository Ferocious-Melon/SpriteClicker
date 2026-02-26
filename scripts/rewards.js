import gameState from "./gameState.js";

let goal = 2;
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
 * Reveals a banner when the user reaches a certain goal
 */
export function initRewards() {
  if (document.getElementById("rewards-banner")) return;

  //creates a banner
  const banner = document.createElement("div");
  banner.id = "rewards-banner";
  banner.classList.add("hidden");
  document.body.prepend(banner);

  let bannerTimer = null;

  /**
   * Reveals a goal banner for a short period of time
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
  function addAchievement(goalReached) {
    const randIndex = Math.floor(Math.random() * images.length);
    const randImg = images[randIndex];

    const achievement = document.createElement("div");
    achievement.classList.add("achievement");
    
    const img = document.createElement("img");
    img.src = randImg;
    img.classList.add("achievement-img");

    const text = document.createElement("span");
    text.textContent = `Unlocked: ${goalReached} Clicks!!`;

    achievement.appendChild(img);
    achievement.appendChild(text);
    achievementsContainer.appendChild(achievement);

  }

  /**
   * Listener that tracks when user meets the certain amount of clicks
   */
  gameState.addClickListener((clicks) => {
    if (clicks >= goal) {
      showBanner(`Reached ${goal} clicks!`);
      addAchievement(goal)

      goal += 2;
      console.log(`next goal: ${goal}`)
    }
  });
}