function getTerminalHTML(){
    return `
        <div class="terminal-container">
            <div class="terminal-output" id="term-output">
                <div class="term-line info">WebOS Terminal v1.0.0</div>
                <div class="term-line info">Type <span class="cmd-highlight">'help'</span> for a list of available commands.</div>
                <div class="term-line">&nbsp;</div>
            </div>
            <div class="terminal-input-row">
                <span class="prompt">user@webos:~$</span>
                <input type="text" id="term-input" class="terminal-input" autofocus autocomplete="off" spellcheck="false" />
            </div>
        </div>
      `;
}

function initTerminalApp(winElement){
    const input = winElement.querySelector('#term-input');
    const output = winElement.querySelector('#term-output');

    if(!input) return;
    winElement.querySelector('.terminal-container').addEventListener('click',()=>{
        input.focus();
    });

    input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            const command = input.value.trim();
            input.value = '';

            if(command !== ''){
                processCommand(command,output);
            }
        }
    });
}

function processCommand(cmdLine, outputEl){
    const cmdRecord = document.createElement('div');
    cmdRecord.className = 'term-line';
    cmdRecord.innerHTML = `<span class="prompt">user@webos:~$</span> ${escapeHTML(cmdLine)}`;
    outputEl.appendChild(cmdRecord);

    const parts = cmdLine.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let responseHTML = '';
    
    switch (mainCmd){
        case 'help':
            responseHTML = `
                <div class="term-line"><strong>Available Commands:</strong></div>
                <div class="term-line">&nbsp;&nbsp;<span class="cmd-highlight">help</span>       - Display the list of commands</div>
                <div class="term-line">&nbsp;&nbsp;<span class="cmd-highlight">date</span>       - Display current system date and time</div>
                <div class="term-line">&nbsp;&nbsp;<span class="cmd-highlight">theme</span>      - Switch OS theme (Usage: <span class="cmd-highlight">theme light</span> or <span class="cmd-highlight">theme dark</span>)</div>
                <div class="term-line">&nbsp;&nbsp;<span class="cmd-highlight">echo</span>       - Print text (Usage: <span class="cmd-highlight">echo hello world</span>)</div>
                <div class="term-line">&nbsp;&nbsp;<span class="cmd-highlight">clear</span>      - Clear terminal screen history</div>
                <div class="term-line">&nbsp;&nbsp;<span class="cmd-highlight">sudo</span>       - System administrator privilege test</div>
            `;
            break;
        case 'date':
            responseHTML = `<div class="term-line">${new Date().toLocaleString()}</div>`;
            break;

        case 'echo':
            responseHTML = `<div class="term-line">${escapeHTML(args.join(' '))}</div>`;
            break;
        
        case 'theme':
            const mode = args[0]? args[0].toLowerCase(): '';
            if(mode === 'light' || mode === 'dark'){
                if(mode === 'light'){
                    document.documentElement.setAttribute('data-theme','light');
                }else{
                    document.documentElement.removeAttribute('data-theme');
                }
                responseHTML = `<div class="term-line success">OS theme updated to <strong>${mode}</strong> mode.</div>`;
            } else{
                responseHTML = `<div class="term-line error">Invalid theme option. Use 'theme light' or 'theme dark'.</div>`;
            }
            break;

        case 'clear':
            outputEl.innerHTML = '';
            return;
        
        case 'sudo':
            responseHTML = `<div class="term-line error">Permission Denied: You are running inside a browser environment! 😉</div>`;
            break;
        
        default:
            responseHTML = `<div class="term-line error">Command not found: '${escapeHTML(mainCmd)}'. Type 'help' for available commands.</div>`;
            break;    
    }

    const responseEl = document.createElement('div');
    responseEl.innerHTML = responseHTML;
    outputEl.appendChild(responseEl);

    outputEl.scrollTop = outputEl.scrollHeight;

}


function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}