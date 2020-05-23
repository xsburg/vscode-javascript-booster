import { File } from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { LanguageId, Selection } from './services/astService';
import { Position } from './utils/Position';

interface FileInfo {
    path: string;
    source: string;
    ast: Collection<File>;
    languageId: LanguageId;
}

type CodeModTransform = (
    fileInfo: FileInfo,
    api: { jscodeshift: JsCodeShift; stats(value: string): void },
    options: {
        target: Collection;
        anchorTarget: Collection;
        selection: Selection;
    }
) =>
    | string
    | undefined
    | null
    | {
          source: string;
          selection: Selection;
      };

type CanRunFunction = (
    fileInfo: FileInfo,
    api: { jscodeshift: JsCodeShift; stats(value: string): void },
    options: {
        target: Collection;
        anchorTarget: Collection;
        selection: Selection;
    }
) => boolean;

export interface CodeModExports extends CodeModTransform {
    canRun?: CanRunFunction;
    languageScope?: LanguageId[];
    scope?: 'global' | 'cursor';
    title?: string;
    description?: string;
    detail?: string;
}

export enum CodeModScope {
    Global = 'global',
    Cursor = 'cursor',
}

export interface CodeModDefinition {
    id: string;
    name: string;
    description: string;
    detail?: string;
    scope: CodeModScope;
    languageScope?: LanguageId[];
    modFn: CodeModTransform;
    canRun: CanRunFunction;
}
