
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Regex to match imports with version suffixes like "pkg@1.2.3"
        // Handles both single and double quotes
        // Matches: from "pkg@1.2.3" or from 'pkg@1.2.3'
        const regex = /from (["'])([^"']+)@\d+\.\d+\.\d+\1/g;

        if (regex.test(content)) {
            const newContent = content.replace(regex, 'from $1$2$1');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed: ${filePath}`);
        }
    }
});
