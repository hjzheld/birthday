<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const pageRef = ref(null);
let observer = null;

function initRevealAnimation() {
  const elements = pageRef.value?.querySelectorAll('.reveal');

  if (!elements?.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('reveal--visible');
        observer?.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((element) => observer.observe(element));
}

onMounted(async () => {
  await nextTick();
  initRevealAnimation();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

const invitation = {
  name: '공재권',
  date: '2026년 10월 03일 토요일',
  day: '03',
  month: 'OCTOBER',
  time: '오후 12시',
  place: '그림정',
  address: '전북 남원시 남문로 467 1층',

  // 네이버 지도 링크에 포함된 그림정 좌표
  lat: 35.4064732,
  lng: 127.3826884,
};

const parking = {
  name: '예가람길 공영주차장',
  address: '전북 남원시 동헌길 106',

  // 하정동 59-2 하정주차장 좌표
  lat: 35.4076242,
  lng: 127.3820615,
};

// ==========================================
// 지도 링크
// ==========================================

// 카카오 길찾기
const kakaoInvitationUrl = `https://map.kakao.com/link/to/${encodeURIComponent(invitation.place)},${invitation.lat},${invitation.lng}`;
const kakaoParkingUrl = `https://map.kakao.com/link/to/${encodeURIComponent(parking.name)},${parking.lat},${parking.lng}`;

// 카카오 길찾기 이동
function openKakaoMap(url) {
  window.location.href = url;
}

// 네이버 웹 fallback
const naverInvitationWebUrl =
  'https://map.naver.com/p/directions/-/14180176.008566236,4219257.347639489,%EA%B7%B8%EB%A6%BC%EC%A0%95,1793779485,PLACE_POI/-/car?c=15.00,0,0,0,dh';

const naverParkingWebUrl =
  'https://map.naver.com/p/directions/-/14180106.222377459,4219414.549907103,%EC%98%88%EA%B0%80%EB%9E%8C%EA%B8%B8%20%EA%B3%B5%EC%98%81%EC%A3%BC%EC%B0%A8%EC%9E%A5,,ADDRESS_POI/-/car?c=15.00,0,0,0,dh';

// ==========================================
// 네이버 지도 안내 팝업
// alert()를 쓰지 않고 직접 만든 팝업의 "확인" 클릭 이벤트에서
// 지도 이동을 실행해 브라우저의 외부 앱/새 창 차단을 피함
// ==========================================
const showNaverNotice = ref(false);
const pendingNaverTarget = ref(null);

function requestNaverMap(destination, webUrl) {
  pendingNaverTarget.value = {
    destination,
    webUrl,
  };

  showNaverNotice.value = true;
}

function closeNaverNotice() {
  showNaverNotice.value = false;
  pendingNaverTarget.value = null;
}

function confirmNaverMap() {
  const target = pendingNaverTarget.value;

  if (!target) return;

  const webUrl = target.webUrl;

  showNaverNotice.value = false;
  pendingNaverTarget.value = null;

  // 확인 버튼 클릭 → 네이버 웹 길찾기로 확실하게 이동
  window.location.href = webUrl;
}

// ==========================================
// 네이버 지도 실행
//
// PC:
//   네이버 웹으로 현재 탭 이동
//
// Android:
//   네이버지도 앱 실행 시도
//   앱이 없으면 네이버 웹으로 fallback
//
// iOS:
//   네이버지도 앱 실행 시도
//   앱이 열리지 않으면 네이버 웹으로 fallback
// ==========================================
function openNaverMap(destination, webUrl) {
  // 네이버 앱 스킴을 거치지 않고
  // 출발지는 비워둔 네이버 웹 길찾기 페이지로 바로 이동
  window.location.href = webUrl;
}
</script>

<template>
  <main ref="pageRef" class="invitation-page">
    <!-- ==========================================
         메인
    =========================================== -->
    <section class="hero">
      <div class="hero-border"></div>

      <div class="hero-content">
        <p class="eyebrow hero-animate hero-animate--1">
          INVITATION
        </p>

        <p class="hero-hanja hero-animate hero-animate--2">
          八旬
        </p>

        <h1 class="hero-animate hero-animate--3">
          여든 번째 봄을 맞아<br />
          소중한 분들을 초대합니다
        </h1>

        <div class="divider hero-animate hero-animate--4">
          <span></span>
          <i>福</i>
          <span></span>
        </div>

        <p class="hero-name hero-animate hero-animate--5">
          {{ invitation.name }} 님의 팔순잔치
        </p>
      </div>

      <div class="scroll-guide">
        <span>SCROLL</span>
        <i></i>
      </div>
    </section>

    <!-- ==========================================
         초대글
    =========================================== -->
    <section class="section greeting">
      <p class="eyebrow reveal reveal-up">
        INVITATION MESSAGE
      </p>

      <h2 class="reveal reveal-up reveal-delay-1">
        함께해 주신 세월에<br />
        감사의 마음을 담아
      </h2>

      <span class="ornament reveal reveal-scale reveal-delay-2">
        ✦
      </span>

      <p class="greeting-text reveal reveal-up reveal-delay-2">
        한결같은 사랑과 따뜻한 마음으로<br />
        가족을 지켜주신 아버님께서<br />
        어느덧 여든 번째 생신을 맞이하셨습니다.
        <br /><br />

        뜻깊은 날,<br />
        소중한 분들을 모시고 감사와 기쁨을<br />
        함께 나누고자 자리를 마련했습니다.
        <br /><br />

        바쁘시더라도 귀한 걸음 하시어<br />
        자리를 빛내주시면 감사하겠습니다.
      </p>
    </section>

    <!-- ==========================================
         80
    =========================================== -->
    <section class="age-section">
      <div class="age-circle reveal reveal-scale">
        <span>HAPPY</span>

        <strong>80</strong>

        <span>BIRTHDAY</span>
      </div>

      <p class="reveal reveal-up reveal-delay-1">
        여든 해의 아름다운 세월과<br />
        앞으로의 건강하고 행복한 날들을 축복합니다.
      </p>
    </section>

    <!-- ==========================================
         일시
    =========================================== -->
    <section class="section schedule">
      <p class="eyebrow reveal reveal-up">
        DATE & TIME
      </p>

      <h2 class="reveal reveal-up reveal-delay-1">
        소중한 날
      </h2>

      <div class="schedule-card reveal reveal-up reveal-delay-2">
        <div class="date-box">
          <span>
            {{ invitation.month }}
          </span>

          <strong>
            {{ invitation.day }}
          </strong>

          <span>
            SATURDAY
          </span>
        </div>

        <div class="date-info">
          <p>
            {{ invitation.date }}
          </p>

          <strong>
            {{ invitation.time }}
          </strong>
        </div>
      </div>
    </section>

    <!-- ==========================================
         장소
    =========================================== -->
    <section class="section location">
      <p class="eyebrow reveal reveal-up">
        LOCATION
      </p>

      <h2 class="reveal reveal-up reveal-delay-1">
        오시는 길
      </h2>

      <div class="location-card reveal reveal-scale reveal-delay-2">
        <div class="location-pin">
          <span></span>
        </div>

        <h3>
          {{ invitation.place }}
        </h3>

        <p class="address">
          {{ invitation.address }}
        </p>

        <div class="map-buttons">
          <button
            type="button"
            class="map-button"
            @click="requestNaverMap(invitation, naverInvitationWebUrl)"
          >
            네이버 길찾기
            <span>→</span>
          </button>

          <button
            type="button"
            class="map-button"
            @click="openKakaoMap(kakaoInvitationUrl)"
          >
            카카오 길찾기
            <span>→</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ==========================================
         교통
    =========================================== -->
    <section class="section traffic">
      <p class="eyebrow reveal reveal-up">
        INFORMATION
      </p>

      <h2 class="reveal reveal-up reveal-delay-1">
        찾아오시는 길
      </h2>

      <div class="traffic-list">
        <div class="traffic-item reveal reveal-up">
          <span class="number">
            01
          </span>

          <div>
            <strong>
              자가용 이용 시
            </strong>

            <p>
              내비게이션에
              {{ invitation.place }}을 검색해주세요.
            </p>
          </div>
        </div>

        <div class="traffic-item reveal reveal-up reveal-delay-1">
          <span class="number">
            02
          </span>

          <div>
            <strong>
              대중교통 이용 시
            </strong>

            <p>
              OO역 3번 출구에서 도보 약 5분 거리에
              위치해 있습니다.
            </p>
          </div>
        </div>

        <div class="traffic-item reveal reveal-up reveal-delay-2">
          <span class="number">
            03
          </span>

          <div>
            <strong>
              주차 안내
            </strong>

            <p>
              근처 {{ parking.name }}(무료)을 이용하실 수 있습니다.
            </p>

            <p class="parking-address">
              {{ parking.address }}
            </p>

            <div class="traffic-map-buttons">
              <button
                type="button"
                class="traffic-map-button"
                @click="requestNaverMap(parking, naverParkingWebUrl)"
              >
                네이버 길찾기
              </button>

              <button
                type="button"
                class="traffic-map-button"
                @click="openKakaoMap(kakaoParkingUrl)"
              >
                카카오 길찾기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==========================================
         마지막
    =========================================== -->
    <section class="closing">
      <div class="closing-symbol reveal reveal-scale">
        壽
      </div>

      <p class="reveal reveal-up reveal-delay-1">
        귀한 발걸음으로 함께해 주시는<br />
        모든 분들께 깊이 감사드립니다.
      </p>

      <strong class="reveal reveal-up reveal-delay-2">
        건강과 행복이 늘 함께하시길 바랍니다.
      </strong>

      <span class="closing-line reveal reveal-scale reveal-delay-2"></span>

      <small class="reveal reveal-up reveal-delay-2">
        THANK YOU
      </small>
    </section>

    <!-- ==========================================
         네이버 지도 안내 팝업
    =========================================== -->
    <div
      v-if="showNaverNotice"
      class="naver-notice"
      role="dialog"
      aria-modal="true"
      aria-labelledby="naver-notice-title"
      @click.self="closeNaverNotice"
    >
      <div class="naver-notice-card">
        <div class="naver-notice-icon">
          N
        </div>

        <h3 id="naver-notice-title">
          네이버 길찾기로 이동합니다
        </h3>

        <p>
          네이버 지도 웹 길찾기 화면으로 이동합니다.<br />
          출발지는 현재 위치로 선택해서 이용해주세요.
        </p>

        <div class="naver-notice-actions">
          <button
            type="button"
            class="naver-notice-cancel"
            @click="closeNaverNotice"
          >
            취소
          </button>

          <button
            type="button"
            class="naver-notice-confirm"
            @click="confirmNaverMap"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.invitation-page {
  --navy: #172335;
  --navy-deep: #101a28;

  --gold: #ad8850;
  --gold-light: #d6bd8e;

  --cream: #f8f5ee;
  --paper: #f2ede3;

  --text: #272725;
  --sub-text: #747068;

  overflow: hidden;

  background: var(--cream);

  color: var(--text);

  font-family:
    Pretendard,
    "Noto Sans KR",
    sans-serif;

  animation: pageFade 1s ease;
}

.section {
  max-width: 600px;

  margin: 0 auto;
  padding: 100px 30px;

  text-align: center;
}

.eyebrow {
  margin: 0 0 16px;

  color: var(--gold);

  font-family: Georgia, serif;
  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.3em;
}

.section h2 {
  margin: 0;

  color: var(--navy);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: clamp(27px, 6vw, 36px);
  font-weight: 500;
  line-height: 1.5;

  letter-spacing: -0.04em;
}

/* ==========================================
   HERO
========================================== */

.hero {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 100svh;
  box-sizing: border-box;

  overflow: hidden;

  padding: clamp(38px, 7svh, 60px) 25px;

  background:
    radial-gradient(
      circle at 50% 45%,
      #ffffff,
      transparent 45%
    ),
    var(--cream);

  text-align: center;
}

.hero::before {
  content: "";

  position: absolute;

  top: -170px;
  right: -100px;

  width: 320px;
  height: 320px;

  border: 1px solid rgba(173, 136, 80, 0.15);

  border-radius: 50%;
}

.hero::after {
  content: "";

  position: absolute;

  bottom: -200px;
  left: -120px;

  width: 350px;
  height: 350px;

  border: 1px solid rgba(173, 136, 80, 0.12);

  border-radius: 50%;
}

.hero-border {
  position: absolute;
  inset: 18px;

  border: 1px solid rgba(173, 136, 80, 0.15);
}

.hero-content {
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 560px;
}

.hero .eyebrow {
  margin-bottom: 35px;
}

.hero-hanja {
  margin: 0 0 20px;

  color: var(--navy);

  font-family: Georgia, serif;
  font-size: clamp(80px, 18vw, 120px);

  line-height: 1;
}

.hero h1 {
  margin: 0;

  color: var(--navy);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: clamp(27px, 6vw, 40px);
  font-weight: 400;
  line-height: 1.65;

  letter-spacing: -0.05em;

  word-break: keep-all;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  margin: 35px 0 24px;
}

.divider span {
  width: 40px;
  height: 1px;

  background: rgba(173, 136, 80, 0.45);
}

.divider i {
  color: var(--gold);

  font-family: Georgia, serif;
  font-size: 12px;
  font-style: normal;
}

.hero-name {
  margin: 0;

  color: #6f685d;

  font-size: 14px;

  letter-spacing: 0.03em;
}

.scroll-guide {
  position: absolute;
  bottom: 28px;
  left: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  transform: translateX(-50%);
}

.scroll-guide span {
  color: #a39987;

  font-family: Georgia, serif;
  font-size: 8px;

  letter-spacing: 0.25em;
}

.scroll-guide i {
  position: relative;

  width: 1px;
  height: 30px;

  overflow: hidden;

  background: #ded6c8;
}

.scroll-guide i::after {
  content: "";

  position: absolute;
  top: -50%;
  left: 0;

  width: 100%;
  height: 50%;

  background: var(--gold);

  animation: scrollMove 1.8s infinite;
}

/* ==========================================
   초대글
========================================== */

.greeting {
  background: #fff;
}

.ornament {
  display: block;

  margin: 30px 0;

  color: var(--gold-light);
}

.greeting-text {
  margin: 0;

  color: var(--sub-text);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: 15px;
  line-height: 2.15;

  word-break: keep-all;
}

/* ==========================================
   80
========================================== */

.age-section {
  padding: 100px 25px;

  background: var(--navy);

  text-align: center;
}

.age-circle {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 220px;
  height: 220px;

  margin: 0 auto;

  border: 1px solid rgba(214, 189, 142, 0.5);

  border-radius: 50%;
}

.age-circle::before {
  content: "";

  position: absolute;
  inset: 8px;

  border: 1px solid rgba(214, 189, 142, 0.15);

  border-radius: 50%;
}

.age-circle span {
  color: rgba(255, 255, 255, 0.5);

  font-family: Georgia, serif;
  font-size: 9px;

  letter-spacing: 0.3em;
}

.age-circle strong {
  margin: 4px 0;

  color: var(--gold-light);

  font-family: Georgia, serif;
  font-size: 88px;
  font-weight: 400;

  line-height: 1;
}

.age-section > p {
  margin: 35px 0 0;

  color: rgba(255, 255, 255, 0.65);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: 14px;
  line-height: 2;
}

/* ==========================================
   날짜
========================================== */

.schedule {
  background: var(--cream);
}

.schedule-card {
  overflow: hidden;

  margin-top: 45px;

  border: 1px solid #e2dacb;

  background: #fff;

  box-shadow: 0 20px 60px rgba(50, 42, 30, 0.06);
}

.date-box {
  padding: 35px 20px;

  background: var(--navy);
}

.date-box span {
  display: block;

  color: rgba(255, 255, 255, 0.5);

  font-family: Georgia, serif;
  font-size: 9px;

  letter-spacing: 0.28em;
}

.date-box strong {
  display: block;

  margin: 7px 0;

  color: var(--gold-light);

  font-family: Georgia, serif;
  font-size: 72px;
  font-weight: 400;

  line-height: 1;
}

.date-info {
  padding: 28px 20px;
}

.date-info p {
  margin: 0 0 8px;

  color: var(--sub-text);

  font-size: 14px;
}

.date-info strong {
  color: var(--navy);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: 20px;
  font-weight: 600;
}

/* ==========================================
   장소
========================================== */

.location {
  background: #fff;
}

.location-card {
  margin-top: 45px;

  padding: 42px 25px;

  border: 1px solid #e9e2d6;

  background: #fcfaf6;
}

.location-pin {
  position: relative;

  width: 44px;
  height: 44px;

  margin: 0 auto 22px;

  border: 1px solid var(--gold);

  border-radius: 50%;
}

.location-pin::before {
  content: "";

  position: absolute;

  top: 9px;
  left: 50%;

  width: 8px;
  height: 8px;

  border: 1px solid var(--gold);

  border-radius: 50%;

  transform: translateX(-50%);
}

.location-pin span {
  position: absolute;

  top: 21px;
  left: 50%;

  width: 1px;
  height: 10px;

  background: var(--gold);

  transform: translateX(-50%);
}

.location-card h3 {
  margin: 0;

  color: var(--navy);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: 23px;
}

.floor {
  margin: 7px 0 0;

  color: var(--gold);

  font-size: 13px;
}

.address {
  margin: 20px 0 0;

  color: var(--sub-text);

  font-size: 13px;
  line-height: 1.8;
}


.map-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-top: 30px;
}

.map-button {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin: 0;
  padding: 15px 12px;

  border: 1px solid var(--navy);

  color: var(--navy);

  font-size: 13px;
  font-weight: 600;

  text-decoration: none;

  width: 100%;
  background: transparent;
  font-family: inherit;
  cursor: pointer;

  transition: 0.25s;
}

.map-button:hover {
  background: var(--navy);

  color: #fff;
}

/* ==========================================
   교통
========================================== */

.traffic {
  background: var(--paper);
}

.traffic-list {
  margin-top: 45px;

  text-align: left;
}

.traffic-item {
  display: grid;
  grid-template-columns: 40px 1fr;

  gap: 20px;

  padding: 24px 0;

  border-bottom: 1px solid rgba(173, 136, 80, 0.17);
}

.traffic-item:first-child {
  border-top: 1px solid rgba(173, 136, 80, 0.17);
}

.number {
  padding-top: 2px;

  color: var(--gold);

  font-family: Georgia, serif;
  font-size: 11px;
}

.traffic-item strong {
  display: block;

  margin-bottom: 8px;

  color: var(--navy);

  font-size: 15px;
}

.traffic-item p {
  margin: 0;

  color: var(--sub-text);

  font-size: 13px;
  line-height: 1.8;

  word-break: keep-all;
}


.parking-address {
  margin-top: 5px !important;

  color: #8a8479 !important;
  font-size: 12px !important;
}

.traffic-map-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-top: 13px;
}

.traffic-map-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 112px;
  padding: 9px 12px;

  border: 1px solid rgba(23, 35, 53, 0.45);
  border-radius: 2px;

  color: var(--navy);

  width: 100%;

  font-size: 12px;
  font-weight: 600;
  text-decoration: none;

  background: transparent;
  font-family: inherit;
  cursor: pointer;

  transition: 0.2s;
}

