document.addEventListener("DOMContentLoaded", function () {
    // 갤러리
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

    // 디데이 카운트다운
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

    //지도
    function initMap() {
        var mapDiv = document.getElementById("map");
        var center = new naver.maps.LatLng(37.3595704, 127.105399);
        var mapOptions = {
            center: center,
            zoom: 16,
            minZoom: 10,
            zoomControl: true,
            zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT,
            },
        };
        var map = new naver.maps.Map(mapDiv, mapOptions);
        var marker = new naver.maps.Marker({
            position: center,
            map: map,
        });
    }
    window.onload = initMap;
});
