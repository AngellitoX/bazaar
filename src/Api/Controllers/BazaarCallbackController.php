<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Search\FlagrowApi;
use Flarum\Admin\UrlGenerator as AdminUrl;
use Flarum\Forum\UrlGenerator as ForumUrl;
use Flarum\Core\Exception\PermissionDeniedException;
use Flarum\Core\User;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\RedirectResponse;

class BazaarCallbackController implements ControllerInterface
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
     * @var UrlGenerator
     */
    protected $url;
    /**
     * @var AdminUrl
     */
    protected $adminUrl;
    /**
     * @var ForumUrl
     */
    protected $forumUrl;

    function __construct(SettingsRepositoryInterface $settings, FlagrowApi $api, AdminUrl $adminUrl, ForumUrl $forumUrl)
    {
        $this->settings = $settings;
        $this->api = $api;
        $this->adminUrl = $adminUrl;
        $this->forumUrl = $forumUrl;
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
            throw new PermissionDeniedException('Only an admin can connect Bazaar');
        }

        $response = $this->api->post('/oauth/token', [
            'form_params' => [
                'grant_type' => 'authorization_code',
                'client_id' => $this->settings->get('flagrow.bazaar.client_id'),
                'client_secret' => $this->settings->get('flagrow.bazaar.client_secret'),
                'redirect_uri' => $this->forumUrl->toRoute('bazaar.connect.callback'),
                'code' => Arr::get($request->getQueryParams(), 'code')
            ]
        ]);

        if ($response->getStatusCode() === 200) {
            $json = json_decode((string) $response->getBody(), true);

            $this->settings->set('flagrow.bazaar.api_token', Arr::get($json, 'access_token'));
            $this->settings->set('flagrow.bazaar.refresh_token', Arr::get($json, 'refresh_token'));
            $this->settings->set('flagrow.bazaar.api_token_expires_in', Arr::get($json, 'expires_in'));

            return new RedirectResponse($this->adminUrl->toBase());
        }

        throw new PermissionDeniedException('OAuth authentication failed');
    }
}
