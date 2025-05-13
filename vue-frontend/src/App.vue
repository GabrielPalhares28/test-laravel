<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-center">Blog de Postagens</h1>

    <PostForm v-if="isAuthenticated" />
    <PostList v-if="isAuthenticated" />
  </div>
</template>

<script>
import PostForm from './components/PostForm.vue';
import PostList from './components/PostList.vue';

export default {
  components: {
    PostForm,
    PostList
  },
  data() {
    return {
      isAuthenticated: true // ou alguma lógica para verificar autenticação
    }
  }
}
</script>

<style>
/* Estilos específicos do componente */
</style>