/* 1.1:
 * [x] Изменен вид взаимодействия с таблицей. Добавлены визуальные эффекты
 *
 * 1.2:
 * [x] Добавление фоновой музыки
 * [x] Замедление распечатки, под темп музыки
 * [x] Улучшение взаимодествия звука
 *
 * 1.3:
 * [x] Подправлен стиль отображения. Добавлен адаптированный
 * [x] Вынесена информацию в отдельный файл
 */
'use strict';

document.addEventListener('DOMContentLoaded',  main);

 /*==========================================*
 *   
 * -------------  FUNCTIONS  --------------- *
 * ------------- DEFINITIONS --------------- *
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

async function main() {
    const containerSelector = 'table.info';
    const eventName = 'mousemove';
    const audio = document.querySelector('audio');
    const cardHeader = document.querySelector('.root .header');
    const nicknameCont = cardHeader.querySelector('.nickname');
        
    const response = await fetch('./data/MM.json');
    const objInfo = await response.json();
    
    nicknameCont.textContent = objInfo.nickname;
    // добавление реального имени или пустой строки (в противном случае) с оборачиванием в круглые скобки
    nicknameCont.setAttribute('data-realname', '(' + (objInfo.realname || '') + ')');
    
    const img = document.createElement('img');
    img.src = objInfo.src.avatar;
    img.alt = "avatar";
    img.style = "font-size: 16px; color: gray; text-align: center";
    cardHeader.querySelector('.left').append(img); 
        
    const aSource = document.createElement('source');
    aSource.src = objInfo.src.music.url;
    aSource.type = objInfo.src.music.mime_type; 
    audio.append(aSource);
   
    audio.addEventListener('play', e => {
        setTimeout(() => {
            fillInfo(objInfo.content, containerSelector, eventName);
        }, 2500);
    }, {once: true})
}