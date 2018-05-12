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
    reloadCodeMods: `${extensionId}.reloadCodeMods`
};

export const configIds = {
    codemodDir: 'codemodDir'
};
