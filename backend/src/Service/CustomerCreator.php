<?php

namespace App\Service;

use App\Entity\Customer;
use App\Enum\CustomerStatus;
use App\Repository\CustomerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

final class CustomerCreator
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
    ) {
    }

    public function create(string $name, string $email, CustomerStatus $status): Customer
    {
        $customer = new Customer();
        $customer
            ->setName($name)
            ->setEmail($email)
            ->setStatus($status);

        $violations = $this->validator->validate($customer);
        if (0 < count($violations)) {
            throw new ValidationFailedException($customer, $violations);
        }

        $this->entityManager->persist($customer);
        $this->entityManager->flush();

        return $customer;
    }
}
