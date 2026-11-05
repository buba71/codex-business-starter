<?php

namespace App\Service;

use App\Entity\Customer;
use App\Enum\CustomerStatus;
use App\Repository\CustomerRepository;
use Doctrine\ORM\EntityManagerInterface;

final class CustomerStatusUpdater
{
    public function __construct(
        private CustomerRepository $customerRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function update(int $id, CustomerStatus $status): ?Customer
    {
        $customer = $this->customerRepository->find($id);
        if (null === $customer) {
            return null;
        }

        if ($customer->getStatus() === $status) {
            return $customer;
        }

        $customer->setStatus($status);
        $this->entityManager->flush();

        return $customer;
    }
}
