<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="header-wrapper">
    <div class="header">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <main class="main">
      <Suspense>
          <RouterView />
          <template #fallback>
              Loading...
          </template>
      </Suspense>
  </main>
  <footer class="footer-wrapper">
      <div class="footer">
         footer
      </div>
  </footer>
</template>

<style scoped lang="scss">
  .header-wrapper {
      grid-area: header;
      background-color: purple;
      position:fixed;
      top: 0;
      left: 0;
      z-index: 10;
      height:5rem;
      width: 100%;
      &>.header {
        width: 1200px;
        max-width: 1200px;
        margin: 0 auto;
      }
  }

  .main {
      grid-area: main;
      min-height: 100vh;
      width: 75rem;
  }

  .footer-wrapper{
      grid-area: footer;
      background-color: red;
      width: 100%;
      position:absolute;
      left: 0;
      bottom: 0;
      &>.footer {
        width: 1200px;
        max-width: 1200px;
        margin: 0 auto;
      }
  }
</style>
