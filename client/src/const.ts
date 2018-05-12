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
    executeCodeMod: `${extensionId}.executeCodeMod`,
    extendSelection: `${extensionId}.extendSelection`,
    shrinkSelection: `${extensionId}.shrinkSelection`
};

export const configIds = {
    smartExtendFallbackCommand: 'smartExtendFallbackCommand',
    smartShrinkFallbackCommand: 'smartShrinkFallbackCommand'
};
