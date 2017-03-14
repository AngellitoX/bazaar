<?php

namespace Flagrow\Bazaar\Listeners;

use Flagrow\Bazaar\Api\Controllers\BazaarCallbackController;
use Flagrow\Bazaar\Api\Controllers\BazaarConnectController;
use Flagrow\Bazaar\Api\Controllers\CreateExtensionController;
use Flagrow\Bazaar\Api\Controllers\ListExtensionController;
use Flagrow\Bazaar\Api\Controllers\UninstallExtensionController;
use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\ConfigureForumRoutes;
use Illuminate\Events\Dispatcher;

class AddControllers
{
    /**
     * Subscribes to the Flarum api routes configuration event.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        $events->listen(ConfigureForumRoutes::class, [$this, 'configureForumRoutes']);
    }

    /**
     * Registers our routes.
     *
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        // Browse extensions
        $event->get(
            '/bazaar/extensions',
            'bazaar.extensions.index',
            ListExtensionController::class
        );

        // Install an extension
        $event->post(
            '/bazaar/extensions',
            'bazaar.extensions.update',
            CreateExtensionController::class
        );

        // Uninstall an extension
        $event->delete(
            '/bazaar/extensions/{id}',
            'bazaar.extensions.delete',
            UninstallExtensionController::class
        );

        // Connect
        $event->get(
            '/bazaar/connect',
            'bazaar.connect',
            BazaarConnectController::class
        );
    }

    public function configureForumRoutes(ConfigureForumRoutes $event)
    {
        // Connect callback
        $event->get(
            '/bazaar/auth/callback',
            'bazaar.connect.callback',
            BazaarCallbackController::class
        );
    }
}
