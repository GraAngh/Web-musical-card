'use strict';
function runStarCanvas(selector, draw) {
    const cnv = document.body.querySelector(selector); 
    const ctx = cnv.getContext('2d');
    window.onresize = e => resizeCanvasCtx(ctx);
    
    resizeCanvasCtx(ctx);
    draw(ctx);
    
    /*==========================*/
    function resizeCanvasCtx(ctx) {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }
}

function spawnStars(ctx) {
    const GLIMMER_SIZE = 1.6;
    const GLIMMER_PERIOD = 100;
    const MAX_STATIC_SIZE = 7;
    const MAX_GLIMMERING_SIZE = 5;
    
    let iid = null;
    let staticStack = randomizeStars(70, MAX_STATIC_SIZE, false);
    staticStack.push.apply(staticStack, randomizeStars(800, 1, false) );
    let glimmerStack = randomizeStars(160, MAX_GLIMMERING_SIZE);
    
    const grd = ctx.createRadialGradient(
        ctx.canvas.width / 2,
        ctx.canvas.height / 2,
        1000,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2,
        0
    );
    grd.addColorStop(0, "rgb(45,45,55)");
    grd.addColorStop(1, "rgb(15,15,15)");
     
    runner(GLIMMER_SIZE, GLIMMER_PERIOD);
    
    /*=================================*
     *                                 *
     * IN Closure functions definition *
     *                                 *
     *=================================*/
    
    function randomizeStars(num, maxSize, doCeil = true) {
        const stack = [];
        for (let i = 0; i < num; i++) {
            const coord = {
                x: Math.random() * ctx.canvas.width,
                y: Math.random() * ctx.canvas.height
            };
            let sSize = Math.random() * maxSize + 1.7;
            if (doCeil) sSize = Math.ceil(sSize);
            
            stack.push([coord, sSize]);
        }

        return stack;
    };
    
    function runner (glimmrSize, glimmerPeriod) {
        iid = setInterval(() => {
            resetCanvas(ctx);
            staticStack.forEach((s) => star(ctx, s[0], s[1]));
            glimmerStack.forEach((s) =>
                star(ctx, s[0], (Math.random() * GLIMMER_SIZE) + s[1])
            );
        }, GLIMMER_PERIOD);
    };

    function wholeReset() {
        if (iid) {
            clearInterval(iid);
            iid = null;
        }
        staticStack = [];
        glimmerStack = [];
        resetCanvas(ctx);
    };
    
    function resetCanvas(ctx) {
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    
    function star(ctx, pos, lum) {
        let grd = ctx.createRadialGradient(
            pos.x,
            pos.y,
            lum / 3 /* внешнего круга, для 0 в addColorStop */,
            pos.x,
            pos.y,
            lum / 6 /* сердцевины, для 1 в addColorStop */
        );
        grd.addColorStop(0, "rgba(200,200,200,.02)");
        grd.addColorStop(1, "rgb(255,255,255)");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, lum, 0, Math.PI * 2);
        ctx.fill();
    }
}
