<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    // Criação de post (apenas admin)
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => $user->id,
        ]);

        return response()->json($post, 201);
    }

    // Listagem dos posts de um usuário
    public function index(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId || !User::find($userId)) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $posts = Post::where('user_id', $userId)->get();

        return response()->json($posts);
    }
}
