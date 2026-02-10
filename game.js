window.addEventListener("load",() => {

    clicker = document.getElementById("click-button");
    clicker.addEventListener("click", () => {
        clicker.classList.remove("animated");
        clicker.classList.add("animated");
    })
    clicker.addEventListener("animationend", () => {
        clicker.classList.remove("animated");
    })

});