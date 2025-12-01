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

    //연락처확장
    const callBtns = document.querySelectorAll(".callBtn");
    callBtns.forEach((button) => {
        button.addEventListener("click", function () {
            if (this.className === "callBtn") {
                this.className = "callBtn clicked";
                this.textContent = this.textContent.replace("", "");
            } else {
                this.className = "callBtn";
                this.textContent = this.textContent.replace("", "");
            }
        });
    });

    //계좌확장
    const accountBtns = document.querySelectorAll(".accountBtn");
    accountBtns.forEach((button) => {
        button.addEventListener("click", function () {
            if (this.className === "accountBtn") {
                this.className = "accountBtn clicked";
                this.textContent = this.textContent.replace("", "");
            } else {
                this.className = "accountBtn";
                this.textContent = this.textContent.replace("", "");
            }
        });
    });

    //계좌복사
    const accountCopys = document.querySelectorAll(".accountCopy");
    accountCopys.forEach((button) => {
        button.addEventListener("click", function () {
            const tds = this.querySelectorAll("td");
            const textContents = [];
            Array.from(tds)
                .slice(1, -1)
                .forEach((td) => {
                    textContents.push(td.innerText.trim());
                });
            const textToCopy = textContents.join(" ");
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    alert(`내용이 복사되었습니다.`);
                })
                .catch((err) => {
                    alert("복사에 실패했습니다.");
                });
        });
    });
});
async function uploadImages() {
    const input = document.getElementById("fileInput");
    const files = input.files;

    if (!files.length) {
        alert("사진을 선택해주세요.");
        return;
    }

    const fileDataArray = [];

    for (let file of files) {
        const base64 = await convertToBase64(file);
        fileDataArray.push({
            fileName: file.name,
            contentType: file.type,
            base64Data: base64.split(",")[1], // base64 문자열만
        });
    }

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbyH9IbdCwkgbMEQ5GQvakGHIp-u9DVkkJrmCjq943gJOXvkPBnNaQKRtQEYfuY5OttMQg/exec",
            {
                // 여기에 Web App exec URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ files: fileDataArray }),
            }
        );

        const result = await response.json();
        document.getElementById("result").innerText =
            result.status === "success" ? "업로드 완료!" : "업로드 실패!";
    } catch (err) {
        document.getElementById("result").innerText = "업로드 중 오류 발생!";
        console.error(err);
    }
}

function convertToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}
