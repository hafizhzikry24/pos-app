<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\LocationService;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    protected $service;

    public function __construct(LocationService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->getAllLocations());
    }

    public function show($id)
    {
        return response()->json($this->service->getLocationById($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:locations,code',
            'name' => 'required',
            'address' => 'required',
        ]);

        return response()->json($this->service->createLocation($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'code' => 'required|unique:locations,code,' . $id,
            'name' => 'required',
            'address' => 'required',
        ]);

        return response()->json($this->service->updateLocation($id, $validated));
    }

    public function destroy($id)
    {
        $this->service->deleteLocation($id);
        return response()->json(null, 204);
    }
}
