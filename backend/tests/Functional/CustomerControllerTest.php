<?php

namespace App\Tests\Functional;

use App\Entity\Customer;
use App\Enum\CustomerStatus;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class CustomerControllerTest extends WebTestCase
{
    private EntityManagerInterface $entityManager;
    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();

        $this->entityManager = self::getContainer()->get(EntityManagerInterface::class);
    }

    public function testMalformedJsonReturnsBadRequest(): void
    {
        $client = $this->client;
        $client->request('POST', '/api/v1/customers', [], [], ['CONTENT_TYPE' => 'application/json'], '{');

        self::assertResponseStatusCodeSame(400);
        self::assertSame(['error' => [
            'code' => 'invalid_json',
            'message' => 'Request body must contain valid JSON.',
            'details' => [],
        ]], json_decode($client->getResponse()->getContent(), true));
    }

    #[DataProvider('invalidInputProvider')]
    public function testInvalidInputReturnsBadRequest(array $payload): void
    {
        $client = $this->client;
        $client->jsonRequest('POST', '/api/v1/customers', $payload);

        self::assertResponseStatusCodeSame(400);
        self::assertSame('invalid_input', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public static function invalidInputProvider(): iterable
    {
        yield 'missing field' => [['name' => 'Ada', 'email' => 'ada@example.com']];
        yield 'wrong field type' => [['name' => ['Ada'], 'email' => 'ada@example.com', 'status' => 'ACTIVE']];
        yield 'unsupported status' => [['name' => 'Ada', 'email' => 'ada@example.com', 'status' => 'PENDING']];
    }

    public function testBlankNameReturnsValidationError(): void
    {
        $client = $this->client;
        $client->jsonRequest('POST', '/api/v1/customers', [
            'name' => '',
            'email' => 'ada@example.com',
            'status' => 'ACTIVE',
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertSame('validation_failed', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testInvalidEmailReturnsValidationError(): void
    {
        $client = $this->client;
        $client->jsonRequest('POST', '/api/v1/customers', [
            'name' => 'Ada',
            'email' => 'not-an-email',
            'status' => 'ACTIVE',
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertSame('validation_failed', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    #[DataProvider('validCustomerProvider')]
    public function testValidCustomerIsCreatedAndPersisted(string $status): void
    {
        $client = $this->client;
        $client->jsonRequest('POST', '/api/v1/customers', [
            'name' => 'Ada Lovelace',
            'email' => "ada-$status@example.com",
            'status' => $status,
        ]);

        self::assertResponseStatusCodeSame(201);
        $response = json_decode($client->getResponse()->getContent(), true);
        self::assertSame(['id', 'name', 'email', 'status'], array_keys($response));
        self::assertSame('Ada Lovelace', $response['name']);
        self::assertSame("ada-$status@example.com", $response['email']);
        self::assertSame($status, $response['status']);
        self::assertIsInt($response['id']);

        $persisted = $this->entityManager->find(Customer::class, $response['id']);
        self::assertInstanceOf(Customer::class, $persisted);
        self::assertSame(CustomerStatus::from($status), $persisted->getStatus());
    }

    public static function validCustomerProvider(): iterable
    {
        yield 'active' => ['ACTIVE'];
        yield 'inactive' => ['INACTIVE'];
    }
}
