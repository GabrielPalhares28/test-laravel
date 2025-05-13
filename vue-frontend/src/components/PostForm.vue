<template>
  <div v-if="isAdmin" class="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded">
    <h2 class="text-xl font-semibold mb-4">Criar Novo Post</h2>
    <form @submit.prevent="createPost">
      <div class="mb-4">
        <label class="block mb-1">Título</label>
        <input v-model="title" type="text" class="w-full border rounded p-2" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Conteúdo</label>
        <textarea v-model="content" class="w-full border rounded p-2" rows="5" required></textarea>
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Publicar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const content = ref('')
const isAdmin = localStorage.getItem('role') === 'admin' // ajuste se necessário

const createPost = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: title.value, content: content.value })
    })

    if (!res.ok) throw new Error('Erro ao criar post.')

    title.value = ''
    content.value = ''
    alert('Post criado com sucesso!')
  } catch (error) {
    alert(error.message)
  }
}
</script>
