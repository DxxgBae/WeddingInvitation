document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery");
    const showMoreButton = document.querySelector(".galleryMoreBtn");

    const items = gallery.querySelectorAll("a");
    const maxItems = 9;

    if (items.length <= maxItems) showMoreButton.style.display = "none";

    showMoreButton.addEventListener("click", function () {
        gallery.classList.add("expanded");
        showMoreButton.style.display = "none";
        if (typeof refreshFsLightbox === "function") {
            refreshFsLightbox();
        }
    });
});
