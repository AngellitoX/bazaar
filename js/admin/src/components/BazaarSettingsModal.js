import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';
import Switch from 'flarum/components/Switch';

export default class BazaarSettingsModal extends SettingsModal {
    init() {
        super.init();

        this.memoryBump = m.prop(this.settings['flagrow.bazaar.memory_bump'] == 1);
    }

    title() {
        return app.translator.trans('flagrow-bazaar.admin.popup.title');
    }

    form() {
        return [
            m('div', {className: 'Form-group'}, [
                m('label', {for: 'bazaar-api-token'}, app.translator.trans('flagrow-bazaar.admin.popup.field.apiToken')),
                m('input', {
                    id: 'bazaar-api-token',
                    className: 'FormControl',
                    bidi: this.setting('flagrow.bazaar.api_token')
                }),
                m('span', app.translator.trans('flagrow-bazaar.admin.popup.field.apiTokenDescription'))
            ]),

            m('div', {className: 'Form-group'}, [
                Switch.component({
                    state: this.memoryBump(),
                    children: app.translator.trans('flagrow-bazaar.admin.popup.field.memoryBump'),
                    onchange: this.setting('flagrow.bazaar.memory_bump')
                }),

                m('span', app.translator.trans('flagrow-bazaar.admin.popup.field.memoryBumpDescription'))
            ]),
        ];
    }

}
