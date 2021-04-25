/* 1.1:
 * [x] Изменен вид взаимодействия с таблицей. Добавлены визуальные эффекты
 *
 * 1.2:
 * [x] Добавление фоновой музыки
 * [x] Замедление распечатки, под темп музыки
 * [] Улучшение взаимодествия звука
 */
'use strict';

document.addEventListener('DOMContentLoaded',  main);

 /*===========================================*
 *   
 *--------------  FUNCTIONS  ----------------*
 *-------------- DEFINITIONS ----------------*
 *
 *===========================================*/
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

// Добавление новой табличной записи в карточку при помощи шаблонной строки
function getRowFromTemplate(tElement)
    {
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

function main() {
    const audio = document.querySelector('audio');
    // const cardHeader = document.querySelector('.root .header');
    
    const content =  [
        ["Вид", "Человек"],
        ["Описание", "Теплая, как весеннее солнышко"],
        ["При встрече", "Закатать в одеялко и положить в укромное место. В случае провала притвориться мертвым — понюхает и уйдет; можно повторить попытку"],
        ["Атака скрипкой", "0 (не будет же она ею бить, а вот кейсом может)"],
        ["Любимые фразы", '"Мальчик мой, водочки нам унеси. Мы непьющие", "Где бабки, дирижёрик?" и "Скрипка, словно древесина, кинешь в огонь — сгорит"'],
        ["Пол", "Предположительно, любит теплый"],
        ["Маккартни", "Знаю, этот был в битлах"]
    ];
    const containerSelector = 'table.info';
    const eventName = 'mousemove';
    
    
    audio.addEventListener('play', e => {
        setTimeout(() => {
            fillInfo(content, containerSelector, eventName);
        }, 2500);
    }, {once: true})
}