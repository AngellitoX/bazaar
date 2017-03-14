<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Search\FlagrowApi;
use Flagrow\Bazaar\Validators\ClientValidator;
use Flarum\Core\Exception\PermissionDeniedException;
use Flarum\Core\User;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\JsonResponse;

class BazaarConnectController implements ControllerInterface
{

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    /**
     * @var FlagrowApi
     */
    protected $api;
    /**
     * @var ClientValidator
     */
    protected $validator;

    function __construct(SettingsRepositoryInterface $settings, FlagrowApi $api, ClientValidator $validator)
    {
        $this->settings = $settings;
        $this->api = $api;
        $this->validator = $validator;
    }

    /**
     * @param ServerRequestInterface $request
     * @return \Psr\Http\Message\ResponseInterface
     * @throws PermissionDeniedException
     */
    public function handle(ServerRequestInterface $request)
    {
        /** @var User $actor */
        $actor = $request->getAttribute('actor');

        if (!$actor || !$actor->isAdmin()) {
            throw new PermissionDeniedException('Only admin can connect Bazaar');
        }

        $response = $this->api->get('bazaar/connect');

        if ($response->getStatusCode() === 201) {
            $clientId = $response->getHeader('Client-Id');
            $clientSecret = $response->getHeader('Client-Secret');
            $redirect = $response->getHeader('Client-Redirect');

            $this->validator->assertValid(compact('clientId', 'clientSecret', 'redirect'));

            $this->settings->set('flagrow.bazaar.client_id', $clientId);
            $this->settings->set('flagrow.bazaar.client_secret', $clientSecret);
            $this->settings->set('flagrow.bazaar.client_redirect', $redirect);

            return new JsonResponse($redirect, 201);
        }

        throw new PermissionDeniedException('Could not create oauth client');
    }
}
