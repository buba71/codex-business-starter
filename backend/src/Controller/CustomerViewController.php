<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class CustomerViewController extends AbstractController
{
    #[Route('/customers/{id}', name: 'customer_view', methods: ['GET'])]
    public function show(int $id): Response
    {
        return $this->render('customer/show.html.twig', [
            'id' => $id,
        ]);
    }
}
