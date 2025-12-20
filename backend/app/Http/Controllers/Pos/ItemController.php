<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Services\ItemService;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    protected $service;

    public function __construct(ItemService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->getAllItems());
    }

    public function show($id)
    {
        return response()->json($this->service->getItemById($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'sku_code' => 'required|unique:items,sku_code',
            'price' => 'required|numeric',
            'measure' => 'required',
            'is_active' => 'boolean',
        ]);

        return response()->json($this->service->createItem($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required',
            'sku_code' => 'required|unique:items,sku_code,' . $id,
            'price' => 'required|numeric',
            'measure' => 'required',
            'is_active' => 'boolean',
        ]);

        return response()->json($this->service->updateItem($id, $validated));
    }

    public function destroy($id)
    {
        $this->service->deleteItem($id);
        return response()->json(null, 204);
    }
}
