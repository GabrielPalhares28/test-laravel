<template>
  <div v-if="isAdmin" class="max-w-2xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg">
    <div class="flex items-center mb-6">
      <div class="bg-blue-600 p-2 rounded-lg mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Criar Nova Publicação</h2>
    </div>
    
    <form @submit.prevent="createPost" class="space-y-6">
      <div>
        <label class="block text-gray-700 font-medium mb-2">Título da Publicação</label>
        <input 
          v-model="title" 
          type="text" 
          class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Digite o título aqui" 
          required 
        />
      </div>
      
      <div>
        <label class="block text-gray-700 font-medium mb-2">Conteúdo</label>
        <textarea 
          v-model="content" 
          class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
          rows="6" 
          placeholder="Escreva o conteúdo da sua publicação aqui..." 
          required
        ></textarea>
      </div>
      
      <div class="flex items-center">
        <div class="mr-3">
          <span class="text-gray-600 text-sm">Status:</span>
          <span class="ml-1 text-blue-600 font-medium text-sm">Rascunho</span>
        </div>
        <div class="flex-grow"></div>
        <button 
          type="button" 
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-100 transition-colors"
          @click="resetForm"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Publicar
        </button>
      </div>
    </form>
    
    <div v-if="statusMessage" :class="`mt-4 p-3 rounded-lg ${statusMessageClass}`">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const content = ref('')
const statusMessage = ref('')
const statusMessageClass = ref('')
const isAdmin = localStorage.getItem('role') === 'admin' // simulado

const createPost = async () => {
  try {
    statusMessage.value = 'Enviando publicação...'
    statusMessageClass.value = 'bg-blue-50 text-blue-600'
    
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: title.value, content: content.value })
    })
    
    if (!res.ok) throw new Error('Erro ao criar publicação.')
    
    statusMessage.value = 'Publicação criada com sucesso!'
    statusMessageClass.value = 'bg-green-50 text-green-600'
    
    // Limpar formulário após sucesso
    resetForm()
    
    // Esconder mensagem após 3 segundos
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  } catch (error) {
    statusMessage.value = error.message
    statusMessageClass.value = 'bg-red-50 text-red-600'
  }
}

const resetForm = () => {
  title.value = ''
  content.value = ''
}   

</script>