'use strict';

System.register('flagrow/bazaar/addBazaarPage', ['flarum/extend', 'flarum/app', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'flagrow/bazaar/components/BazaarPage'], function (_export, _context) {
    "use strict";

    var extend, app, AdminNav, AdminLinkButton, BazaarPage;

    _export('default', function () {
        // create the route
        app.routes['flagrow-bazaar'] = { path: '/flagrow/bazaar', component: BazaarPage.component() };

        // Add tab to admin menu
        extend(AdminNav.prototype, 'items', function (items) {
            items.add('flagrow-bazaar', AdminLinkButton.component({
                href: app.route('flagrow-bazaar'),
                icon: 'shopping-bag',
                children: app.translator.trans('flagrow-bazaar.admin.nav.title'),
                description: app.translator.trans('flagrow-bazaar.admin.nav.description')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_flagrowBazaarComponentsBazaarPage) {
            BazaarPage = _flagrowBazaarComponentsBazaarPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/bazaar/components/BazaarLoader', ['flarum/Component', 'flarum/helpers/icon'], function (_export, _context) {
    "use strict";

    var Component, icon, BazaarLoader;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }],
        execute: function () {
            BazaarLoader = function (_Component) {
                babelHelpers.inherits(BazaarLoader, _Component);

                function BazaarLoader() {
                    babelHelpers.classCallCheck(this, BazaarLoader);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarLoader.__proto__ || Object.getPrototypeOf(BazaarLoader)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarLoader, [{
                    key: 'view',
                    value: function view() {
                        return m('div', {
                            className: 'Bazaar--Loader',
                            hidden: !this.props.loading()
                        }, [m('div', [icon('shopping-cart'), m('span', [app.translator.trans('flagrow-bazaar.admin.loader.is_loading')])])]);
                    }
                }]);
                return BazaarLoader;
            }(Component);

            _export('default', BazaarLoader);
        }
    };
});;
"use strict";

System.register("flagrow/bazaar/components/BazaarPage", ["flarum/Component", "flagrow/bazaar/utils/ExtensionRepository", "flagrow/bazaar/components/ExtensionListItem", "flagrow/bazaar/components/BazaarLoader", "flarum/components/Button"], function (_export, _context) {
    "use strict";

    var Component, ExtensionRepository, ExtensionListItem, BazaarLoader, Button, BazaarPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flagrowBazaarUtilsExtensionRepository) {
            ExtensionRepository = _flagrowBazaarUtilsExtensionRepository.default;
        }, function (_flagrowBazaarComponentsExtensionListItem) {
            ExtensionListItem = _flagrowBazaarComponentsExtensionListItem.default;
        }, function (_flagrowBazaarComponentsBazaarLoader) {
            BazaarLoader = _flagrowBazaarComponentsBazaarLoader.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }],
        execute: function () {
            BazaarPage = function (_Component) {
                babelHelpers.inherits(BazaarPage, _Component);

                function BazaarPage() {
                    babelHelpers.classCallCheck(this, BazaarPage);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarPage.__proto__ || Object.getPrototypeOf(BazaarPage)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarPage, [{
                    key: "init",
                    value: function init() {
                        this.loading = m.prop(false);
                        this.repository = m.prop(new ExtensionRepository(this.loading));
                        this.repository().loadNextPage();
                        this.loader = BazaarLoader.component({ loading: this.loading });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        return m(
                            "div",
                            { className: "ExtensionsPage Bazaar" },
                            m(
                                "div",
                                { className: "ExtensionsPage-header" },
                                m(
                                    "div",
                                    { className: "container" },
                                    Button.component({
                                        icon: 'plug',
                                        className: 'Button Button--primary',
                                        children: app.translator.trans('flagrow-bazaar.admin.page.button.connect'),
                                        onclick: this.connect.bind(this)
                                    }),
                                    m(
                                        "span",
                                        null,
                                        app.translator.trans('flagrow-bazaar.admin.page.button.connect_info')
                                    )
                                )
                            ),
                            m(
                                "div",
                                { className: "ExtensionsPage-list" },
                                m(
                                    "div",
                                    { className: "container" },
                                    this.items()
                                )
                            ),
                            this.loader
                        );
                    }
                }, {
                    key: "items",
                    value: function items() {
                        var _this2 = this;

                        return m('ul', { className: 'ExtensionList' }, [this.repository().extensions().map(function (extension) {
                            return ExtensionListItem.component({ extension: extension, repository: _this2.repository });
                        })]);
                    }
                }, {
                    key: "connect",
                    value: function connect() {
                        this.loading(true);

                        app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/bazaar/connect'
                        }).then(this.connectRedirect.bind(this), this.connectFailed.bind(this));
                    }
                }, {
                    key: "connectRedirect",
                    value: function connectRedirect(response) {
                        window.location.href = response;
                    }
                }, {
                    key: "connectFailed",
                    value: function connectFailed(response) {
                        console.log(response);
                    }
                }]);
                return BazaarPage;
            }(Component);

            _export("default", BazaarPage);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/components/BazaarSettingsModal', ['flarum/app', 'flarum/components/SettingsModal'], function (_export, _context) {
    "use strict";

    var app, SettingsModal, BazaarSettingsModal;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal.default;
        }],
        execute: function () {
            BazaarSettingsModal = function (_SettingsModal) {
                babelHelpers.inherits(BazaarSettingsModal, _SettingsModal);

                function BazaarSettingsModal() {
                    babelHelpers.classCallCheck(this, BazaarSettingsModal);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarSettingsModal.__proto__ || Object.getPrototypeOf(BazaarSettingsModal)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarSettingsModal, [{
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('flagrow-bazaar.admin.popup.title');
                    }
                }, {
                    key: 'form',
                    value: function form() {
                        return [m('div', { className: 'Form-group' }, [m('label', { for: 'bazaar-api-token' }, app.translator.trans('flagrow-bazaar.admin.popup.field.apiToken')), m('input', {
                            id: 'bazaar-api-token',
                            className: 'FormControl',
                            bidi: this.setting('flagrow.bazaar.api_token'),
                            disabled: this.setting('flagrow.bazaar.api_token')().length > 0
                        }), m('span', app.translator.trans('flagrow-bazaar.admin.popup.field.apiTokenDescription'))])];
                    }
                }]);
                return BazaarSettingsModal;
            }(SettingsModal);

            _export('default', BazaarSettingsModal);
        }
    };
});;
"use strict";

