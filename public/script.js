document.addEventListener("DOMContentLoaded", () => {

    const bar = document.querySelector(".bars");
    bar.addEventListener("click", () => {
        const navListItems = document.querySelector(".nav-list-items");
        navListItems.classList.toggle("hide");
    })
})