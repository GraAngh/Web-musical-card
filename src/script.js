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
 * 
 * 1.4:
 * [x] Улучшено стилевое оформление
 * [x] Добавлен холст с генерируемыми мерцающими звездами
 */
'use strict';

document.addEventListener('DOMContentLoaded',  main);

 /*==========================================*
 *   
 * -------------  FUNCTIONS  --------------- *
 * ------------- DEFINITIONS --------------- *
 *
 *===========================================*/
async function main() {
    try {
        await loadScript('./src/ghostWritting.js');
        await loadScript('./src/contentFiller.js');
        await loadScript('./src/starsField.js');        
    } catch (err) { 
        console.log(err);
        return;
    }
    
    const containerSelector = 'table.info';
    const eventName = 'mousemove';
    const audio = document.querySelector('audio');
    const cardHeader = document.querySelector('.root .header');
    const nicknameCont = cardHeader.querySelector('.nickname');
        
    let response = await fetch('./data/MM.json');
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
    
    runStarCanvas('canvas.stars', spawnStars);
    audio.addEventListener('play', e => {
        setTimeout(() => {
            fillInfo(objInfo.content, containerSelector, eventName);
        }, 2500);
    }, {once: true});
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
    
        script.src = src;
        script.onload = () => {
            console.log('Удачаная загрузка '+ script.src);
            resolve(script);
        };
        script.onerror = () => {
            reject(new Error('Ошибка загрузки ' + script.src));
        };
        
        document.body.append(script);
    });
}