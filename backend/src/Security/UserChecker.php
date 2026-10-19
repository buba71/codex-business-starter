<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User || $user->isEnabled()) {
            return;
        }

        $exception = new DisabledException('This account is disabled.');
        $exception->setUser($user);

        throw $exception;
    }

    public function checkPostAuth(UserInterface $user): void
    {
    }
}
