<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="header">
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <main class="main">
    <RouterView />
  </main>
  <footer class="footer">
      footer
  </footer>
</template>

<style scoped lang="scss">
  .header {
      grid-area: header;
      background-color: purple;
      position:fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      height:5rem;
  }

  .main {
      grid-area: main;
      background-color: green;
  }

  .footer{
      grid-area: footer;
      background-color: red;
  }
</style>
