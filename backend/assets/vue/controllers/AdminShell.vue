<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { applyBrandTokens, bootstrapBrandConfig, resolveBrandConfig } from '../config/brand.js';
import { useTheme } from '../composables/theme.js';
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
    brand: { type: Object, default: null },
    config: { type: Object, default: null },
    logoutUrl: { type: String, default: '' },
    logoutCsrfToken: { type: String, default: '' },
    navigation: { type: Array, default: () => [] },
    userName: { type: String, default: '' },
    title: { type: String, default: 'Administration' },
});
const brand = computed(() => resolveBrandConfig(props.brand || props.config || bootstrapBrandConfig()));
const navigation = computed(() => props.navigation.length ? props.navigation : [{ label: 'Overview', href: '/admin' }]);
const menuOpen = ref(false);
const isMobile = ref(globalThis.matchMedia?.('(max-width: 48rem)')?.matches ?? false);
const sidebar = ref(null);
const menuToggle = ref(null);
const { preference, setPreference } = useTheme();
const themeLabel = computed(() => preference.value === 'system' ? 'System theme' : `Use ${preference.value} theme`);
const drawerHidden = computed(() => isMobile.value && !menuOpen.value);
let mobileMediaQuery;
watch(brand, applyBrandTokens, { immediate: true });

function focusMenuToggle() {
    nextTick(() => menuToggle.value?.focus());
}

function openMenu() {
    menuOpen.value = true;
    if (isMobile.value) {
        nextTick(() => sidebar.value?.querySelector('a')?.focus());
    }
}

function closeMenu(restoreFocus = true) {
    if (!menuOpen.value) return;
    menuOpen.value = false;
    if (restoreFocus) focusMenuToggle();
}

function toggleMenu() {
    menuOpen.value ? closeMenu() : openMenu();
}

function updateMobileState(event) {
    isMobile.value = event.matches;
    if (!isMobile.value) menuOpen.value = false;
}

onMounted(() => {
    mobileMediaQuery = globalThis.matchMedia?.('(max-width: 48rem)');
    if (mobileMediaQuery) {
        isMobile.value = mobileMediaQuery.matches;
        mobileMediaQuery.addEventListener?.('change', updateMobileState);
    }
});

onBeforeUnmount(() => mobileMediaQuery?.removeEventListener?.('change', updateMobileState));
</script>

<template>
  <div
    class="admin-shell"
    @keydown.esc="closeMenu()"
  >
    <header class="admin-header">
      <button
        ref="menuToggle"
        type="button"
        class="admin-menu-toggle"
        :aria-expanded="menuOpen"
        aria-controls="admin-navigation"
        @click="toggleMenu"
      >
        <span class="ui-visually-hidden">Toggle navigation</span>☰
      </button><a
        class="admin-brand"
        href="/admin"
      ><img
        v-if="brand.logo"
        :src="brand.logo"
        :alt="brand.logoAlt"
      ><span
        v-else
        class="admin-brand__mark"
        aria-hidden="true"
      >{{ brand.name.charAt(0) }}</span><span>{{ brand.name }}</span></a><div class="admin-header__actions">
        <span
          v-if="userName"
          class="admin-user"
        >{{ userName }}</span><UiButton
          variant="ghost"
          :aria-label="themeLabel"
          @click="setPreference(preference === 'light' ? 'dark' : preference === 'dark' ? 'system' : 'light')"
        >
          {{ preference === 'system' ? '◐' : preference === 'dark' ? '☾' : '☀' }}
        </UiButton><form
          v-if="logoutUrl"
          method="post"
          :action="logoutUrl"
        >
          <input
            v-if="logoutCsrfToken"
            type="hidden"
            name="_csrf_token"
            :value="logoutCsrfToken"
          ><UiButton
            variant="secondary"
            type="submit"
          >
            Log out
          </UiButton>
        </form>
      </div>
    </header>
    <aside
      id="admin-navigation"
      ref="sidebar"
      class="admin-sidebar"
      :class="{ 'admin-sidebar--open': menuOpen }"
      :aria-hidden="drawerHidden"
      :inert="drawerHidden"
    >
      <nav aria-label="Primary navigation">
        <a
          v-for="item in navigation"
          :key="item.href || item.label"
          :href="item.href"
          @click="closeMenu(false)"
        >{{ item.label }}</a>
      </nav>
    </aside>
    <main
      id="main-content"
      class="admin-main"
    >
      <div class="admin-main__inner">
        <header class="admin-main__title">
          <h1>{{ title }}</h1><slot name="actions" />
        </header><slot />
      </div>
    </main>
    <div
      v-if="menuOpen"
      class="admin-overlay"
      aria-hidden="true"
      @click="closeMenu()"
    />
  </div>
</template>
