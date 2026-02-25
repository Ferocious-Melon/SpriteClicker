import gameState from "./gameState.js";

export function initRewards() {
  const banner = document.createElement("div");
  banner.id = "rewards-banner";
  banner.classList.add("hidden");
  document.body.insertBefore(banner, document.body.firstChild);

  let bannerTimer = null;

  function showBanner(msg, ms = 2500) {
    banner.textContent = msg;
    banner.classList.remove("hidden");

    if (bannerTimer) clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => banner.classList.add("hidden"), ms);
  }

  const goals = new Set([10, 25, 50, 100]);

  gameState.addClickListener((clicks) => {
    if (goals.has(clicks)) {
      showBanner(`${clicks} clicks!`);
    }
  });
}
