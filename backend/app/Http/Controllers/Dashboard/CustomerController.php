<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Repositories\CustomerRepository;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    public function index()
    {
        return response()->json($this->customerRepository->getAll());
    }

    public function store(StoreCustomerRequest $request)
    {
        $customer = $this->customerRepository->create($request->validated());
        return response()->json(['message' => 'Customer created successfully', 'customer' => $customer], 201);
    }

    public function show($id)
    {
        $customer = $this->customerRepository->findById($id);
        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }
        return response()->json($customer);
    }

    public function update(UpdateCustomerRequest $request, $id)
    {
        $customer = $this->customerRepository->update($id, $request->validated());
        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }
        return response()->json(['message' => 'Customer updated successfully', 'customer' => $customer]);
    }

    public function destroy($id)
    {
        $result = $this->customerRepository->delete($id);
        if (!$result) {
            return response()->json(['message' => 'Customer not found'], 404);
        }
        return response()->json(['message' => 'Customer deleted successfully']);
    }
}
