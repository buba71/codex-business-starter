<?php

namespace App\Tests\Functional;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class CreateAdminCommandTest extends KernelTestCase
{
    public function testCommandCreatesNormalizedEnabledAdminWithHashedPassword(): void
    {
        $tester = $this->createCommandTester();
        $tester->setInputs(['a-secure-password']);

        $status = $tester->execute(['email' => '  Admin@Example.COM ']);

        self::assertSame(Command::SUCCESS, $status);
        self::assertStringNotContainsString('a-secure-password', $tester->getDisplay());

        $user = self::getContainer()->get(UserRepository::class)->loadUserByIdentifier('admin@example.com');
        self::assertInstanceOf(User::class, $user);
        self::assertTrue($user->isEnabled());
        self::assertContains(User::ROLE_ADMIN, $user->getRoles());
        self::assertContains(User::ROLE_USER, $user->getRoles());
        self::assertNotSame('a-secure-password', $user->getPassword());
        self::assertTrue(self::getContainer()->get(UserPasswordHasherInterface::class)->isPasswordValid($user, 'a-secure-password'));
    }

    public function testCommandRejectsShortPassword(): void
    {
        $tester = $this->createCommandTester();
        $tester->setInputs(['too-short']);

        $status = $tester->execute(['email' => 'short@example.com']);

        self::assertSame(Command::INVALID, $status);
        self::assertNull(self::getContainer()->get(UserRepository::class)->loadUserByIdentifier('short@example.com'));
    }

    public function testCommandRejectsDuplicateEmailWithoutRequestingPassword(): void
    {
        $first = $this->createCommandTester();
        $first->setInputs(['a-secure-password']);
        self::assertSame(Command::SUCCESS, $first->execute(['email' => 'duplicate@example.com']));

        $second = $this->createCommandTester();
        $status = $second->execute(['email' => ' DUPLICATE@example.com ']);

        self::assertSame(Command::FAILURE, $status);
    }

    private function createCommandTester(): CommandTester
    {
        self::bootKernel();
        $application = new Application(self::getContainer()->get(KernelInterface::class));

        return new CommandTester($application->find('app:create-admin'));
    }
}
