<?php

namespace App\Security;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class CustomerApiCsrfSubscriber implements EventSubscriberInterface
{
    private const TOKEN_ID = 'customer_api';

    public function __construct(private CsrfTokenManagerInterface $csrfTokenManager)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::CONTROLLER => 'validate'];
    }

    public function validate(ControllerEvent $event): void
    {
        $request = $event->getRequest();
        if (!in_array($request->getMethod(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)
            || !preg_match('#^/api/v1/customers(?:/|$)#', $request->getPathInfo())
        ) {
            return;
        }

        $token = $request->headers->get('X-CSRF-Token');
        if (is_string($token) && $this->csrfTokenManager->isTokenValid(new CsrfToken(self::TOKEN_ID, $token))) {
            return;
        }

        $event->setController(static fn (): JsonResponse => new JsonResponse([
            'error' => [
                'code' => 'csrf_token_invalid',
                'message' => 'A valid CSRF token is required.',
                'details' => [],
            ],
        ], JsonResponse::HTTP_FORBIDDEN));
    }
}
