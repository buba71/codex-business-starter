<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\Authorization\AccessDeniedHandlerInterface;

final class ApiAccessDeniedHandler implements AccessDeniedHandlerInterface
{
    public function handle(Request $request, AccessDeniedException $accessDeniedException): ?Response
    {
        if (1 !== preg_match('#^/api/v1/customers(?:/|$)#', $request->getPathInfo())) {
            return null;
        }

        return new JsonResponse([
            'error' => [
                'code' => 'access_denied',
                'message' => 'Access denied.',
                'details' => [],
            ],
        ], Response::HTTP_FORBIDDEN);
    }
}
