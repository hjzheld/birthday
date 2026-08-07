<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits(['complete']);

const introText = `소중한 분들을
공재권님의 산수연에
초대합니다`;

const displayedText = ref('');
const isLeaving = ref(false);

let typingTimer = null;
let leaveTimer = null;
let completeTimer = null;

function startTyping() {
  const chars = [...introText];
  let index = 0;

  typingTimer = setInterval(() => {
    displayedText.value += chars[index];
    index += 1;

    if (index >= chars.length) {
      clearInterval(typingTimer);

      leaveTimer = setTimeout(() => {
        isLeaving.value = true;

        completeTimer = setTimeout(() => {
          emit('complete');
        }, 700);
      }, 1200);
    }
  }, 110);
}

onMounted(() => {
  startTyping();
});

onBeforeUnmount(() => {
  clearInterval(typingTimer);
  clearTimeout(leaveTimer);
  clearTimeout(completeTimer);
});
</script>

<template>
  <section
    class="intro-screen"
    :class="{ 'intro-screen--leaving': isLeaving }"
  >
    <div class="intro-border"></div>

    <div class="intro-decoration intro-decoration--top"></div>
    <div class="intro-decoration intro-decoration--bottom"></div>

    <div class="intro-content">
      <p class="intro-hanja">
        八旬宴
      </p>

      <span class="intro-line"></span>

      <h1 class="intro-title">
        {{ displayedText }}<span class="cursor"></span>
      </h1>

      <p class="intro-sub">
        여든 해의 귀한 시간을 함께 축하해주세요
      </p>
    </div>
  </section>
</template>

<style scoped>
.intro-screen {
  position: fixed;
  z-index: 1000;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  padding: 30px;

  background:
    radial-gradient(
      circle at 50% 45%,
      rgba(255, 255, 255, 0.05),
      transparent 40%
    ),
    #111d2c;

  color: #fff;

  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.intro-screen--leaving {
  opacity: 0;
  transform: scale(1.03);
}

.intro-border {
  position: absolute;
  inset: 14px;

  border: 1px solid rgba(215, 190, 140, 0.2);

  pointer-events: none;
}

.intro-content {
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 600px;

  text-align: center;
}

.intro-hanja {
  margin: 0 0 24px;

  color: #d6bd8e;

  font-family: Georgia, serif;
  font-size: 18px;

  letter-spacing: 0.5em;
}

.intro-line {
  display: block;

  width: 1px;
  height: 44px;

  margin: 0 auto 36px;

  background: linear-gradient(
    to bottom,
    #b18c52,
    transparent
  );
}

.intro-title {
  min-height: 160px;

  margin: 0;

  color: #fff;

  white-space: pre-line;

  font-family:
    "Noto Serif KR",
    serif;

  font-size: clamp(26px, 6vw, 40px);
  font-weight: 400;
  line-height: 1.8;

  letter-spacing: -0.04em;

  word-break: keep-all;
}

.cursor {
  display: inline-block;

  width: 1px;
  height: 1em;

  margin-left: 4px;

  vertical-align: -2px;

  background: #d6bd8e;

  animation: blink 0.8s infinite;
}

.intro-sub {
  margin: 36px 0 0;

  color: rgba(255, 255, 255, 0.5);

  font-size: 13px;
  font-weight: 300;

  letter-spacing: 0.03em;
}

.intro-decoration {
  position: absolute;

  width: 240px;
  height: 240px;

  border: 1px solid rgba(215, 190, 140, 0.12);

  border-radius: 50%;
}

.intro-decoration::before {
  content: "";

  position: absolute;
  inset: 30px;

  border: 1px solid rgba(215, 190, 140, 0.1);

  border-radius: 50%;
}

.intro-decoration--top {
  top: -150px;
  right: -110px;
}

.intro-decoration--bottom {
  bottom: -160px;
  left: -100px;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

@media (max-width: 600px) {
  .intro-screen {
    padding: 24px;
  }

  .intro-border {
    inset: 10px;
  }

  .intro-title {
    min-height: 145px;

    font-size: 26px;
  }

  .intro-sub {
    font-size: 12px;
  }
}
</style>