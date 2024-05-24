import { useModshinSettings, useSettingsStoreActions } from '../../../../store/settings.store';
import {
    SettingsSection,
    SettingOption,
} from '/@/renderer/features/settings/components/settings-section';
import { useTranslation } from 'react-i18next';
import { Select, Switch, toast, NumberInput } from '/@/renderer/components';
import { VisualiserType, VisualiserColorMode, VisualiserFreqScale, VisualiserMode } from '/@/renderer/types';
import { useState } from 'react';


export const ModSettings = () => {
    // Define your settings here
    const { t } = useTranslation();
    const settings = useModshinSettings();
    const { setSettings } = useSettingsStoreActions();

    // Define your options here
    const modshinOptions = [
        {
            control: (
                <Switch
                    defaultChecked={settings.autoPlay}
                    onChange={(e) => {
                        if (!e) return;
                        setSettings({
                            modshin: {
                                ...settings,
                                autoPlay: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.autoPlay', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.autoPlay', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.lyricAnimations}
                    onChange={(e) => {
                        if (!e) return;
                        setSettings({
                            modshin: {
                                ...settings,
                                lyricAnimations: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.lyricAnimations', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.lyricAnimations', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <NumberInput
                    defaultValue={settings.historyLength}
                    onBlur={(e) => {
                        setSettings({
                            modshin: {
                                ...settings,
                                historyLength: parseInt(e.currentTarget.value, 10),
                            },
                        });
                    }}
                />
            ),
            description: t('setting.historyLength', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.historyLength', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <NumberInput
                    defaultValue={settings.steelseriesPort}
                    onBlur={(e) => {
                        setSettings({
                            modshin: {
                                ...settings,
                                steelseriesPort: parseInt(e.currentTarget.value, 10),
                            },
                        });
                    }}
                />
            ),
            description: t('setting.steelseries', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.steelseries', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Select
                    defaultValue={settings.visualiser}
                    data={Object.values(VisualiserType)}
                    onChange={(e: VisualiserType[]) => {
                        setSettings({
                            modshin: {
                                ...settings,
                                visualiser: e,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.visualiser', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.visualiser', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Select
                    defaultValue={settings.visualiserColorMode}
                    data={Object.values(VisualiserColorMode)}
                    onChange={(e: VisualiserColorMode[]) => {
                        setSettings({
                            modshin: {
                                ...settings,
                                visualiserColorMode: e,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.visualiserColorMode', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.visualiserColorMode', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Select
                    defaultValue={settings.visualiserFreqScale}
                    data={Object.values(VisualiserFreqScale)}
                    onChange={(e: VisualiserFreqScale[]) => {
                        setSettings({
                            modshin: {
                                ...settings,
                                visualiserFreqScale: e,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.visualiserFreqScale', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.visualiserFreqScale', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Select
                    defaultValue={settings.visualiserMode}
                    data={Object.values(VisualiserMode)}
                    onChange={(e: VisualiserMode[]) => {
                        setSettings({
                            modshin: {
                                ...settings,
                                visualiserMode: e,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.visualiserMode', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.visualiserMode', { postProcess: 'sentenceCase' }),
        }
    ];

    return <SettingsSection options={modshinOptions} />;
};
