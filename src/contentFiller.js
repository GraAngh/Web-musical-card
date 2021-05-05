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
    const FIRST_W_VELOCITY = 6;
    const SECOND_W_VELOCITY = 8;
    const SECOND_W_DELAY = 500;
    const NEW_ROW_DELAY = 1500;
    
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
            {writtingVelocity: FIRST_W_VELOCITY}
        ).then(() => ghostWritting(
            infoContent[currentHandlingIndex][1], 
            this.cells[1], 
            {runDelay: SECOND_W_DELAY, writtingVelocity: SECOND_W_VELOCITY})
        ).then(() => { 
            this.classList.remove('write_execution');
            // здесь продолжается цикл добавления записей в таблицу
            if (++currentHandlingIndex < infoContent.length) {
                setTimeout(initNewRow, NEW_ROW_DELAY);
            } else {
                const ancestor = getAncestorByClass(infoContainer, 'root');
                if (ancestor) ancestor.classList.add('opacity_4');
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

function getAncestorByClass(forNode, ancestorClass) 
{
    let ancestor = forNode.parentElement;
    while (ancestor) {
        if ( ancestor.classList.contains(ancestorClass) ) return ancestor;
        ancestor = ancestor.parentElement;
    }
    
    return null;
}