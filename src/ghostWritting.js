'use strict';

function ghostWritting(text, container, conf) {
    return new Promise(resolve => {
        let i = 0;
        let iid = null;
        // [Lambda-start] writing
        const writing = function() {
            container.textContent += text[i++];
          
            // Обработка завершения работы
            if (i == text.length) {
                clearInterval(iid);
                resolve();
            }
        };
        // [Lambda-start] runWriting
        const runWriting = function() {
            iid = setInterval(writing, Math.floor(1000/conf.writtingVelocity));
        }
        
        if (conf.runDelay || conf.runDelay > 0) setTimeout(runWriting, conf.runDelay)
        else runWriting();
    });
}