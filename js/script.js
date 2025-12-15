const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwqH_LxD0DT4J8Mplc5RDyX_N_OgkvDPruY1Gn8u1f-Hf9Lu5Fh2gM2GIYgamiuYFaq/exec";

document.addEventListener("DOMContentLoaded", function () {
    // 페이드효과
    AOS.init({
        duration: 2000,
        offset: 0,
        delay: 200,
        once: false,
    });
    aosRefresh();

    // 인트로 폰트크기
    const parent = document.body;
    function setFontSize() {
        const parentWidth = parent.clientWidth;
        const fontSize = `${parentWidth * 0.25}px`;
        parent.style.setProperty("--font-scale", fontSize);
    }
    setFontSize(parent);
    window.addEventListener("resize", setFontSize(parent));

    // 카운트다운
    const countDownDate = new Date("Feb 1, 2026 11:30:00").getTime();
    const ddayElement = document.querySelector(".infoDday");
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            if (ddayElement) ddayElement.textContent = days;
        } else {
            const elapsed = Math.abs(distance);
            const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            if (ddayElement) ddayElement.textContent = days;
        }
    };
    updateCountdown();

    // 갤러리
    window.fslightbox_config = {
        zoom_buttons: false,
        thumbs: false,
    };
    const gallery = document.querySelector(".gallery");
    for (let i = 0; i < 21; i++) {
        const img = document.createElement("a");
        img.classList.add("galleryItem");
        img.href = `img/gallery_${i + 1}.jpg`;
        img.setAttribute("data-fslightbox", "gallery");
        img.setAttribute("data-aos", "fade");
        img.setAttribute("data-aos-delay", (i % 3) * 400 + 200);
        const thumb = document.createElement("img");
        thumb.classList.add("thumb");
        thumb.src = `img/gallery_${i + 1}_thumb.jpg`;
        thumb.alt = "";
        img.appendChild(thumb);
        gallery.appendChild(img);
    }
    if (typeof refreshFsLightbox === "function") refreshFsLightbox();
    const galleryBtn = document.querySelector(".galleryBtn");
    galleryBtn.addEventListener("click", () => {
        const isClicked = galleryBtn.classList.toggle("clicked");
        if (isClicked) galleryBtn.textContent = "사진 접기 ";
        else galleryBtn.textContent = "사진 더보기 ";
        if (typeof refreshFsLightbox === "function") refreshFsLightbox();
        setTimeout(() => {
            aosRefresh();
        }, 450);
    });

    // 눈효과
    const createSnowflakes = () => {
        const container = document.querySelector(".snowContainer");
        const styleEl = document.createElement("style");
        let css = "";
        for (let i = 0; i < 100; i++) {
            const randomX = Math.random() * 100;
            const randomOffset = Math.random() * 30 - 15;
            const randomXEnd = randomX + randomOffset;
            const randomXEndYoyo = randomX + randomOffset / 2;

            const randomYoyoTime = Math.random();
            const randomYoyoY = randomYoyoTime * 100;

            const randomScale = Math.random();
            const fallDuration = Math.random() * 15 + 15;
            const fallDelay = Math.random() * -1000;
            const opacity = Math.random();

            const snowflake = document.createElement("div");
            snowflake.classList.add("snow");
            snowflake.style.opacity = opacity;
            snowflake.style.transform = `translate(${randomX}vw, -6px) scale(${randomScale})`;
            snowflake.style.animation = `fall-${i} ${fallDuration}s ${fallDelay}s linear infinite`;
            container.appendChild(snowflake);

            css += `
            @keyframes fall-${i} {
                ${randomYoyoTime * 100}% {
                    transform: translate(${randomXEnd}vw, ${randomYoyoY}vh) scale(${randomScale});
                }
                to {
                    transform: translate(${randomXEndYoyo}vw, 100vh) scale(${randomScale});
                }
            }
        `;
        }
        styleEl.innerHTML = css;
        document.head.appendChild(styleEl);
    };
    createSnowflakes();

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
    setTimeout(() => {
        map.trigger("resize");
    }, 1000);

    // 방명록 가져오기
    getGuestBook();

    // 방명록 쓰기
    document
        .getElementById("writeForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();
            const form = e.target;
            const formInputData = new FormData(form);
            const submittedName = formInputData.get("name") || "익명";
            const submittedContent = formInputData.get("content") || "";
            if (
                containsBadWordsJS(submittedName) ||
                containsBadWordsJS(submittedContent)
            ) {
                alert(
                    "⚠️ 입력하신 이름 또는 내용에 부적절한 단어가 포함되어 있습니다."
                );
                return;
            }
            const formData = new URLSearchParams(formInputData);
            const sendBtn = document.querySelector(".sendBtn");
            sendBtn.textContent = "전달중...";
            fetch(SCRIPT_URL, {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.result === "success") {
                        alert("✅ 방명록 등록을 성공했습니다!");
                        getGuestBook();
                        form.reset();
                    } else {
                        const message =
                            data.message || "방명록 등록을 실패했습니다.";
                        alert(`❌ ${message}`);
                    }
                    sendBtn.textContent = "전달하기";
                })
                .catch((error) => {
                    console.error("Fetch 오류:", error);
                    alert("🚨 서버와 통신 중 문제가 발생했습니다.");
                    sendBtn.textContent = "전달하기";
                });
        });
});

