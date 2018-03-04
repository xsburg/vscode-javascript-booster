declare module 'recast' {
    export type RecastParserOptions = any;
    export type RecastPrinterOptions = any;

    export interface Parser {
        parse(source: string, options?: RecastParserOptions);
    }
}
