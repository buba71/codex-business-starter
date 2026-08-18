<?php

namespace App\Customer\Domain;

use InvalidArgumentException;

final readonly class Customer
{
    public function __construct(
        private string $name,
        private string $email,
        private CustomerStatus $status,
    ) {
        if ('' === trim($this->name)) {
            throw new InvalidArgumentException('Customer name cannot be empty.');
        }

        if (false === filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Customer email must be valid.');
        }
    }

    public function name(): string
    {
        return $this->name;
    }

    public function email(): string
    {
        return $this->email;
    }

    public function status(): CustomerStatus
    {
        return $this->status;
    }
}
