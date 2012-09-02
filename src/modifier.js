import { parse, Syntax } from esprima;

class Modifier {
    constructor(src) {
        this.ast = parse(src, { loc: true });
        this.lines = src.split('\n');
    }
    finish() {
        return this.lines.join('\n');
    };
    refresh() {
        this.ast = parse(this.finish(), { loc: true });
    };
    /**
     * Removes all text between `from` and `to`.
     * Removal is *inclusive* which means the char pointed to by `to` is removed
     * as well. This makes it possible to remove a complete expression by
     * calling remove(expr.start, expr.end);
     * `to` may also be the number of characters to remove
     */
    remove(from, to) {
        if (typeof to === 'number') {
            to = {line: from.line, column: from.column + to};
        }
        if (from.line === to.line) {
            // same line
            var line = this.lines[from.line - 1];
            this.lines[from.line - 1] = line.substring(0, from.column) + line.substring(to.column);
        } else {
            // different lines
            this.lines[from.line - 1] = this.lines[from.line - 1].substring(0, from.column);
            for (var lineno = from.line; lineno < to.line - 1; lineno++) {
                this.lines[lineno] = '';
            }
            this.lines[to.line - 1] = this.lines[to.line - 1].substring(to.column);
        }
    };
    insert(pos, text) {
        var line = this.lines[pos.line - 1];
        this.lines[pos.line - 1] = line.substring(0, pos.column) +
            text + line.substring(pos.column);
    };
    replace(from, to, text) {
        if (typeof to === 'number') {
            to = {line: from.line, column: from.column + to};
        }
        this.insert(to, text);
        this.remove(from, to);
    }
}

export var Modifier = Modifier;
/* vim: set sw=4 ts=4 et tw=80 : */
