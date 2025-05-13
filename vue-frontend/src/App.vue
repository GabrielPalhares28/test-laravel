<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Cabeçalho -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="bg-blue-600 text-white p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Blog Sistema</h1>
          </div>
          
          <div v-if="user" class="flex items-center">
            <span class="hidden md:inline mr-2 text-gray-600">{{ user.role === 'admin' ? 'Administrador' : 'Leitor' }}</span>
            <div class="relative">
              <button 
                @click="isMenuOpen = !isMenuOpen"
                class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div class="bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center">
                  {{ user.email.charAt(0).toUpperCase() }}
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  :class="{ 'transform rotate-180': isMenuOpen }"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Menu de usuário -->
              <div 
                v-if="isMenuOpen" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5"
              >
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
                <div class="border-t border-gray-100"></div>
                <a 
                  href="#" 
                  @click.prevent="logout" 
                  class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sair
                </a>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <button 
              @click="showLoginModal = true"
              class="px-4 py-2 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Conteúdo principal -->
    <main class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Banner Admin (visível apenas para admin) -->
      <div v-if="user && user.role === 'admin'" class="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-8 md:px-10">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="mb-4 md:mb-0">
              <h2 class="text-2xl font-bold text-white">Painel de Administração</h2>
              <p class="mt-1 text-blue-100">Gerencie todas as publicações do seu blog em um só lugar</p>
            </div>
            <button 
              @click="scrollToForm"
              class="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nova Publicação
            </button>
          </div>
        </div>
        
        <!-- Mini Dashboard -->
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-blue-500/20 bg-blue-800/20">
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-white">{{ postStats.total || 0 }}</div>
            <div class="text-sm text-blue-100">Total de Posts</div>
          </div>
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-white">{{ postStats.today || 0 }}</div>
            <div class="text-sm text-blue-100">Hoje</div>
          </div>
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-white">{{ postStats.week || 0 }}</div>
            <div class="text-sm text-blue-100">Esta Semana</div>
          </div>
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-white">{{ postStats.views || 0 }}</div>
            <div class="text-sm text-blue-100">Visualizações</div>
          </div>
        </div>
      </div>
      
      <!-- Banner para leitores (visível para não-admin) -->
      <div v-if="user && user.role !== 'admin'" class="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-8 md:p-10">
          <h2 class="text-2xl font-bold text-white">Bem-vindo ao Blog!</h2>
          <p class="mt-2 text-blue-100">Explore nossas publicações mais recentes abaixo.</p>
        </div>
      </div>
      
      <!-- Componente de formulário (visível apenas para admin) -->
      <div ref="formSection">
        <PostForm v-if="user && user.role === 'admin'" @post-created="refreshPosts" />
      </div>
      
      <!-- Componente de listagem -->
      <PostList v-if="user" ref="postList" />
      
      <!-- Mensagem quando não autenticado -->
      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Acesso Restrito</h2>
        <p class="text-gray-600 mb-6">Faça login para acessar o conteúdo do blog</p>
        <button 
          @click="showLoginModal = true"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Entrar agora
        </button>
      </div>
    </main>
    
    <!-- Modal de Login -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
          <h3 class="text-lg font-medium">Login</h3>
          <button 
            @click="showLoginModal = false"
            class="rounded-full p-1 hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="login" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                v-model="loginForm.email" 
                type="email" 
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">Senha</label>
              <input 
                v-model="loginForm.password" 
                type="password" 
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div v-if="loginError" class="p-3 bg-red-50 text-red-600 rounded-lg">
              {{ loginError }}
            </div>
            <div class="flex justify-between items-center pt-2">
              <label class="flex items-center">
                <input type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span class="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <a href="#" class="text-sm text-blue-600 hover:underline">Esqueceu a senha?</a>
            </div>
            <button 
              type="submit" 
              class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              :disabled="isLoggingIn"
            >
              <span v-if="isLoggingIn">Entrando...</span>
              <span v-else>Entrar</span>
            </button>
            <div class="text-center text-sm text-gray-500 pt-2">
              <p>
                Usuários de teste: <br>
                <span class="font-medium">admin@example.com / password</span> <br>
                <span class="font-medium">reader@example.com / password</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex justify-center md:justify-start">
            <div class="flex items-center">
              <div class="text-gray-700 text-sm">© 2025 Sistema de Blog</div>
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex justify-center md:justify-end space-x-6">
              <a href="#" class="text-gray-500 hover:text-gray-700">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-700">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-700">
                <span class="sr-only">Twitter</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-gray-700">
                <span class="sr-only">GitHub</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PostForm from './components/PostForm.vue'
import PostList from './components/PostList.vue'

// Estado da aplicação
const user = ref(null)
const isMenuOpen = ref(false)
const showLoginModal = ref(false)
const loginError = ref('')
const isLoggingIn = ref(false)
const formSection = ref(null)
const postList = ref(null)
const postStats = reactive({
  total: 0,
  today: 0,
  week: 0,
  views: 0
})

// Formulário de login
const loginForm = reactive({
  email: '',
  password: ''
})

// Simular login
const login = async () => {
  isLoggingIn.value = true
  loginError.value = ''
  
  try {
    // Simulação de verificação de login
    // Em uma aplicação real, isso seria uma chamada API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (loginForm.email === 'admin@example.com' && loginForm.password === 'password') {
      user.value = {
        email: loginForm.email,
        role: 'admin'
      }
      localStorage.setItem('role', 'admin')
      localStorage.setItem('token', 'admin-token-123') // Token simulado
      showLoginModal.value = false
      fetchPostStats()
    } else if (loginForm.email === 'reader@example.com' && loginForm.password === 'password') {
      user.value = {
        email: loginForm.email,
        role: 'reader'
      }
      localStorage.setItem('role', 'reader')
      localStorage.setItem('token', 'reader-token-456') // Token simulado
      showLoginModal.value = false
    } else {
      loginError.value = 'Email ou senha inválidos. Tente novamente.'
    }
  } catch (error) {
    loginError.value = 'Ocorreu um erro durante o login. Tente novamente.'
    console.error('Erro de login:', error)
  } finally {
    isLoggingIn.value = false
  }
}

// Logout
const logout = () => {
  user.value = null
  localStorage.removeItem('role')
  localStorage.removeItem('token')
  isMenuOpen.value = false
}

// Rolar para o formulário de criação
const scrollToForm = () => {
  formSection.value.scrollIntoView({ behavior: 'smooth' })
}

// Atualizar lista de posts quando um novo for criado
const refreshPosts = () => {
  if (postList.value) {
    postList.value.fetchPosts()
    fetchPostStats()
  }
}

// Buscar estatísticas de posts (simulado)
const fetchPostStats = async () => {
  // Em uma aplicação real, isso seria uma chamada API
  // Simulando dados para o dashboard
  postStats.total = Math.floor(Math.random() * 50) + 10
  postStats.today = Math.floor(Math.random() * 5)
  postStats.week = Math.floor(Math.random() * 15) + 5
  postStats.views = Math.floor(Math.random() * 1000) + 100
}

// Verificar autenticação no carregamento da página
onMounted(() => {
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')
  
  if (role && token) {
    // Em uma aplicação real, você validaria o token com o backend
    user.value = {
      email: role === 'admin' ? 'admin@example.com' : 'reader@example.com',
      role: role
    }
    
    if (role === 'admin') {
      fetchPostStats()
    }
  }
})
</script>