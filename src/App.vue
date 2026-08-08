<script setup>
import {
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue';

import IntroScreen from '@/components/IntroScreen.vue';
import InvitationPage from '@/components/InvitationPage.vue';


const showInvitation = ref(false);


// ==========================================
// 배경음악
// ==========================================

const audioRef = ref(null);
const isMusicPlaying = ref(false);


// public/audio/wedding-piano.mp3
const bgmUrl =
  `${import.meta.env.BASE_URL}audio/wedding-piano.mp3`;


// 자동재생이 막혔을 때
// 첫 사용자 터치를 감지하기 위한 이벤트
let musicUnlockHandler = null;


// ==========================================
// 음악 상태 동기화
// ==========================================

function handleAudioPlay() {
  isMusicPlaying.value = true;
}


function handleAudioPause() {
  isMusicPlaying.value = false;
}


// ==========================================
// 첫 사용자 동작 감지
// ==========================================

function waitForFirstInteraction() {
  if (musicUnlockHandler) return;


  musicUnlockHandler = async (event) => {
    /*
      음악 버튼을 직접 누른 경우에는
      toggleMusic()에서 처리

      pointerdown → play
      click → pause

      이런 중복 동작 방지
    */
    if (event.target?.closest?.('.music-button')) {
      return;
    }


    if (!audioRef.value) return;


    try {
      audioRef.value.volume = 0.25;


      await audioRef.value.play();


      isMusicPlaying.value = true;


      removeMusicUnlock();
    } catch (error) {
      console.log(
        '첫 사용자 동작에서도 음악 재생이 제한되었습니다.'
      );
    }
  };


  /*
    인트로 화면을 처음 터치하는 순간에도
    음악 재생 가능
  */
  document.addEventListener(
    'pointerdown',
    musicUnlockHandler,
    {
      passive: true,
    }
  );
}


// ==========================================
// 첫 사용자 동작 이벤트 제거
// ==========================================

function removeMusicUnlock() {
  if (!musicUnlockHandler) return;


  document.removeEventListener(
    'pointerdown',
    musicUnlockHandler
  );


  musicUnlockHandler = null;
}


// ==========================================
// 음악 재생
// ==========================================

async function playMusic() {
  if (!audioRef.value) return;


  try {
    // 배경음악이므로 작게
    audioRef.value.volume = 0.25;


    await audioRef.value.play();


    isMusicPlaying.value = true;


    removeMusicUnlock();
  } catch (error) {
    /*
      카카오톡 / Safari / Chrome 등에서
      자동재생을 막은 경우

      → 첫 화면 터치를 기다림
    */

    isMusicPlaying.value = false;


    waitForFirstInteraction();


    console.log(
      '자동재생이 제한되어 첫 화면 터치를 기다립니다.'
    );
  }
}


// ==========================================
// 음악 정지
// ==========================================

function pauseMusic() {
  if (!audioRef.value) return;


  audioRef.value.pause();


  isMusicPlaying.value = false;


  /*
    사용자가 직접 끈 경우
    다음 화면 터치에서 다시 자동으로
    켜지지 않도록 이벤트 제거
  */
  removeMusicUnlock();
}


// ==========================================
// 음악 ON / OFF
// ==========================================

async function toggleMusic() {
  if (!audioRef.value) return;


  if (isMusicPlaying.value) {
    pauseMusic();

    return;
  }


  await playMusic();
}


// ==========================================
// INTRO 완료
// ==========================================

function handleIntroComplete() {
  /*
    음악은 건드리지 않음.

    Intro에서 재생 중이었다면
    InvitationPage에서도 그대로 이어짐.
  */

  showInvitation.value = true;
}


// ==========================================
// 최초 페이지 진입
// ==========================================

onMounted(async () => {
  await nextTick();


  /*
    페이지에 처음 들어온 순간
    바로 음악 자동재생 시도
  */
  await playMusic();
});


// ==========================================
// 컴포넌트 종료
// ==========================================

onBeforeUnmount(() => {
  removeMusicUnlock();


  if (!audioRef.value) return;


  audioRef.value.pause();
});
</script>


<template>
  <!-- ==========================================
       배경음악
  =========================================== -->

  <audio
    ref="audioRef"
    :src="bgmUrl"
    loop
    autoplay
    preload="auto"
    playsinline
    @play="handleAudioPlay"
    @pause="handleAudioPause"
  />


  <!-- ==========================================
       INTRO
  =========================================== -->

  <IntroScreen
    v-if="!showInvitation"
    @complete="handleIntroComplete"
  />


  <!-- ==========================================
       초대장
  =========================================== -->

  <InvitationPage v-else />


  <!-- ==========================================
       음악 플로팅 버튼

       ★ Intro부터 계속 노출
  =========================================== -->

  <button
    type="button"
    class="music-button"
    :class="{
      'music-button--intro': !showInvitation,
      'music-button--playing': isMusicPlaying,
      'music-button--paused': !isMusicPlaying,
    }"
    :aria-label="
      isMusicPlaying
        ? '배경음악 끄기'
        : '배경음악 켜기'
    "
    @click="toggleMusic"
  >
    <!-- 재생 중 -->

    <span
      v-if="isMusicPlaying"
      class="music-icon music-icon--playing"
    >
      ♫
    </span>


    <!-- 정지 중 -->

    <span
      v-else
      class="music-icon music-icon--paused"
    >
      ♫
    </span>


    <!-- PC HOVER -->

    <span class="music-tooltip">
      {{
        isMusicPlaying
          ? '음악 끄기'
          : '음악 켜기'
      }}
    </span>
  </button>
