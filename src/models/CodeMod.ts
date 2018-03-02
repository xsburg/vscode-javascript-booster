type CodeModTransform = (
    fileInfo: { path: string; source: string },
    api: { jscodeshift: any; stats: any },
    options: {
        selection: {
            startPos: number;
            endPos: number;
        };
    }) => string | undefined | null;

export interface CodeModDefinition {
    name: string;
    description: string;
    detail?: string;
    modFn: CodeModTransform;
}

export interface CodeModExports extends CodeModTransform {
    name?: string;
    description?: string;
    detail?: string;
}
