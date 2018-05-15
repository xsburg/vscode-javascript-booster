export default function(before: string, after: string) {
    let startPosBefore = 0;
    let startPosAfter = 0;
    while (startPosBefore < before.length && startPosAfter < after.length) {
        const cb = before[startPosBefore];
        const ca = after[startPosAfter];
        if (cb === ca) {
            startPosBefore++;
            startPosAfter++;
        } else if (cb === '\r' && before[startPosBefore + 1] === '\n' && ca === '\n') {
            // \n removed after transformation
            startPosBefore++;
        } else if (ca === '\r' && after[startPosAfter + 1] === '\n' && cb === '\n') {
            // \n added after transformation
            startPosAfter++;
        } else {
            break;
        }
    }

    let endPosBefore = before.length;
    let endPosAfter = after.length;
    while (endPosBefore - 1 >= startPosBefore && endPosAfter - 1 >= startPosAfter) {
        const cb = before[endPosBefore - 1];
        const ca = after[endPosAfter - 1];
        if (cb === ca) {
            endPosBefore--;
            endPosAfter--;
        } else if (cb === '\r' && before[endPosBefore] === '\n') {
            // \n removed after transformation
            endPosBefore--;
        } else if (ca === '\r' && after[endPosAfter] === '\n') {
            // \n added after transformation
            endPosAfter--;
        } else {
            break;
        }
    }

    const newText = after.substring(startPosAfter, endPosAfter);
    return {
        range: {
            start: startPosBefore,
            end: endPosBefore
        },
        newText
    };
}
