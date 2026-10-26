<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in([
        __DIR__.'/src',
        __DIR__.'/tests',
    ]);

return (new Config())
    ->setRiskyAllowed(false)
    ->setRules([
        '@Symfony' => true,
    ])
    ->setFinder($finder);