</template>


<style scoped>
/* ==========================================
   음악 플로팅 버튼 공통
========================================== */

.music-button {
  position: fixed;
  z-index: 10000;

  right: max(
    20px,
    env(safe-area-inset-right)
  );

  bottom: max(
    24px,
    calc(env(safe-area-inset-bottom) + 16px)
  );

  display: flex;
  align-items: center;
  justify-content: center;

  width: 52px;
  height: 52px;

  margin: 0;
  padding: 0;

  border-radius: 50%;

  font-family: Georgia, serif;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.3s ease;
}


/* ==========================================
   초대장 본문
   음악 OFF
   = 네이비
========================================== */

.music-button--paused {
  border: 1px solid #ad8850;

  background: #172335;

  color: #d6bd8e;

  box-shadow:
    0 8px 25px rgba(16, 26, 40, 0.22),
    0 0 0 5px rgba(173, 136, 80, 0.08);
}


/* ==========================================
   음악 OFF 사선
========================================== */

.music-button--paused::after {
  content: "";

  position: absolute;
  z-index: 3;

  width: 23px;
  height: 1px;

  background: currentColor;

  opacity: 0.75;

  transform: rotate(-45deg);

  pointer-events: none;
}


/* ==========================================
   초대장 본문
   음악 ON
   = 밝은 크림
========================================== */

.music-button--playing {
  border: 1px solid rgba(173, 136, 80, 0.6);

  background: rgba(248, 245, 238, 0.97);

  color: #ad8850;

  box-shadow:
    0 7px 24px rgba(16, 26, 40, 0.13),
    0 0 0 5px rgba(173, 136, 80, 0.06);

  animation:
    musicButtonBreathLight
    2.6s
    ease-in-out
    infinite;
}


/* ==========================================
   음악 아이콘
========================================== */

.music-icon {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  font-size: 21px;
  line-height: 1;

  pointer-events: none;

  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    color 0.3s ease;
}


/* 음악 켜짐 */

.music-icon--playing {
  opacity: 1;

  animation:
    musicNoteMove
    1.7s
    ease-in-out
    infinite;
}


/* 음악 꺼짐 */

.music-icon--paused {
  opacity: 0.75;
}


/* ==========================================
   일반 초대장 화면 HOVER
========================================== */

.music-button:hover {
  transform:
    translateY(-3px)
    scale(1.06);
}


/* 음악 OFF hover */

.music-button--paused:hover {
  border-color: #d6bd8e;

  background: #101a28;

  color: #f0dfbc;

  box-shadow:
    0 12px 32px rgba(16, 26, 40, 0.27),
    0 0 0 7px rgba(173, 136, 80, 0.1);
}


/* 음악 ON hover */

.music-button--playing:hover {
  border-color: #ad8850;

  background: #ffffff;

  color: #8f6d3d;

  box-shadow:
    0 10px 28px rgba(16, 26, 40, 0.16),
    0 0 0 7px rgba(173, 136, 80, 0.08);
}


/* ==========================================
   INTRO 화면 공통
========================================== */

.music-button--intro {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}


/* ==========================================
   INTRO
   음악 OFF
   = 밝은 크림
========================================== */

.music-button--intro.music-button--paused {
  border: 1px solid rgba(173, 136, 80, 0.58);

  background: rgba(248, 245, 238, 0.97);

  color: #ad8850;

  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.14),
    0 0 0 5px rgba(214, 189, 142, 0.08);
}


/* ==========================================
   INTRO
   음악 ON
   = 네이비
========================================== */

.music-button--intro.music-button--playing {
  border: 1px solid #ad8850;

  background: #172335;

  color: #d6bd8e;

  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.22),
    0 0 0 5px rgba(214, 189, 142, 0.09);

  animation:
    musicButtonBreathDark
    2.6s
    ease-in-out
    infinite;
}


/* ==========================================
   INTRO HOVER
========================================== */

/* Intro 음악 OFF hover */

.music-button--intro.music-button--paused:hover {
  border-color: #ad8850;

  background: #ffffff;

  color: #8f6d3d;

  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.19),
    0 0 0 7px rgba(214, 189, 142, 0.09);
}


/* Intro 음악 ON hover */

.music-button--intro.music-button--playing:hover {
  border-color: #d6bd8e;

  background: #101a28;

  color: #f0dfbc;

  box-shadow:
    0 12px 34px rgba(0, 0, 0, 0.28),
    0 0 0 7px rgba(214, 189, 142, 0.12);
}


/* ==========================================
   클릭
========================================== */