.traffic-map-button:hover {
  background: var(--navy);
  color: #fff;
}


/* ==========================================
   네이버 지도 안내 팝업
========================================== */

.naver-notice {
  position: fixed;
  z-index: 9999;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background: rgba(10, 18, 28, 0.55);
  backdrop-filter: blur(4px);

  animation: noticeBackdropIn 0.2s ease;
}

.naver-notice-card {
  width: min(100%, 360px);

  padding: 32px 24px 22px;

  border: 1px solid rgba(173, 136, 80, 0.25);
  border-radius: 12px;

  background: #fff;

  box-shadow: 0 24px 70px rgba(10, 18, 28, 0.2);

  text-align: center;

  animation: noticeCardIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.naver-notice-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 46px;
  height: 46px;

  margin: 0 auto 18px;

  border-radius: 50%;

  background: #03c75a;
  color: #fff;

  font-family: Arial, sans-serif;
  font-size: 22px;
  font-weight: 800;
}

.naver-notice-card h3 {
  margin: 0;

  color: var(--navy);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: 19px;
  font-weight: 600;
}

.naver-notice-card p {
  margin: 14px 0 0;

  color: var(--sub-text);

  font-size: 13px;
  line-height: 1.8;

  word-break: keep-all;
}

.naver-notice-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  margin-top: 25px;
}

