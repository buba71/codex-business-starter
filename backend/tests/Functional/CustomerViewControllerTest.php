<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class CustomerViewControllerTest extends WebTestCase
{
    public function testCustomerPageRendersVueComponentWithCustomerId(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/customers/42');

        self::assertResponseIsSuccessful();

        $component = $crawler->filter('[data-symfony--ux-vue--vue-component-value="CustomerDisplay"]');
        self::assertCount(1, $component);
        self::assertSame(
            '{"id":42}',
            $component->attr('data-symfony--ux-vue--vue-props-value'),
        );
    }
}
