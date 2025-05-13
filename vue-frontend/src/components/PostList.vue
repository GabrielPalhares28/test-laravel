<template>
  <div class="max-w-2xl mx-auto mt-6 p-4">
    <h2 class="text-2xl font-semibold mb-4">Posts</h2>
    <div v-if="posts.length === 0" class="text-gray-500">Nenhum post encontrado.</div>
    <div v-for="post in posts" :key="post.id" class="border p-4 mb-4 rounded shadow">
      <h3 class="text-lg font-bold">{{ post.title }}</h3>
      <p class="mt-2 text-gray-700">{{ post.content }}</p>
      <p class="text-sm text-gray-500 mt-2">Autor: {{ post.user.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])

const fetchPosts = async () => {
  const res = await fetch('http://localhost/api/posts', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  const data = await res.json()
  posts.value = data
}

onMounted(fetchPosts)
</script>
