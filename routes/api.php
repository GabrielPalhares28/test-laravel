<?php

use Illuminate\Support\Facades\Route;
use App\Http\Api\Controllers\PostController;

// Rotas protegidas por autenticação Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Apenas admin pode criar posts
    Route::post('/posts', [PostController::class, 'store'])->middleware('isAdmin');

    // Qualquer usuário autenticado pode listar os posts de um usuário
    Route::get('/posts', [PostController::class, 'index']);
});
