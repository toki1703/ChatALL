<template>

  <div class="text-center">
     <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="top"
      scroll-strategy="block"
      offset="12"
      > <template v-slot:activator="{ props }"
        > <v-btn
          v-bind="props"
          size="36"
          color="primary"
          flat
          icon="mdi-dots-horizontal"
          > </v-btn
        > </template
      > <v-card
        > <v-list
          class="bots-list-container"
          density="compact"
          :selected="favorited"
          select-strategy="classic"
          nav
          > <template v-for="group in groupedBots" :key="group.brand"
            > <v-list-subheader class="provider-header"
              > {{ group.brand }} </v-list-subheader
            >
            <div class="bots-list">
               <v-list-item
                v-for="bot in group.bots"
                :key="bot.getClassname()"
                :value="bot.getClassname()"
                color="primary"
                @click="toggleFavorite(bot)"
                > <template v-slot:prepend="{ isActive }"
                  > <v-list-item-action start
                    > <v-checkbox-btn
                      color="primary"
                      :model-value="isActive"
                    ></v-checkbox-btn
                    > </v-list-item-action
                  > </template
                > <v-list-item-title
                  > <BotLogo :bot="bot" active="true" size="24"></BotLogo>&nbsp;
                  <span>{{ bot.getFullname() }}</span
                  > </v-list-item-title
                > </v-list-item
              >
            </div>
             </template
          > </v-list
        > <v-divider></v-divider> <v-list
          > <v-list-item
            > <v-list-item-title class="font-weight-black"
              > {{ $t("footer.chooseFavorite") }} </v-list-item-title
            > <template v-slot:append
              > <v-btn-toggle
                v-model="selectedTags"
                divided
                color="primary"
                group
                variant="outlined"
                rounded="xl"
                > <v-btn v-for="(tag, index) in tags" :key="index" :value="tag"
                  > {{ $t(`footer.${tag}`) }} </v-btn
                > </v-btn-toggle
              > </template
            > </v-list-item
          > </v-list
        > </v-card
      > </v-menu
    >
  </div>

</template>

<script setup>
import { computed, ref } from "vue";

import bots from "@/bots";
import { botTags } from "@/bots";
import BotLogo from "./BotLogo.vue";
import store from "@/store";

let menu = ref(false);

const props = defineProps(["favBots"]);
const favorited = computed(() => {
  return props.favBots.map((bot) => bot.classname);
});

const tags = Object.keys(botTags);
const selectedTags = ref([]);

// Bots that are neither disabled at the class level nor belong to a provider
// the user has switched off in the settings.
const availableBots = computed(() =>
  bots.all.filter(
    (bot) =>
      !bot.isDisabled() &&
      !store.state.disabledProviders.includes(bot.getBrandId()),
  ),
);

// The tag toggle is single-select, so the value can be a string or empty.
const activeTags = computed(() => {
  const selected = selectedTags.value;
  if (!selected) return [];
  return Array.isArray(selected) ? selected : [selected];
});

const shownBots = computed(() => {
  const tagBotLists = activeTags.value.map((tag) => botTags[tag]);
  if (!tagBotLists.length) return availableBots.value;
  return availableBots.value.filter((bot) =>
    tagBotLists.every((tagBots) => tagBots.includes(bot)),
  );
});

// Group the shown bots into provider sections, keyed by the localized brand
// name. Groups appear in the order their first bot shows up in shownBots.
const groupedBots = computed(() => {
  const groups = [];
  const byBrand = new Map();
  for (const bot of shownBots.value) {
    const brand = bot.getBrandName();
    let group = byBrand.get(brand);
    if (!group) {
      group = { brand, bots: [] };
      byBrand.set(brand, group);
      groups.push(group);
    }
    group.bots.push(bot);
  }
  return groups;
});

const toggleFavorite = (bot) => {
  const classname = bot.getClassname();
  if (favorited.value.includes(classname)) {
    store.commit("removeFavoriteBot", classname);
  } else {
    store.commit("addFavoriteBot", classname);
  }
};

function toggleMenu() {
  menu.value = !menu.value;
}

defineExpose({
  toggleMenu,
});
</script>

<style>
/* Provider section header spans the full menu width. */
.provider-header {
  padding-inline: 8px;
  font-weight: 700;
  opacity: 0.9;
}

/* Bots within a provider section are laid out in compact columns. */
.bots-list {
  column-count: 3;
}

/* Keep the orignal case of tab names */
.v-btn {
  text-transform: none !important;
}
</style>

