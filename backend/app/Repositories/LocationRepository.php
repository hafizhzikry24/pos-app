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
