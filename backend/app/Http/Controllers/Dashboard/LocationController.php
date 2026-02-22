<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use App\Http\Responses\MessageResponse;
use App\Services\LocationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    protected $service;

    public function __construct(LocationService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search');
            $perPage = $request->get('per_page', 10);
            
            $locations = $this->service->getPaginatedWithSearch($search, $perPage);
            return MessageResponse::success($locations, 'Locations retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $location = $this->service->getLocationById($id);
            return MessageResponse::success($location, 'Location retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::error('Location not found', 404);
        }
    }

    public function store(StoreLocationRequest $request): JsonResponse
    {
        try {
            $location = $this->service->createLocation($request->validated());
            return MessageResponse::success($location, 'Location created successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function update(UpdateLocationRequest $request, $id): JsonResponse
    {
        try {
            $location = $this->service->updateLocation($id, $request->validated());
            return MessageResponse::success($location, 'Location updated successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->service->deleteLocation($id);
            return MessageResponse::success(null, 'Location deleted successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}
