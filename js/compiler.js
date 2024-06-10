function compileNoTypicalScript(commands) {
    const compiledCommands = commands.map(command => {
        const regex = /print\("([^"]+)"\s*;\s*"([^"]+)"\s*=>\s*"([^"]+)"\)/;
        const match = command.match(regex);
        
        if (match) {
            const [_, filename, selector, text] = match;
            if (filename === "index.html") {
                return `document.querySelector("${selector}").textContent = "${text}";`;
            } else {
                throw new Error("Unsupported file: " + filename);
            }
        } else {
            throw new Error("Invalid command format: " + command);
        }
    });

    return compiledCommands.join('\n');
}

fetch('script.nts')
    .then(response => response.text())
    .then(data => {
        const commands = data.split('\n').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
        
        try {
            const compiledCode = compileNoTypicalScript(commands);
            console.log(compiledCode);
            eval(compiledCode);
        } catch (e) {
            console.error(e.message);
        }
    })
    .catch(err => console.error(err));
