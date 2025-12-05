<?php

use App\Entity\PC;
use App\Kernel;
use Symfony\Component\HttpFoundation\Request;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return function (array $context) {
    $kernel = new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
    $kernel->boot();
    $container = $kernel->getContainer();
    $em = $container->get('doctrine')->getManager();

    $pcs = $em->getRepository(PC::class)->findAll();

    foreach ($pcs as $pc) {
        echo "ID: " . $pc->getId() . "\n";
        echo "IsActif (getter): " . ($pc->isActif() ? 'true' : 'false') . "\n";
        // Reflection to check property directly
        $ref = new ReflectionClass($pc);
        $prop = $ref->getProperty('isActif');
        $prop->setAccessible(true);
        echo "IsActif (property): " . ($prop->getValue($pc) ? 'true' : 'false') . "\n";
        echo "-------------------\n";
    }
};