.naver-notice-actions button {
  height: 46px;

  border-radius: 4px;

  font-family: inherit;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
}

.naver-notice-cancel {
  border: 1px solid #dedbd4;

  background: #fff;
  color: #77736b;
}

.naver-notice-confirm {
  border: 1px solid var(--navy);

  background: var(--navy);
  color: #fff;
}

@keyframes noticeBackdropIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes noticeCardIn {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ==========================================
   마지막
========================================== */

.closing {
  padding: 110px 25px 90px;

  background: var(--navy-deep);

  text-align: center;
}

.closing-symbol {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 62px;
  height: 62px;

  margin: 0 auto 38px;

  border: 1px solid var(--gold);

  color: var(--gold-light);

  font-family: Georgia, serif;
  font-size: 26px;
}

.closing p {
  margin: 0;

  color: rgba(255, 255, 255, 0.6);

  font-family:
    "Noto Serif KR",
    serif;

  font-size: 14px;
  line-height: 2;
}

.closing strong {
  display: block;

  margin-top: 25px;

  color: #f4ead7;

  font-family:
    "Noto Serif KR",
    serif;

  font-size: 16px;
  font-weight: 500;
}

.closing-line {
  display: block;

  width: 1px;
  height: 35px;

  margin: 38px auto 24px;

  background: linear-gradient(
    var(--gold),
    transparent
  );
}

.closing small {
  color: rgba(214, 189, 142, 0.5);

  font-family: Georgia, serif;
  font-size: 8px;

  letter-spacing: 0.35em;
}


/* ==========================================
   HERO INTRO ANIMATION
========================================== */

.hero-animate {
  opacity: 0;
  transform: translateY(24px);
  animation: heroReveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-animate--1 { animation-delay: 0.1s; }
.hero-animate--2 { animation-delay: 0.28s; }
.hero-animate--3 { animation-delay: 0.5s; }
.hero-animate--4 { animation-delay: 0.72s; }
.hero-animate--5 { animation-delay: 0.9s; }

/* ==========================================
   SCROLL REVEAL ANIMATION
========================================== */

.reveal {
  opacity: 0;
  will-change: opacity, transform;
  transition:
    opacity 0.75s ease,
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal-up {
  transform: translateY(52px);
}

.reveal-scale {
  transform: scale(0.82);
}

.reveal-delay-1 {
  transition-delay: 0.12s;
}

.reveal-delay-2 {
  transition-delay: 0.24s;
}

.reveal.reveal--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.age-circle.reveal--visible {
  animation: ageBreath 3.8s ease-in-out 0.9s infinite;
}

.map-button,
.traffic-map-button {
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.map-button:hover,
.traffic-map-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(23, 35, 53, 0.12);
}

.map-button:active,
.traffic-map-button:active {
  transform: scale(0.98);
}

@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ageBreath {
  0%,
  100% {
    box-shadow: 0 0 0 rgba(214, 189, 142, 0);
  }

  50% {
    box-shadow: 0 0 42px rgba(214, 189, 142, 0.13);
  }
}

/* ==========================================
   animation
========================================== */

@keyframes pageFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scrollMove {
  from {
    top: -50%;
  }

  to {
    top: 100%;
  }
}

/* ==========================================
   mobile
========================================== */

@media (max-width: 600px) {
  .section {
    padding: 85px 24px;
  }

  .hero {
    height: 100vh;
    height: 100svh;
    min-height: 100svh;

    padding:
      max(30px, env(safe-area-inset-top))
      22px
      max(42px, env(safe-area-inset-bottom));
  }

  .hero-border {
    inset: 10px;
  }

  .hero-hanja {
    margin-bottom: clamp(12px, 2.5svh, 20px);
    font-size: clamp(68px, 20vw, 88px);
  }

  .hero h1 {
    font-size: clamp(22px, 6.8vw, 27px);
    line-height: 1.55;
  }

  .greeting-text {
    font-size: 14px;
  }

  .age-circle {
    width: 190px;
    height: 190px;
  }

  .age-circle strong {
    font-size: 75px;
  }

}

/* ==========================================
   HERO - 작은 화면 높이 대응
========================================== */

@media (max-width: 600px) and (max-height: 740px) {
  .hero .eyebrow {
    margin-bottom: 22px;
  }

  .hero-hanja {
    margin-bottom: 10px;
    font-size: clamp(60px, 17vw, 74px);
  }

  .hero h1 {
    font-size: clamp(20px, 5.8vw, 24px);
    line-height: 1.45;
  }

  .divider {
    margin: 22px 0 16px;
  }

  .hero-name {
    font-size: 13px;
  }

  .scroll-guide {
    bottom: max(14px, env(safe-area-inset-bottom));
  }

  .scroll-guide i {
    height: 22px;
  }
}

@media (max-width: 600px) and (max-height: 620px) {
  .hero {
    padding-top: max(18px, env(safe-area-inset-top));
    padding-bottom: max(32px, env(safe-area-inset-bottom));
  }

  .hero .eyebrow {
    margin-bottom: 14px;
  }

  .hero-hanja {
    font-size: 56px;
  }

  .hero h1 {
    font-size: 19px;
    line-height: 1.4;
  }

  .divider {
    margin: 16px 0 12px;
  }

  .scroll-guide span {
    display: none;
  }

  .scroll-guide {
    gap: 0;
  }
}
</style>