System.register("flagrow/bazaar/components/ExtensionListItem", ["flarum/Component", "flarum/helpers/icon", "flarum/utils/ItemList", "flarum/components/Button", "flarum/components/Dropdown", "flarum/components/Badge"], function (_export, _context) {
    "use strict";

    var Component, icon, ItemList, Button, Dropdown, Badge, ExtensionListItem;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsDropdown) {
            Dropdown = _flarumComponentsDropdown.default;
        }, function (_flarumComponentsBadge) {
            Badge = _flarumComponentsBadge.default;
        }],
        execute: function () {
            ExtensionListItem = function (_Component) {
                babelHelpers.inherits(ExtensionListItem, _Component);

                function ExtensionListItem() {
                    babelHelpers.classCallCheck(this, ExtensionListItem);
                    return babelHelpers.possibleConstructorReturn(this, (ExtensionListItem.__proto__ || Object.getPrototypeOf(ExtensionListItem)).apply(this, arguments));
                }

                babelHelpers.createClass(ExtensionListItem, [{
                    key: "config",
                    value: function config(isInitialized) {
                        if (isInitialized) return;

                        if (this.props.extension.description()) this.$().tooltip({ container: 'body' });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var extension = this.props.extension;
                        var controls = this.controlItems(extension).toArray();

                        return m(
                            "li",
                            { className: 'ExtensionListItem ' + (extension.enabled() ? 'enabled ' : 'disabled ') + (extension.installed() ? 'installed' : 'uninstalled') + (extension.enabled() && extension.highest_version() && extension.installed_version() != extension.highest_version() ? 'update' : ''), title: extension.description() },
                            m(
                                "div",
                                { className: "ExtensionListItem-content" },
                                m(
                                    "span",
                                    { className: "ExtensionListItem-icon ExtensionIcon", style: extension.icon() || '' },
                                    extension.icon() ? icon(extension.icon().name) : ''
                                ),
                                m(
                                    "ul",
                                    { className: "ExtensionListItem-badges badges" },
                                    this.badges(extension).toArray()
                                ),
                                controls.length ? m(
                                    Dropdown,
                                    {
                                        className: "ExtensionListItem-controls",
                                        buttonClassName: "Button Button--icon Button--flat",
                                        menuClassName: "Dropdown-menu--right",
                                        icon: "ellipsis-h" },
                                    controls
                                ) : '',
                                m(
                                    "label",
                                    { className: "ExtensionListItem-title" },
                                    extension.title() || extension.package()
                                ),
                                m(
                                    "label",
                                    { className: "ExtensionListItem-version" },
                                    app.translator.trans('flagrow-bazaar.admin.page.extension.vendor', {
                                        vendor: extension.package().split('/')[0]
                                    })
                                ),
                                m(
                                    "div",
                                    { className: "ExtensionListItem-version" },
                                    extension.highest_version()
                                )
                            )
                        );
                    }
                }, {
                    key: "controlItems",
                    value: function controlItems(extension) {
                        var items = new ItemList();
                        var repository = this.props.repository;

                        if (extension.enabled() && app.extensionSettings[name]) {
                            items.add('settings', Button.component({
                                icon: 'cog',
                                children: app.translator.trans('core.admin.extensions.settings_button'),
                                onclick: app.extensionSettings[name]
                            }));
                        }

                        if (extension.installed() && !extension.enabled()) {
                            items.add('uninstall', Button.component({
                                icon: 'minus-square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.uninstall'),
                                onclick: function onclick() {
                                    repository().uninstallExtension(extension);
                                }
                            }));
                            items.add('enable', Button.component({
                                icon: 'check-square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.enable'),
                                onclick: function onclick() {
                                    repository().enableExtension(extension);
                                }
                            }));
                        }

                        if (extension.installed() && extension.enabled()) {
                            items.add('disable', Button.component({
                                icon: 'square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.disable'),
                                onclick: function onclick() {
                                    repository().disableExtension(extension);
                                }
                            }));
                        }

                        if (!extension.installed()) {
                            items.add('install', Button.component({
                                icon: 'plus-square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.install'),
                                onclick: function onclick() {
                                    repository().installExtension(extension);
                                }
                            }));
                        }

                        return items;
                    }
                }, {
                    key: "badges",
                    value: function badges(extension) {
                        var items = new ItemList();

                        if (extension.installed()) {
                            items.add('installed', m(Badge, { icon: "plus-square", type: "installed", label: app.translator.trans('flagrow-bazaar.admin.page.extension.installed') }));
                        }
                        if (extension.enabled()) {
                            items.add('enabled', m(Badge, { icon: "check-square", type: "enabled", label: app.translator.trans('flagrow-bazaar.admin.page.extension.enabled') }));
                        }

                        return items;
                    }
                }]);
                return ExtensionListItem;
            }(Component);

            _export("default", ExtensionListItem);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/main', ['flarum/extend', 'flarum/app', 'flagrow/bazaar/components/BazaarSettingsModal', 'flagrow/bazaar/models/Extension', 'flagrow/bazaar/addBazaarPage'], function (_export, _context) {
    "use strict";

    var extend, app, BazaarSettingsModal, Extension, addBazaarPage;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowBazaarComponentsBazaarSettingsModal) {
            BazaarSettingsModal = _flagrowBazaarComponentsBazaarSettingsModal.default;
        }, function (_flagrowBazaarModelsExtension) {
            Extension = _flagrowBazaarModelsExtension.default;
        }, function (_flagrowBazaarAddBazaarPage) {
            addBazaarPage = _flagrowBazaarAddBazaarPage.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-bazaar', function (app) {
                app.extensionSettings['flagrow-bazaar'] = function () {
                    return app.modal.show(new BazaarSettingsModal());
                };
                app.store.models['bazaar-extensions'] = Extension;

                addBazaarPage();
            });
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/models/Extension', ['flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
    "use strict";

    var Model, mixin, computed, Extension;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }, function (_flarumUtilsComputed) {
            computed = _flarumUtilsComputed.default;
        }],
        execute: function () {
            Extension = function (_mixin) {
                babelHelpers.inherits(Extension, _mixin);

                function Extension() {
                    babelHelpers.classCallCheck(this, Extension);
                    return babelHelpers.possibleConstructorReturn(this, (Extension.__proto__ || Object.getPrototypeOf(Extension)).apply(this, arguments));
                }

                return Extension;
            }(mixin(Model, {
                package: Model.attribute('package'),
                title: Model.attribute('title'),
                description: Model.attribute('description'),
                license: Model.attribute('license'),
                icon: Model.attribute('icon'),

                stars: Model.attribute('stars'),
                forks: Model.attribute('forks'),
                downloads: Model.attribute('downloads'),

                installed: Model.attribute('installed'),
                enabled: Model.attribute('enabled'),
                installed_version: Model.attribute('installed_version'),
                highest_version: Model.attribute('highest_version'),

                flarum_id: Model.attribute('flarum_id'),

                can_install: computed('installed', function (installed) {
                    return !installed;
                }),
                can_uninstall: computed('installed', 'enabled', function (installed, enabled) {
                    return installed && !enabled;
                })
            }));

            _export('default', Extension);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/utils/ExtensionRepository', ['flarum/app'], function (_export, _context) {
    "use strict";

    var app, ExtensionRepository;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }],
        execute: function () {
            ExtensionRepository = function () {
                function ExtensionRepository(loading) {
                    babelHelpers.classCallCheck(this, ExtensionRepository);

                    this.extensions = m.prop([]);
                    this.nextPageUrl = null;
                    this.loading = loading;
                    this.resetNavigation();
                }

                /**
                 * Loads next page or resets based on nextPageUrl.
                 */


                babelHelpers.createClass(ExtensionRepository, [{
                    key: 'loadNextPage',
                    value: function loadNextPage() {
                        var _this = this;

                        if (this.loading() || !this.nextPageUrl) {
                            return;
                        }

                        this.loading(true);

                        app.request({
                            method: 'GET',
                            url: this.nextPageUrl
                        }).then(function (result) {
                            var newExtensions = result.data.map(function (data) {
                                return app.store.createRecord('bazaar-extensions', data);
                            });
                            // start/end computation is required for the admin UI to refresh after the new extensions have been loaded
                            // this.extensions(this.extensions().concat(newExtensions));
                            _this.extensions(newExtensions);
                            _this.nextPageUrl = result.links.next;
                            _this.loading(false);

                            m.redraw();
                        });
                    }
                }, {
                    key: 'resetNavigation',
                    value: function resetNavigation() {
                        this.loading(false); // Might cause problems if an update is in process
                        this.nextPageUrl = app.forum.attribute('apiUrl') + '/bazaar/extensions';
                        this.extensions([]);
                    }
                }, {
                    key: 'installExtension',
                    value: function installExtension(extension) {
                        this.loading(true);

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/bazaar/extensions',
                            timeout: 0,
                            data: {
                                id: extension.id()
                            }
                        }).then(this.updateExtension.bind(this, extension, 'installed', true), this.installFailure.bind(this, extension));
                    }
                }, {
                    key: 'installFailure',
                    value: function installFailure(extension) {
                        this.resetNavigation();
                        this.loadNextPage();
                    }
                }, {
                    key: 'uninstallExtension',
                    value: function uninstallExtension(extension) {
                        this.loading(true);

                        app.request({
                            method: 'DELETE',
                            timeout: 0,
                            url: app.forum.attribute('apiUrl') + '/bazaar/extensions/' + extension.id()
                        }).then(this.updateExtension.bind(this, extension, 'installed', false), this.uninstallFailure.bind(this, extension));
                    }
                }, {
                    key: 'uninstallFailure',
                    value: function uninstallFailure(extension) {
                        this.resetNavigation();
                        this.loadNextPage();
                    }
                }, {
                    key: 'toggleExtension',
                    value: function toggleExtension(extension) {
                        var _this2 = this;

                        this.loading(true);

                        var enabled = extension.enabled();

                        app.request({
                            url: app.forum.attribute('apiUrl') + '/extensions/' + extension.flarum_id(),
                            method: 'PATCH',
                            data: { enabled: !enabled }
                        }).then(function () {
                            _this2.updateExtension(extension, 'enabled', !enabled);
                        });
                    }
                }, {
                    key: 'disableExtension',
                    value: function disableExtension(extension) {
                        this.toggleExtension(extension);
                    }
                }, {
                    key: 'enableExtension',
                    value: function enableExtension(extension) {
                        this.toggleExtension(extension);
                    }
                }, {
                    key: 'getExtensionIndex',
                    value: function getExtensionIndex(extension) {
                        return this.extensions().findIndex(function (ext) {
                            return ext.id() == extension.id();
                        });
                    }
                }, {
                    key: 'updateExtension',
                    value: function updateExtension(extension, property, value) {
                        this.extensions()[this.getExtensionIndex(extension)][property](value);
                        this.resetNavigation();
                        this.loadNextPage();
                    }
                }]);
                return ExtensionRepository;
            }();

            _export('default', ExtensionRepository);
        }
    };
});