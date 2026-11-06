<?php

namespace App\Tests\Functional;

use App\Entity\Customer;
use App\Entity\User;
use App\Enum\CustomerStatus;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class CustomerControllerTest extends WebTestCase
{
    private EntityManagerInterface $entityManager;
    private KernelBrowser $client;
    private string $csrfToken;

    protected function setUp(): void
    {
        $this->client = static::createClient();

        $this->entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $admin = (new User())
            ->setEmail('admin@example.com')
            ->setRoles([User::ROLE_ADMIN])
            ->setPassword('test-password');
        $this->entityManager->persist($admin);
        $this->entityManager->flush();
        $this->client->loginUser($admin);
        $this->client->request('GET', '/api/v1/customers/csrf-token');
        $this->csrfToken = json_decode($this->client->getResponse()->getContent(), true)['token'];
    }

    public function testAnonymousGetReturnsUnauthorizedJson(): void
    {
        $client = $this->client;
        $client->restart();
        $client->request('GET', '/api/v1/customers/1');

        self::assertResponseStatusCodeSame(401);
        self::assertSame('application/json', $client->getResponse()->headers->get('content-type'));
        self::assertSame('authentication_required', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testAnonymousPostReturnsUnauthorizedJson(): void
    {
        $client = $this->client;
        $client->restart();
        $client->jsonRequest('POST', '/api/v1/customers', []);

        self::assertResponseStatusCodeSame(401);
        self::assertSame('authentication_required', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testAnonymousPatchReturnsUnauthorizedJson(): void
    {
        $client = $this->client;
        $client->restart();
        $client->jsonRequest('PATCH', '/api/v1/customers/1', ['status' => 'ACTIVE']);

        self::assertResponseStatusCodeSame(401);
        self::assertSame('authentication_required', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testNonAdminGetReturnsForbiddenJson(): void
    {
        $this->client->loginUser($this->createUser('user@example.com'));
        $this->client->request('GET', '/api/v1/customers/1');

        self::assertResponseStatusCodeSame(403);
        self::assertSame('access_denied', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testNonAdminPostReturnsForbiddenJson(): void
    {
        $this->client->loginUser($this->createUser('user@example.com'));
        $this->client->jsonRequest('POST', '/api/v1/customers', []);

        self::assertResponseStatusCodeSame(403);
        self::assertSame('access_denied', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testNonAdminPatchReturnsForbiddenJson(): void
    {
        $this->client->loginUser($this->createUser('user-patch@example.com'));
        $this->client->jsonRequest('PATCH', '/api/v1/customers/1', ['status' => 'ACTIVE']);

        self::assertResponseStatusCodeSame(403);
        self::assertSame('access_denied', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testAdminPostWithoutCsrfTokenReturnsForbiddenJson(): void
    {
        $this->client->jsonRequest('POST', '/api/v1/customers', [
            'name' => 'Ada Lovelace',
            'email' => 'ada-no-token@example.com',
            'status' => 'ACTIVE',
        ]);

        self::assertResponseStatusCodeSame(403);
        self::assertSame('csrf_token_invalid', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testAdminPostWithInvalidCsrfTokenReturnsForbiddenJson(): void
    {
        $this->client->jsonRequest('POST', '/api/v1/customers', [
            'name' => 'Ada Lovelace',
            'email' => 'ada-invalid-token@example.com',
            'status' => 'ACTIVE',
        ], ['HTTP_X_CSRF_TOKEN' => 'invalid-token']);

        self::assertResponseStatusCodeSame(403);
        self::assertSame('csrf_token_invalid', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testAdminPatchWithoutCsrfTokenDoesNotPersist(): void
    {
        $customer = $this->createCustomer(CustomerStatus::INACTIVE);

        $this->client->jsonRequest('PATCH', sprintf('/api/v1/customers/%d', $customer->getId()), ['status' => 'ACTIVE']);

        self::assertResponseStatusCodeSame(403);
        self::assertSame('csrf_token_invalid', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
        $this->entityManager->clear();
        self::assertSame(CustomerStatus::INACTIVE, $this->entityManager->find(Customer::class, $customer->getId())->getStatus());
    }

    public function testAdminPatchWithInvalidCsrfTokenDoesNotPersist(): void
    {
        $customer = $this->createCustomer(CustomerStatus::INACTIVE);

        $this->client->jsonRequest('PATCH', sprintf('/api/v1/customers/%d', $customer->getId()), ['status' => 'ACTIVE'], ['HTTP_X_CSRF_TOKEN' => 'invalid-token']);

        self::assertResponseStatusCodeSame(403);
        self::assertSame('csrf_token_invalid', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
        $this->entityManager->clear();
        self::assertSame(CustomerStatus::INACTIVE, $this->entityManager->find(Customer::class, $customer->getId())->getStatus());
    }

    public function testMalformedJsonReturnsBadRequest(): void
    {
        $client = $this->client;
        $client->request('POST', '/api/v1/customers', [], [], ['CONTENT_TYPE' => 'application/json', 'HTTP_X_CSRF_TOKEN' => $this->csrfToken], '{');

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
        $client->jsonRequest('POST', '/api/v1/customers', $payload, ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

        self::assertResponseStatusCodeSame(400);
        self::assertSame('invalid_input', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public static function invalidInputProvider(): iterable
    {
        yield 'missing field' => [['name' => 'Ada', 'email' => 'ada@example.com']];
        yield 'wrong field type' => [['name' => ['Ada'], 'email' => 'ada@example.com', 'status' => 'ACTIVE']];
        yield 'unsupported status' => [['name' => 'Ada', 'email' => 'ada@example.com', 'status' => 'PENDING']];
    }

    #[DataProvider('blankNameProvider')]
    public function testBlankNameReturnsValidationError(string $name): void
    {
        $client = $this->client;
        $client->jsonRequest('POST', '/api/v1/customers', [
            'name' => $name,
            'email' => 'ada@example.com',
            'status' => 'ACTIVE',
        ], ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

        self::assertResponseStatusCodeSame(422);
        self::assertSame('validation_failed', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public static function blankNameProvider(): iterable
    {
        yield 'empty string' => [''];
        yield 'space' => [' '];
        yield 'tab' => ["\t"];
        yield 'newline' => ["\n"];
    }

    public function testInvalidEmailReturnsValidationError(): void
    {
        $client = $this->client;
        $client->jsonRequest('POST', '/api/v1/customers', [
            'name' => 'Ada',
            'email' => 'not-an-email',
            'status' => 'ACTIVE',
        ], ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

        self::assertResponseStatusCodeSame(422);
        self::assertSame('validation_failed', json_decode($client->getResponse()->getContent(), true)['error']['code']);
    }

    public function testMalformedPatchJsonReturnsBadRequest(): void
    {
        $customer = $this->createCustomer(CustomerStatus::INACTIVE);
        $this->client->request('PATCH', sprintf('/api/v1/customers/%d', $customer->getId()), [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_CSRF_TOKEN' => $this->csrfToken,
        ], '{');

        self::assertResponseStatusCodeSame(400);
        self::assertSame('invalid_json', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
        $this->entityManager->clear();
        self::assertSame(CustomerStatus::INACTIVE, $this->entityManager->find(Customer::class, $customer->getId())->getStatus());
    }

    #[DataProvider('invalidPatchPayloadProvider')]
    public function testInvalidPatchPayloadDoesNotPersist(array $payload): void
    {
        $customer = $this->createCustomer(CustomerStatus::INACTIVE);
        $this->client->jsonRequest('PATCH', sprintf('/api/v1/customers/%d', $customer->getId()), $payload, ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

        self::assertResponseStatusCodeSame(400);
        self::assertSame('invalid_input', json_decode($this->client->getResponse()->getContent(), true)['error']['code']);
        $this->entityManager->clear();
        self::assertSame(CustomerStatus::INACTIVE, $this->entityManager->find(Customer::class, $customer->getId())->getStatus());
    }

    public static function invalidPatchPayloadProvider(): iterable
    {
        yield 'missing status' => [[]];
        yield 'non-string status' => [['status' => ['ACTIVE']]];
        yield 'unsupported status' => [['status' => 'PENDING']];
    }

    #[DataProvider('validCustomerProvider')]
    public function testAdminPatchUpdatesStatusAndReturnsFullCustomer(string $status): void
    {
        $customer = $this->createCustomer(CustomerStatus::INACTIVE);

        $this->client->jsonRequest('PATCH', sprintf('/api/v1/customers/%d', $customer->getId()), ['status' => $status], ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

        self::assertResponseStatusCodeSame(200);
        self::assertSame([
            'id' => $customer->getId(),
            'name' => 'Grace Hopper',
            'email' => 'grace@example.com',
            'status' => $status,
        ], json_decode($this->client->getResponse()->getContent(), true));
        $this->entityManager->clear();
        self::assertSame(CustomerStatus::from($status), $this->entityManager->find(Customer::class, $customer->getId())->getStatus());
    }

    public function testAdminPatchWithSameStatusIsIdempotent(): void
    {
        $customer = $this->createCustomer(CustomerStatus::ACTIVE);

        $this->client->jsonRequest('PATCH', sprintf('/api/v1/customers/%d', $customer->getId()), ['status' => 'ACTIVE'], ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

        self::assertResponseStatusCodeSame(200);
        self::assertSame('ACTIVE', json_decode($this->client->getResponse()->getContent(), true)['status']);
    }

    public function testPatchUnknownCustomerReturnsNotFound(): void
    {
        $this->client->jsonRequest('PATCH', '/api/v1/customers/2147483647', ['status' => 'ACTIVE'], ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

        self::assertResponseStatusCodeSame(404);
        self::assertSame(['error' => [
            'code' => 'customer_not_found',
            'message' => 'Customer not found.',
            'details' => [],
        ]], json_decode($this->client->getResponse()->getContent(), true));
    }

    #[DataProvider('validCustomerProvider')]
    public function testValidCustomerIsCreatedAndPersisted(string $status): void
    {
        $client = $this->client;
        $client->jsonRequest('POST', '/api/v1/customers', [
            'name' => 'Ada Lovelace',
            'email' => "ada-$status@example.com",
            'status' => $status,
        ], ['HTTP_X_CSRF_TOKEN' => $this->csrfToken]);

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

    public function testExistingCustomerIsReturned(): void
    {
        $customer = (new Customer())
            ->setName('Grace Hopper')
            ->setEmail('grace@example.com')
            ->setStatus(CustomerStatus::ACTIVE);

        $this->entityManager->persist($customer);
        $this->entityManager->flush();

        $this->client->request('GET', sprintf('/api/v1/customers/%d', $customer->getId()));

        self::assertResponseIsSuccessful();
        self::assertSame([
            'id' => $customer->getId(),
            'name' => 'Grace Hopper',
            'email' => 'grace@example.com',
            'status' => 'ACTIVE',
        ], json_decode($this->client->getResponse()->getContent(), true));
    }

    public function testInactiveCustomerRemainsVisibleThroughGet(): void
    {
        $customer = $this->createCustomer(CustomerStatus::INACTIVE);

        $this->client->request('GET', sprintf('/api/v1/customers/%d', $customer->getId()));

        self::assertResponseIsSuccessful();
        self::assertSame('INACTIVE', json_decode($this->client->getResponse()->getContent(), true)['status']);
    }

    public function testMissingCustomerReturnsNotFound(): void
    {
        $this->client->request('GET', '/api/v1/customers/2147483647');

        self::assertResponseStatusCodeSame(404);
        self::assertSame(['error' => [
            'code' => 'customer_not_found',
            'message' => 'Customer not found.',
            'details' => [],
        ]], json_decode($this->client->getResponse()->getContent(), true));
    }

    private function createUser(string $email): User
    {
        $user = (new User())
            ->setEmail($email)
            ->setPassword('test-password');
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    private function createCustomer(CustomerStatus $status): Customer
    {
        $customer = (new Customer())
            ->setName('Grace Hopper')
            ->setEmail('grace@example.com')
            ->setStatus($status);
        $this->entityManager->persist($customer);
        $this->entityManager->flush();

        return $customer;
    }
}
