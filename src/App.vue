<script setup>
import { ref } from 'vue';

import IntroScreen from '@/components/IntroScreen.vue';
import InvitationPage from '@/components/InvitationPage.vue';

const showInvitation = ref(false);

function handleIntroComplete() {
  showInvitation.value = true;
}
</script>

<template>
  <IntroScreen
    v-if="!showInvitation"
    @complete="handleIntroComplete"
  />

  <InvitationPage v-else />
</template>