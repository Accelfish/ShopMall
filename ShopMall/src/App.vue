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
      <div class="wrapper">
         footer
      </div>
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
      &>.wrapper {
        margin: 0 auto;
        max-width: 75rem;
      }
  }

  .main {
      grid-area: main;
      height: 100vh;
      width: 75rem;
  }

  .footer{
      grid-area: footer;
      background-color: red;
      position: absolute;
      margin-left:-35rem;
      margin-right:-35rem;
      padding-left:35rem;
      padding-right:35rem;
      &>.wrapper {
        margin: 0 auto;
        max-width: 75rem;
      }
  }
</style>
