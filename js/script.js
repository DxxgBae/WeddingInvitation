document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 2000,
        once: true,
    });

    window.fslightbox_config = {
        zoom_buttons: false,
        thumbs: false,
    };

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

    getGuestBook();

    // 방명록 쓰기
    const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbxOMpo9Fci-CoP0REgItbBeLC1SxMXiu6csrks8mhPN7zZduxAdsBxvkGE4ZyIJukyh/exec";
    document
        .getElementById("dataForm")
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
                })
                .catch((error) => {
                    console.error("Fetch 오류:", error);
                    alert("🚨 서버와 통신 중 문제가 발생했습니다.");
                });
        });
});

function showMore(element) {
    const gallery = document.querySelector(".gallery");
    const isClicked = gallery.classList.toggle("expanded");
    if (isClicked) element.textContent = "접기 ";
    else element.textContent = "더보기 ";
    if (typeof refreshFsLightbox === "function") refreshFsLightbox();
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

function getGuestBook() {
    const guestbooks = document.querySelector(".guestbooks");
    guestbooks.innerHTML = "";
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
                    const id = document.createElement("div");
                    id.classList.add("guestbookId");
                    id.textContent = item.id;
                    container.appendChild(id);
                    const delBtn = document.createElement("div");
                    delBtn.classList.add("guestbookDel");
                    delBtn.textContent = "󰀣";
                    container.appendChild(delBtn);
                    const contents = document.createElement("pre");
                    contents.classList.add("guestbookContents");
                    contents.textContent = item.content;
                    container.appendChild(contents);
                    guestbooks.appendChild(container);
                }
            });
        })
        .catch((error) => console.error("Error:", error));
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
