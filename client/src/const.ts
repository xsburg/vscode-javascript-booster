export const extensionId = 'javascriptBooster';

export type LanguageId = 'javascript' | 'javascriptreact' | 'typescript' | 'typescriptreact';

const supportedLanguages: LanguageId[] = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact'
];

export function isSupportedLanguage(languageId: string): boolean {
    return supportedLanguages.indexOf(languageId as any) !== -1;
}

export const commandIds = {
    runCodeMod: `${extensionId}.runCodeMod`,
    reloadCodeMods: `${extensionId}.reloadCodeMods`,
    extendSelection: `${extensionId}.extendSelection`,
    shrinkSelection: `${extensionId}.shrinkSelection`
};

export const configIds = {
    codemodDir: 'codemodDir',
    smartExtendFallbackCommand: 'smartExtendFallbackCommand',
    smartShrinkFallbackCommand: 'smartShrinkFallbackCommand'
};