function aosRefresh() {
    if (typeof AOS !== "undefined" && typeof AOS.refresh === "function")
        AOS.refresh();
}

function clicked(element) {
    const isClicked = element.classList.toggle("clicked");
    if (isClicked) element.textContent = element.textContent.replace("", "");
    else element.textContent = element.textContent.replace("", "");
    const dropdownBox = element.nextElementSibling;
    if (dropdownBox && isClicked) {
        const targetHeight = dropdownBox.dataset.height;
        if (targetHeight) dropdownBox.style.height = targetHeight;
    } else if (dropdownBox && !isClicked) {
        dropdownBox.style.height = null;
    }
    setTimeout(() => {
        aosRefresh();
    }, 450);
}

function radio(element) {
    const index = element.getAttribute("data-radio");
    const btns = document.querySelectorAll(".radioBtn");
    btns.forEach((item) => {
        if (item.getAttribute("data-radio") === index)
            item.classList.add("clicked");
        else item.classList.remove("clicked");
    });
    const contents = document.querySelectorAll(".radioContent");
    contents.forEach((item) => {
        if (item.getAttribute("data-radio") === index)
            item.classList.add("clicked");
        else item.classList.remove("clicked");
    });
    setTimeout(() => {
        aosRefresh();
    }, 450);
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

function getGuestBook() {
    const guestbooks = document.querySelector(".guestbooks");
    guestbooks.innerHTML = "";
    const fragment = document.createDocumentFragment();
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
            data.forEach((item) => {
                if (item.show) {
                    const container = document.createElement("div");
                    container.classList.add("guestbook");
                    const name = document.createElement("div");
                    name.classList.add("guestbookId");
                    name.textContent = `from ${item.name}`;
                    container.appendChild(name);
                    const delBtn = document.createElement("div");
                    delBtn.setAttribute("data-id", item.id);
                    delBtn.classList.add("guestbookDel");
                    delBtn.textContent = "󰀣";
                    delBtn.addEventListener("click", function () {
                        delGuestBook(this);
                    });
                    container.appendChild(delBtn);
                    const contents = document.createElement("pre");
                    contents.classList.add("guestbookContents");
                    contents.textContent = item.content;
                    container.appendChild(contents);
                    fragment.appendChild(container);
                }
            });
            guestbooks.appendChild(fragment);
        })
        .catch((error) => console.error("Error:", error));
}

