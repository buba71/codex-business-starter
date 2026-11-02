<?php

namespace App\Tests\Functional;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AuthenticationTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $this->passwordHasher = self::getContainer()->get(UserPasswordHasherInterface::class);
    }

    public function testAnonymousVisitorIsRedirectedToLogin(): void
    {
        $this->client->request('GET', '/admin');

        self::assertResponseRedirects('/login');
    }

    public function testAdminCanLoginVisitAdminAndLogout(): void
    {
        $this->createUser('admin@example.com', 'a-secure-password', [User::ROLE_ADMIN]);

        $crawler = $this->client->request('GET', '/login');
        $this->client->submit($crawler->selectButton('Sign in')->form([
            '_username' => '  ADMIN@example.com ',
            '_password' => 'a-secure-password',
        ]));

        self::assertResponseRedirects('/admin');
        $crawler = $this->client->followRedirect();
        self::assertResponseIsSuccessful();
        self::assertSelectorTextContains('h1', 'Administration');
        self::assertSelectorExists('#admin-shell[data-symfony--ux-vue--vue-component-value="AdminShell"]');

        $bootstrap = $crawler->filter('#admin-shell')->attr('data-symfony--ux-vue--vue-props-value');
        self::assertIsString($bootstrap);
        self::assertStringContainsString('Business Starter', $bootstrap);
        self::assertStringContainsString('/logout', $bootstrap);
        self::assertStringNotContainsString('admin@example.com', $bootstrap);

        $this->client->submit($crawler->selectButton('Sign out')->form());
        self::assertResponseRedirects('/login');

        $this->client->request('GET', '/admin');
        self::assertResponseRedirects('/login');
    }

    public function testNonAdminUserCannotAccessAdmin(): void
    {
        $user = $this->createUser('user@example.com', 'a-secure-password');
        $this->client->loginUser($user);

        $this->client->request('GET', '/admin');

        self::assertResponseStatusCodeSame(403);
    }

    public function testDisabledAdminCannotLogin(): void
    {
        $this->createUser('disabled@example.com', 'a-secure-password', [User::ROLE_ADMIN], false);

        $crawler = $this->client->request('GET', '/login');
        $this->client->submit($crawler->selectButton('Sign in')->form([
            '_username' => 'disabled@example.com',
            '_password' => 'a-secure-password',
        ]));

        self::assertResponseRedirects('/login');
        $this->client->followRedirect();
        self::assertSelectorExists('[role="alert"]');
    }

    public function testLoginRejectsInvalidCsrfToken(): void
    {
        $this->createUser('csrf@example.com', 'a-secure-password', [User::ROLE_ADMIN]);

        $this->client->request('POST', '/login', [
            '_username' => 'csrf@example.com',
            '_password' => 'a-secure-password',
            '_csrf_token' => 'invalid',
        ]);

        self::assertResponseRedirects('/login');
    }

    /** @param list<string> $roles */
    private function createUser(string $email, string $plainPassword, array $roles = [], bool $enabled = true): User
    {
        $user = (new User())
            ->setEmail($email)
            ->setRoles($roles)
            ->setEnabled($enabled);
        $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }
}
