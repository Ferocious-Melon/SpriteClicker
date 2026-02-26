import gameState from "./gameState.js";

let goal = 25;

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


  /**
   * Listener that tracks when user meets the certain amount of clicks
   */
  gameState.addClickListener((clicks) => {
    if (clicks >= goal) {
      showBanner(`Reached ${goal} clicks!`);
      console.log(`reach ${goal}`);

      goal *= 2;
      console.log(`next goal: ${goal}`)
    }
  });
}