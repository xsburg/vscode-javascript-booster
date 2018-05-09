export const extensionId = 'javascriptBooster';

export type LanguageId = 'javascript' | 'javascriptreact' | 'typescript' | 'typescriptreact';

export const supportedLanguages: LanguageId[] = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact'
];

export function isSupportedLanguage(languageId: string): boolean {
    return supportedLanguages.indexOf(languageId as any) !== -1;
}

export const commandIds = {
    _executeCodeAction: `${extensionId}.executeCodeAction`,
    reloadCodeMods: `${extensionId}.reloadCodeMods`,
    extendSelection: `${extensionId}.extendSelection`,
    shrinkSelection: `${extensionId}.shrinkSelection`
};

export const configIds = {
    codemodDir: 'codemodDir',
    smartExtendFallbackCommand: 'smartExtendFallbackCommand',
    smartShrinkFallbackCommand: 'smartShrinkFallbackCommand'
};
