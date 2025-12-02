document.addEventListener("DOMContentLoaded", function () {
    // 카운트다운
    const countDownDate = new Date("Feb 1, 2026 11:30:00").getTime();
    const ddayElement = document.querySelector(".dday");
    const dhourElement = document.querySelector(".dhour");
    const dminElement = document.querySelector(".dmin");
    const dsecElement = document.querySelector(".dsec");
    const dtextElement = document.querySelector(".dtext");
    const formatNumber = (num) => {
        return Math.abs(num) < 10
            ? "0" + Math.abs(num)
            : Math.abs(num).toString();
    };
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (ddayElement) ddayElement.textContent = formatNumber(days);
            if (dhourElement) dhourElement.textContent = formatNumber(hours);
            if (dminElement) dminElement.textContent = formatNumber(minutes);
            if (dsecElement) dsecElement.textContent = formatNumber(seconds);
            if (dtextElement)
                dtextElement.textContent = `동배&지민의 결혼식이 ${days}일 남았습니다.`;
        } else {
            const elapsed = Math.abs(distance);
            const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (elapsed % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
            if (ddayElement) ddayElement.textContent = formatNumber(days);
            if (dhourElement) dhourElement.textContent = formatNumber(hours);
            if (dminElement) dminElement.textContent = formatNumber(minutes);
            if (dsecElement) dsecElement.textContent = formatNumber(seconds);
            if (dtextElement)
                dtextElement.textContent = `동배와 지민이가 둘이 하나된지 ${days}일`;
        }
    };
    const x = setInterval(updateCountdown, 1000);
    updateCountdown();

    // 지도
    var mapDiv = document.getElementById("map");
    var center = new naver.maps.LatLng(37.52014, 127.05547);
    var mapOptions = {
        center: center,
        zoom: 17,
        minZoom: 13,
        maxZoom: 18,
        scaleControl: false,
        mapDataControl: false,
        mapTypeControl: false,
        zoomControl: false,
    };
    var map = new naver.maps.Map(mapDiv, mapOptions);
    var marker = new naver.maps.Marker({
        position: center,
        map: map,
    });
    setTimeout(function () {
        map.trigger("resize");
    }, 1000);

    // 방명록
    const guestbookUrl =
        "https://docs.google.com/spreadsheets/d/1BsjMFCJLE8gI2KQS4nfcOxfofJ7vzepg7UMfD0MzM88/gviz/tq?tqx=out:json&gid=0";
    fetch(guestbookUrl)
        .then((response) => response.text())
        .then((text) => {
            const json = JSON.parse(text.slice(47, -2));
            const keys = json.table.cols.map((c) => c.label);
            const data = json.table.rows
                .map((r) =>
                    Object.fromEntries(
                        keys.map((key, i) => [key, r.c[i]?.v ?? ""])
                    )
                )
                .reverse();
            const wrapper = document.querySelector(
                ".swiper-guestbook .swiper-wrapper"
            );
            data.forEach((item) => {
                loadGuestbook(wrapper, item);
            });
            new Swiper(".swiper-guestbook", {
                direction: "vertical",
                loop: false,
                effect: "slide",
                slidesPerView: "auto",
                spaceBetween: 8,
            });
        })
        .catch((error) => console.error("Error:", error));
});

function showMore(element) {
    window.fslightbox_config = {
        zoom_buttons: false,
    };
    const gallery = document.querySelector(".gallery");
    const showMoreButton = document.querySelector(".galleryShowMore");
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
}

function clicked(element) {
    const isClicked = element.classList.toggle("clicked");
    if (isClicked) element.textContent = element.textContent.replace("", "");
    else element.textContent = element.textContent.replace("", "");
}

function callPhone(element) {
    const phoneNumber = element.getAttribute("data-phone");
    if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
    else console.error("전화번호 정보가 없습니다.", element);
}

function copyAccount(element) {
    navigator.clipboard
        .writeText(element.getAttribute("data-account"))
        .then(() => {
            alert(`내용이 복사되었습니다.`);
        })
        .catch((err) => {
            alert("복사에 실패했습니다.");
        });
}

function loadGuestbook(wrapper, item) {
    if (item.show) {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.classList.add("guestbookSlide");
        const x = document.createElement("div");
        x.textContent = "x";
        slide.appendChild(x);
        const id = document.createElement("div");
        id.textContent = item.id;
        slide.appendChild(id);
        const text = document.createElement("div");
        text.textContent = item.text;
        slide.appendChild(text);
        wrapper.appendChild(slide);
    }
}
