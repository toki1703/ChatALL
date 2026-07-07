<template>
   <v-list
    > <v-list-item
      > <v-list-item-subtitle
        > {{ $t("settings.providersPrompt") }} </v-list-item-subtitle
      > </v-list-item
    > <v-list-item v-for="provider in providers" :key="provider.brandId"
      > <v-list-item-title>{{ provider.name }}</v-list-item-title
      > <v-list-item-subtitle
        > {{ $t("settings.providerModelCount", { count: provider.count }) }}
        </v-list-item-subtitle
      > <template v-slot:append
        > <v-switch
          color="primary"
          hide-details
          :model-value="isEnabled(provider.brandId)"
          @update:model-value="setEnabled(provider.brandId, $event)"
        ></v-switch
        > </template
      > </v-list-item
    > </v-list
  >
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

import bots from "@/bots";

const store = useStore();

// One entry per distinct provider (brand id), sorted by localized name.
const providers = computed(() => {
  const byBrand = new Map();
  for (const bot of bots.all) {
    const brandId = bot.getBrandId();
    // Skip the development-only bot.
    if (brandId === "dev") continue;
    const entry = byBrand.get(brandId);
    if (entry) {
      entry.count += 1;
    } else {
      byBrand.set(brandId, {
        brandId,
        name: bot.getBrandName(),
        count: 1,
      });
    }
  }
  return [...byBrand.values()].sort((a, b) => a.name.localeCompare(b.name));
});

function isEnabled(brandId) {
  return !store.state.disabledProviders.includes(brandId);
}

function setEnabled(brandId, enabled) {
  store.commit("setProviderEnabled", { brandId, enabled });
}
</script>

