<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Repositories\CustomerRepository;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Responses\MessageResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search');
            $perPage = $request->get('per_page', 10);
            
            $customers = $this->customerRepository->getPaginatedWithSearch($search, $perPage);
            return MessageResponse::success($customers, 'Customers retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        try {
            $customer = $this->customerRepository->create($request->validated());
            return MessageResponse::success($customer, 'Customer created successfully', 201);
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $customer = $this->customerRepository->findById($id);
            if (!$customer) {
                return MessageResponse::error('Customer not found', 404);
            }
            return MessageResponse::success($customer, 'Customer retrieved successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function update(UpdateCustomerRequest $request, $id): JsonResponse
    {
        try {
            $customer = $this->customerRepository->update($id, $request->validated());
            if (!$customer) {
                return MessageResponse::error('Customer not found', 404);
            }
            return MessageResponse::success($customer, 'Customer updated successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $result = $this->customerRepository->delete($id);
            if (!$result) {
                return MessageResponse::error('Customer not found', 404);
            }
            return MessageResponse::success(null, 'Customer deleted successfully');
        } catch (Exception $e) {
            return MessageResponse::serverError($e->getMessage());
        }
    }
}
