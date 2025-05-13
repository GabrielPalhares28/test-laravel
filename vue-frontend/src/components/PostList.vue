<template>
  <div v-if="posts.length" class="mt-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      Publicações Recentes
    </h2>
    
    <!-- Barra de busca e filtros -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative flex-grow">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar publicações..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <select 
        v-model="sortBy" 
        class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="recent">Mais recentes</option>
        <option value="oldest">Mais antigos</option>
        <option value="title">Por título</option>
      </select>
    </div>
    
    <!-- Lista de posts com efeito de carregamento -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="h-6 bg-gray-200 m-4 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 mx-4 mb-2 rounded w-1/2"></div>
        <div class="h-24 bg-gray-200 mx-4 mb-4 rounded"></div>
      </div>
    </div>
    
    <!-- Posts reais -->
    <div v-else class="space-y-6">
      <div 
        v-for="post in filteredPosts" 
        :key="post.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
      >
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ post.title }}</h3>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(post.created_at) }}</span>
            <span class="mx-2">•</span>
            <span>{{ post.author || 'Admin' }}</span>
          </div>
          <p class="text-gray-600 line-clamp-3">{{ post.content }}</p>
          <div class="mt-4 flex justify-between items-center">
            <button 
              @click="expandPost(post)" 
              class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              Ler mais
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div v-if="isAdmin" class="flex space-x-2">
              <button 
                @click="editPost(post)" 
                class="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="confirmDelete(post.id)" 
                class="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Paginação -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <div class="flex space-x-1">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          :class="`flex items-center justify-center w-10 h-10 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          v-for="page in displayedPages" 
          :key="page" 
          @click="goToPage(page)" 
          :class="`flex items-center justify-center w-10 h-10 rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`"
        >
          {{ page }}
        </button>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages" 
          :class="`flex items-center justify-center w-10 h-10 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Mensagem sem posts -->
    <div v-if="!loading && filteredPosts.length === 0" class="bg-blue-50 rounded-lg p-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-gray-700 text-lg font-medium">Nenhuma publicação encontrada</p>
      <p class="text-gray-500 mt-2">Tente ajustar seus filtros ou crie uma nova publicação</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estado
const posts = ref([])
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('recent')
const currentPage = ref(1)
const postsPerPage = 5
const isAdmin = localStorage.getItem('role') === 'admin'

// Dados de paginação
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))
const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// Posts filtrados e ordenados
const filteredPosts = computed(() => {
  let result = [...posts.value]
  
  // Filtragem
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query)
    )
  }
  
  // Ordenação
  switch (sortBy.value) {
    case 'recent':
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
  }
  
  return result
})

// Posts na página atual
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

// Carregar posts da API
const fetchPosts = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost/api/posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!res.ok) throw new Error('Erro ao carregar publicações')
    
    const data = await res.json()
    posts.value = data
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    loading.value = false
  }
}

// Formatação de data
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('pt-BR', options)
}

// Funções de navegação
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Ações em posts
const expandPost = (post) => {
  // Implementar visualização detalhada (modal ou navegação)
  console.log('Expandir post:', post.id)
}

const editPost = (post) => {
  // Implementar edição (emitir evento para componente pai ou navegação)
  console.log('Editar post:', post.id)
}

const confirmDelete = (postId) => {
  if (confirm('Tem certeza que deseja excluir esta publicação?')) {
    deletePost(postId)
  }
}

const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!res.ok) throw new Error('Erro ao excluir publicação')
    
    // Remover post da lista
    posts.value = posts.value.filter(post => post.id !== postId)
  } catch (error) {
    console.error('Erro:', error)
    alert(error.message)
  }
}

// Carregamento inicial
onMounted(fetchPosts)
</script>