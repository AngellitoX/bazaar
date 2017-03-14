<?php

namespace Flagrow\Bazaar\Validators;

use Flarum\Core\Validator\AbstractValidator;

class ClientValidator extends AbstractValidator
{

    protected function getRules()
    {
        return [
            'clientId' => [
                'required',
                'int'
            ],
            'clientSecret' => [
                'required',
                'string'
            ],
            'redirect' => [
                'required',
                'string',
                'url'
            ]
        ];
    }
}
