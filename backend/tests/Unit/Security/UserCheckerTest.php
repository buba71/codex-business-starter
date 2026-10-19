<?php

namespace App\Tests\Unit\Security;

use App\Entity\User;
use App\Security\UserChecker;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Exception\DisabledException;

final class UserCheckerTest extends TestCase
{
    public function testEnabledUserIsAccepted(): void
    {
        $user = (new User())->setEnabled(true);

        (new UserChecker())->checkPreAuth($user);

        self::addToAssertionCount(1);
    }

    public function testDisabledUserIsRejected(): void
    {
        $user = (new User())->setEnabled(false);

        $this->expectException(DisabledException::class);

        (new UserChecker())->checkPreAuth($user);
    }
}
