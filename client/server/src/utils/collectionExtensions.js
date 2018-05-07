"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPositionWithinNode(position, node) {
    return node.start <= position && position < node.end;
}
function registerCollectionExtensions(j) {
    j.registerMethods({
        firstNode() {
            return this.nodes()[0] || null;
        },
        firstPath() {
            return this.paths()[0] || null;
        },
        parents() {
            return this.thisAndParents().slice(1);
        },
        thisAndParents() {
            if (this.length > 1) {
                throw new Error('The operation is only available for single-node collections.');
            }
            const path = this.firstPath();
            if (!path) {
                return [];
            }
            const result = [path.node];
            let parent = path.parent;
            while (parent) {
                result.push(parent.node);
                parent = parent.parent;
            }
            return result;
        },
        findNodeAtPosition(pos) {
            const matched = this.find(j.Node).filter(path => isPositionWithinNode(pos, path.node));
            const c = matched.at(-1);
            return c;
        },
        findNodeInRange(start, end) {
            if (start > end) {
                [start, end] = [end, start];
            }
            const matched = this.find(j.Node).filter(path => path.node.start <= start && end <= path.node.end);
            const c = matched.at(-1);
            return c;
        },
        thisOrClosest(type, filter) {
            return this.map(path => {
                let target = path;
                while (target &&
                    !(type.check(target.value) && (!filter || j.match(target.value, filter)))) {
                    target = target.parent;
                }
                return target || null;
            });
        },
        furthest(type, filter) {
            return this.map(path => {
                let furthestPath = null;
                let target = path.parent;
                while (target) {
                    if (type.check(target.value) && (!filter || j.match(target.value, filter))) {
                        furthestPath = target;
                    }
                    target = target.parent;
                }
                return furthestPath;
            });
        }
    });
}
exports.registerCollectionExtensions = registerCollectionExtensions;
//# sourceMappingURL=collectionExtensions.js.map