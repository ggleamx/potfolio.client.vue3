<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Entity1View from '@/views/Entity1View.vue';

@Options({
  components: {
    Entity1View,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.content-container {
  height: 95vh;
  width: 50vw;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  padding: 0 20px;
  overflow-y: auto; 
}

@media (max-width: 767px) {
  .content-container {
    width: 80vw; /* Toma el 70% de la anchura de la pantalla */
  }
}

nav {
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.nav-item {
  margin: 0 15px;
  text-decoration: none;
  color: #777;
  transition: color 0.3s ease;
}

.nav-item--active,
.nav-item:hover {
  color: #080808;
}

</style>
