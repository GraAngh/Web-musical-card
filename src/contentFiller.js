'use strict';


// Добавление новой табличной записи в карточку при помощи шаблонной строки
function getRowFromTemplate(tElement) {
    const clone = tElement.cloneNode(true);
    clone.classList.remove('hidden');
    clone.removeAttribute('data-info-row-template');
    return clone;
}

// Вынес замыкание в отдельную функцию и все пользовательские литералы
function fillInfo(
    infoContent, 
    targetSelector, 
    eventName
) {
    const infoContainer = document.querySelector(targetSelector);
    if (!infoContainer) throw "Не удалось получить информационный контейнер";
    const rowTemplate = infoContainer.querySelector('[data-info-row-template]');
    if (!rowTemplate) throw "Не удалось получить шаблонную строку 'data-info-row-template'";
    
    const nRow = getRowFromTemplate(rowTemplate);
    nRow.classList.add('flickering');
    
    let currentHandlingIndex = 0;
    initNewRow();
    
    // 
    function forInfoFillingListener(e) {
        this.classList.remove('flickering');
        this.classList.add('write_execution');
    
        ghostWritting(
            infoContent[currentHandlingIndex][0], 
            this.cells[0], 
            {writtingVelocity: 6}
        ).then(() => ghostWritting(
            infoContent[currentHandlingIndex][1], 
            this.cells[1], 
            {runDelay: 500, writtingVelocity: 8})
        ).then(() => { 
            this.classList.remove('write_execution');
            // здесь продолжается цикл добавления записей в таблицу
            if (++currentHandlingIndex < infoContent.length) {
                setTimeout(initNewRow, 1500);
            }
        }); 
    }; 
    
    // функция в замыкании, которая копирует приглашающую строку и активирует ее
    function initNewRow() {
        const cnRow = nRow.cloneNode(true);
        cnRow.addEventListener(eventName, forInfoFillingListener, {once: true});
        infoContainer.tBodies[0].append(cnRow);
    };
}
