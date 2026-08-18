<?php

namespace App\Customer\Domain;

enum CustomerStatus: string
{
    case ACTIVE = 'ACTIVE';
    case INACTIVE = 'INACTIVE';
}
