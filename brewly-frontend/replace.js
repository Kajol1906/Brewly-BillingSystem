const fs = require('fs');
const path = require('path');

const colorMap = {
    '#6C63FF': 'primary',
    '#93E5AB': 'accent',
    '#FFC8A2': 'secondary',
    '#FFD66C': 'warning',
    '#FF6B6B': 'danger',
    '#4CAF50': 'success',
    '#ececf0': 'muted',
    '#717182': 'muted-foreground',
    '#f3f3f5': 'input-background',
    '#cbced4': 'switch-background',
    '#ffffff': 'background', // carefully handled
};

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Replace arbitrary tailwind values like bg-[#6C63FF] -> bg-primary
            for (const [hex, semantic] of Object.entries(colorMap)) {
                // Case insensitive replacement for the hex
                const regex = new RegExp(`\\[${hex}\\]`, 'gi');
                content = content.replace(regex, semantic);
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

console.log("Starting color replacement...");
processDirectory(path.join(__dirname, 'src'));
console.log("Done.");
