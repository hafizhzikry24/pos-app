<?php

namespace App\Services;

use App\Interfaces\LocationRepositoryInterface;

class LocationService
{
    protected $repository;

    public function __construct(LocationRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllLocations()
    {
        return $this->repository->getAll();
    }

    public function getLocationById($id)
    {
        return $this->repository->getById($id);
    }

    public function createLocation(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateLocation($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteLocation($id)
    {
        return $this->repository->delete($id);
    }
}
