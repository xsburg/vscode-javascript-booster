export const SELECTION_ANCHOR = '$a605add6-6288-4061-8727-c878c27e0d20$';

export function extractSelectionAnchor(source: string) {
    const selectionPos = source.indexOf(SELECTION_ANCHOR);
    source = source.replace(SELECTION_ANCHOR, '');
    return {
        source,
        selection: {
            anchor: selectionPos,
            active: selectionPos
        }
    };
}
