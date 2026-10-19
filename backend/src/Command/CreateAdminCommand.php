<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:create-admin', description: 'Create an enabled administrator account.')]
final class CreateAdminCommand extends Command
{
    private const MAXIMUM_EMAIL_LENGTH = 180;
    private const MINIMUM_PASSWORD_LENGTH = 12;

    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('email', InputArgument::REQUIRED, 'Administrator email address');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = User::normalizeEmail((string) $input->getArgument('email'));

        if (self::MAXIMUM_EMAIL_LENGTH < strlen($email) || false === filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $io->error('Enter a valid email address.');

            return Command::INVALID;
        }

        if (null !== $this->userRepository->loadUserByIdentifier($email)) {
            $io->error('An account with this email address already exists.');

            return Command::FAILURE;
        }

        $question = (new Question('Password: '))
            ->setHidden(true)
            ->setHiddenFallback(false);
        $password = $io->askQuestion($question);

        if (!is_string($password) || self::MINIMUM_PASSWORD_LENGTH > mb_strlen($password)) {
            $io->error(sprintf('The password must contain at least %d characters.', self::MINIMUM_PASSWORD_LENGTH));

            return Command::INVALID;
        }

        $user = (new User())
            ->setEmail($email)
            ->setRoles([User::ROLE_ADMIN])
            ->setEnabled(true);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException) {
            $io->error('An account with this email address already exists.');

            return Command::FAILURE;
        }

        $io->success(sprintf('Administrator %s was created.', $user->getEmail()));

        return Command::SUCCESS;
    }
}
