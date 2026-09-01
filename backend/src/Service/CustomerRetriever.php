<?php

namespace App\Service;

use App\Entity\Customer;
use App\Repository\CustomerRepository;

final class CustomerRetriever
{
    public function __construct(private CustomerRepository $customerRepository)
    {
    }

    public function getById(int $id): ?Customer
    {
        return $this->customerRepository->find($id);
    }
}
