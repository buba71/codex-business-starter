<?php

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

final class UserTest extends TestCase
{
    public function testEmailIsNormalizedAndUserRoleIsImplicit(): void
    {
        $user = (new User())
            ->setEmail('  Admin@Example.COM ')
            ->setRoles([User::ROLE_ADMIN, User::ROLE_ADMIN]);

        self::assertSame('admin@example.com', $user->getEmail());
        self::assertSame('admin@example.com', $user->getUserIdentifier());
        self::assertSame([User::ROLE_ADMIN, User::ROLE_USER], $user->getRoles());
    }
}