function delGuestBook(element) {
    const idToDelete = element.getAttribute("data-id");
    const password = prompt("삭제를 위해 암호를 입력하세요:");
    if (password === null || password.trim() === "") return;
    const url = new URL(SCRIPT_URL);
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${idToDelete}&password=${encodeURIComponent(
            password
        )}&action=delete`,
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            if (data.result === "success") getGuestBook();
        })
        .catch((error) => {
            console.error("삭제 요청 중 에러 발생:", error);
            alert("삭제 요청에 실패했습니다. 네트워크를 확인하세요.");
        });
}

function containsBadWordsJS(text) {
    const BAD_WORDS = [
        // --- 1. 주요 비속어, 욕설 (완형) ---
        "씨발",
        "시발",
        "병신",
        "개새끼",
        "좆같",
        "존나",
        "애미",
        "애비",
        "창년",
        "보지",
        "자지",
        "느금마",
        "니애미",
        "니애비",
        "꺼져",
        "미친",
        "돌아이",
        "등신",
        "병맛",
        "염병",
        "지랄",
        "걸레",
        "또라이",
        "호로",
        "쌍년",
        "쌍놈",
        "호구",
        "병자",
        "정신병자",
        "장애인",
        "고자",
        "씹",
        "개년",
        "개놈",
        "양아치",
        "쓰레기",

        // --- 2. 초성 욕설 및 변형 (띄어쓰기 없이 검사됨) ---
        "ㅅㅂ",
        "ㅆㅂ",
        "ㅄ",
        "ㅂㅅ",
        "ㅈㄴ",
        "ㅈㄱㅌ",
        "ㄴㄱㅁ",
        "ㅆㄲ",
        "ㅁㅊㄴ",
        "ㅇㅁㅊㄴ",
        "ㅅㄲㅇ",
        "ㅈㅅ",
        "ㅎㄹ",
        "ㄱㅅㄲ",
        "ㄱㄱㄷ",
        "ㄱㅎ",
        "ㄱㅆ",
        "ㅅㄲ",
        "ㅅㅂㄴ",
        "ㅅㅂㄹ",
        "ㅈㄹ",
        "ㅁㅈㅎ",
        "ㅇㅂ",
        "ㄷㅈㄹ",
        "ㄱㄷㅈ",
        "ㄱㄷ",
        "ㄱㅈ",

        // --- 3. 은어 및 기타 변형 ---
        "쉬벌",
        "슈발",
        "쉽알",
        "좆나",
        "존나",
        "졸라",
        "개때끼",
        "쌔끼",
        "개쓰레기",

        // --- 4. 음란성/성적 단어 ---
        "섹스",
        "성교",
        "자위",
        "포르노",
        "av",
        "야동",
        "강간",
        "성매매",
        "오피",
        "키스방",
        "유흥",
        "모텔",
        "ㅂㅈ",
        "ㅈㅈ",
        "ㅂㅈㅇ",
        "ㅈㅈㅇ",
        "ㅅㅅ",
        "ㅇㄷ",
        "ㅁㅌ",

        // --- 5. 광고성/스팸성 키워드 (URL 포함) ---
        "광고",
        "수익",
        "토토",
        "도박",
        "머니",
        "대출",
        "현금",
        "비아그라",
        "릴게임",
        "http",
        "www",
        "클릭",
        "배팅",
        "로또",
        "추천인",
        "코드",
        "텔레그램",
        "오픈톡",
        "톡방",
        "주소",
        "링크",

        // --- 6. 혐오 및 정치적 극단 키워드 ---
        "일베",
        "메갈",
        "페미",
        "노무현",
        "김대중",
        "전두환",
        "문재인",
        "윤석열",
        "종북",
        "좌빨",
        "우꼴",
        "홍어",
        "가세연",
    ];
    if (!text) return false;
    const filteredText = text
        .toString()
        .toLowerCase()
        .replace(/[\s\.\,\!\~\`\+\=\-\*]/g, "");
    for (const badWord of BAD_WORDS) {
        if (filteredText.includes(badWord)) {
            return true;
        }
    }
    return false;
}
