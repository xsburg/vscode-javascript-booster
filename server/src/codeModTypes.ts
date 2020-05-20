import { $Collection, File, JSCodeshift } from 'jscodeshift';

import { Selection } from './services/astService';
import { Position } from './utils/Position';

type CodeModTransform = (
    fileInfo: { path: string; source: string; ast: $Collection<File> },
    api: { jscodeshift: JSCodeshift; stats(value: string): void },
    options: {
        target: $Collection;
        anchorTarget: $Collection;
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
    fileInfo: { path: string; source: string; ast: $Collection<File> },
    api: { jscodeshift: JSCodeshift; stats(value: string): void },
    options: {
        target: $Collection;
        anchorTarget: $Collection;
        selection: Selection;
    }
) => boolean;

export interface CodeModExports extends CodeModTransform {
    canRun?: CanRunFunction;
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
    modFn: CodeModTransform;
    canRun: CanRunFunction;
}
