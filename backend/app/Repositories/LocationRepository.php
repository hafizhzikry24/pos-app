<?php

namespace App\Repositories;

use App\Interfaces\LocationRepositoryInterface;
use App\Models\Location;

class LocationRepository implements LocationRepositoryInterface
{
    public function getAll()
    {
        return Location::all();
    }

    /**
     * Get paginated locations with search functionality
     * 
     * @param string|null $search
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginatedWithSearch(?string $search = null, int $perPage = 10)
    {
        $query = Location::query();
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }
        
        return $query->orderBy('name')->paginate($perPage);
    }

    public function getById($id)
    {
        return Location::findOrFail($id);
    }

    public function create(array $data)
    {
        return Location::create($data);
    }

    public function update($id, array $data)
    {
        $location = Location::findOrFail($id);
        $location->update($data);
        return $location;
    }

    public function delete($id)
    {
        $location = Location::findOrFail($id);
        return $location->delete();
    }
}
