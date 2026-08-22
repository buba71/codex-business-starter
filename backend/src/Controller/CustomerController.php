<?php

namespace App\Controller;

use App\Enum\CustomerStatus;
use App\Service\CustomerCreator;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Exception\ValidationFailedException;

final class CustomerController
{
    public function __construct(private CustomerCreator $customerCreator)
    {
    }

    #[Route('/api/v1/customers', name: 'customer_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return $this->errorResponse(
                'invalid_json',
                'Request body must contain valid JSON.',
                JsonResponse::HTTP_BAD_REQUEST,
            );
        }

        foreach (['name', 'email', 'status'] as $field) {
            if (!array_key_exists($field, $data) || !is_string($data[$field])) {
                return $this->errorResponse(
                    'invalid_input',
                    sprintf('The %s field is required and must be a string.', $field),
                    JsonResponse::HTTP_BAD_REQUEST,
                );
            }
        }

        $status = CustomerStatus::tryFrom($data['status']);
        if (null === $status) {
            return $this->errorResponse(
                'invalid_input',
                'The status field contains an unsupported value.',
                JsonResponse::HTTP_BAD_REQUEST,
            );
        }

        try {
            $customer = $this->customerCreator->create($data['name'], $data['email'], $status);
        } catch (ValidationFailedException $exception) {
            $details = [];
            foreach ($exception->getViolations() as $violation) {
                $details[] = [
                    'field' => (string) $violation->getPropertyPath(),
                    'message' => $violation->getMessage(),
                ];
            }

            return $this->errorResponse(
                'validation_failed',
                'Customer data failed validation.',
                JsonResponse::HTTP_UNPROCESSABLE_ENTITY,
                $details,
            );
        }

        return new JsonResponse([
            'id' => $customer->getId(),
            'name' => $customer->getName(),
            'email' => $customer->getEmail(),
            'status' => $customer->getStatus()->value,
        ], JsonResponse::HTTP_CREATED);
    }

    /** @param list<array{field: string, message: string}> $details */
    private function errorResponse(string $code, string $message, int $status, array $details = []): JsonResponse
    {
        return new JsonResponse([
            'error' => [
                'code' => $code,
                'message' => $message,
                'details' => $details,
            ],
        ], $status);
    }
}
