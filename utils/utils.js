import fs from 'fs/promises';
import path from 'path';

export async function read(filepath) {
    return fs.readFile(filepath, 'utf-8');
}

export async function write(filepath, data) {
    await fs.writeFile(filepath, data);
    console.log(filepath + ' written');
}

export async function append(filepath, data) {
    await fs.appendFile(filepath, data);
    console.log(filepath + ' appended');
}

export async function writeJSON(filepath, data) {
    const file = JSON.stringify(data, null, 4);
    await write(filepath, file);
}

export async function readJSON(filepath) {
    const file = await read(filepath);
    return JSON.parse(file);
}

export async function mkdir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

export async function deletedir(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                await deletedir(fullPath);
                await fs.rmdir(fullPath);
            } else {
                await fs.unlink(fullPath);
            }
        })
    );
}

export async function files(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    return files
        .filter((d) => d.isFile())
        .map((d) => d.name)
        .filter((item) => !/(^|\/)\.[^/.]/g.test(item))
        .sort();
}
export async function recursiveFiles(dir) {
    async function collectFiles(currentDir) {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        const filePromises = entries.map(async (entry) => {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                return await collectFiles(fullPath);
            } else if (entry.isFile() && !/(^|\/)\.[^/.]/g.test(entry.name)) {
                return fullPath;
            }
            return null;
        });

        const resolvedFiles = await Promise.all(filePromises);
        return resolvedFiles.flat();
    }

    const allFiles = await collectFiles(dir);

    return allFiles
        .filter(Boolean)
        .map((file) => path.relative(dir, file))
        .map((file) => path.join(dir, file))
        .map((file) => `./${file}`)
        .sort();
}

export function kebabToPascalCase(str) {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

export function unique(arr) {
    return [...new Set(arr)];
}

export function intersect(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return [...set1].filter((item) => set2.has(item));
}

export function isIntersecting(arr1, arr2) {
    return intersect(arr1, arr2).length > 0;
}

export function groupBy(array, key) {
    return array.reduce((result, currentValue) => {
        const groupKey = currentValue[key];

        if (!result[groupKey]) {
            result[groupKey] = [];
        }

        result[groupKey].push(currentValue);

        return result;
    }, {});
}

export function round(num, decimals = 2) {
    const factor = 10 ** decimals;
    return +(Math.round(num * factor) / factor);
}

const basePx = 16;

export function pxToRem(px) {
    return round(px / basePx, 3);
}

function extractTrailingNumber(str) {
    const match = str.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
}

export function sortByKey(key) {
    return (a, b) => {
        return a[key] - b[key];
    };
}

export function sortByTrailingNumber(key) {
    return (a, b) => {
        const numA = extractTrailingNumber(a[key]);
        const numB = extractTrailingNumber(b[key]);
        return numA - numB;
    };
}

export function sortByDash(a, b) {
    const tokenize = (s) => s.split(/[-_]/).map((t) => (isNaN(t) ? t : +t));
    const aa = tokenize(a),
        bb = tokenize(b);
    for (let i = 0; i < Math.max(aa.length, bb.length); i++) {
        if (aa[i] === undefined) return -1;
        if (bb[i] === undefined) return 1;
        if (aa[i] !== bb[i]) return aa[i] > bb[i] ? 1 : -1;
    }
    return 0;
}

export function capitalize(str) {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

export function formatTable(rows) {
    const cols = Object.keys(rows[0] || {});
    const header = `| ${cols.join(' | ')} |`;
    const separator = `| ${cols.map(() => ':---').join(' | ')} |`;
    const body = rows
        .map((r) => `| ${cols.map((c) => r[c]).join(' | ')} |`)
        .join('\n');
    return [header, separator, body].join('\n');
}

export function parseCss(css) {
    const cssVars = new Map();
    const cleaned = css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\r\n|\r/g, '\n');
    const re = /(--)\w[\w-]*\s*:\s*[^;]+;/g;
    let match;
    while ((match = re.exec(cleaned)) !== null) {
        const decl = match[0];
        const [namePart, valuePart] = decl.split(':');
        const name = namePart.trim();
        const value = valuePart.replace(/;\s*$/, '').trim();
        if (name && value) {
            cssVars.set(name, value);
        }
    }
    return cssVars;
}