.music-button:active {
  transform: scale(0.92);
}


/* ==========================================
   TOOLTIP
========================================== */

.music-tooltip {
  position: absolute;

  top: 50%;
  right: calc(100% + 11px);

  display: block;

  width: max-content;

  padding: 7px 10px;

  border: 1px solid rgba(173, 136, 80, 0.15);
  border-radius: 4px;

  background: rgba(16, 26, 40, 0.92);

  color: #ffffff;

  font-family:
    Pretendard,
    "Noto Sans KR",
    sans-serif;

  font-size: 11px;
  font-weight: 500;

  letter-spacing: -0.02em;

  opacity: 0;

  pointer-events: none;

  transform:
    translateY(-50%)
    translateX(5px);

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}


/* HOVER 시 툴팁 */

.music-button:hover .music-tooltip {
  opacity: 1;

  transform:
    translateY(-50%)
    translateX(0);
}


/* ==========================================
   INTRO TOOLTIP
========================================== */

.music-button--intro .music-tooltip {
  border-color: rgba(214, 189, 142, 0.3);

  background: rgba(248, 245, 238, 0.97);

  color: #172335;

  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.15);
}


/* ==========================================
   ANIMATION
========================================== */

/*
  초대장 본문
  음악 ON = 밝은 크림
*/

@keyframes musicButtonBreathLight {
  0%,
  100% {
    box-shadow:
      0 7px 24px rgba(16, 26, 40, 0.13),
      0 0 0 4px rgba(173, 136, 80, 0.05);
  }

  50% {
    box-shadow:
      0 8px 28px rgba(16, 26, 40, 0.15),
      0 0 0 8px rgba(173, 136, 80, 0.1);
  }
}


/*
  Intro
  음악 ON = 네이비
*/

@keyframes musicButtonBreathDark {
  0%,
  100% {
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.22),
      0 0 0 4px rgba(214, 189, 142, 0.06);
  }

  50% {
    box-shadow:
      0 9px 32px rgba(0, 0, 0, 0.25),
      0 0 0 8px rgba(214, 189, 142, 0.13);
  }
}


/* 음표 움직임 */

@keyframes musicNoteMove {
  0%,
  100% {
    transform:
      translateY(0)
      rotate(0deg);
  }

  50% {
    transform:
      translateY(-2px)
      rotate(7deg);
  }
}


/* ==========================================
   모바일
========================================== */

@media (max-width: 600px) {
  .music-button {
    right: 16px;

    bottom: max(
      22px,
      calc(env(safe-area-inset-bottom) + 16px)
    );

    width: 48px;
    height: 48px;
  }


  .music-icon {
    font-size: 19px;
  }


  /*
    Intro에서도 동일하게 우측 하단.

    카카오 하단바 / safe-area 때문에
    너무 아래 붙지 않도록 약간 여유
  */

  .music-button--intro {
    right: 16px;

    bottom: max(
      24px,
      calc(env(safe-area-inset-bottom) + 18px)
    );
  }


  /*
    모바일에서는 hover가 없으므로
    tooltip 표시 X
  */

  .music-tooltip {
    display: none;
  }
}


/* ==========================================
   터치 기기
   HOVER 상태가 남는 현상 방지
========================================== */

@media (hover: none) {
  .music-button:hover {
    transform: none;
  }


  /* ========================================
     초대장 본문 OFF
     네이비
  ======================================== */

  .music-button--paused:hover {
    border-color: #ad8850;

    background: #172335;

    color: #d6bd8e;

    box-shadow:
      0 8px 25px rgba(16, 26, 40, 0.22),
      0 0 0 5px rgba(173, 136, 80, 0.08);
  }


  /* ========================================
     초대장 본문 ON
     크림
  ======================================== */

  .music-button--playing:hover {
    border-color: rgba(173, 136, 80, 0.6);

    background: rgba(248, 245, 238, 0.97);

    color: #ad8850;

    box-shadow:
      0 7px 24px rgba(16, 26, 40, 0.13),
      0 0 0 5px rgba(173, 136, 80, 0.06);
  }


  /* ========================================
     INTRO OFF
     크림
  ======================================== */

  .music-button--intro.music-button--paused:hover {
    border-color: rgba(173, 136, 80, 0.58);

    background: rgba(248, 245, 238, 0.97);

    color: #ad8850;

    box-shadow:
      0 8px 28px rgba(0, 0, 0, 0.14),
      0 0 0 5px rgba(214, 189, 142, 0.08);
  }


  /* ========================================
     INTRO ON
     네이비
  ======================================== */

  .music-button--intro.music-button--playing:hover {
    border-color: #ad8850;

    background: #172335;

    color: #d6bd8e;

    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.22),
      0 0 0 5px rgba(214, 189, 142, 0.09);
  }


  /* 터치 순간 */

  .music-button:active {
    transform: scale(0.9);
  }
}


/* ==========================================
   접근성
========================================== */

@media (prefers-reduced-motion: reduce) {
  .music-button--playing,
  .music-icon--playing {
    animation: none;
  }
}
</style>