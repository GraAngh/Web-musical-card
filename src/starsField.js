'use strict';
function runStarCanvas(selector, cb) {
    const cnv = document.body.querySelector(selector); 
    
    resizeCanvas(cnv);
    window.addEventListener('resize', e => resizeCanvas(cnv));
    
    const ctx = cnv.getContext('2d');
    cb(ctx);
    
    
    /*==========================*/
    function resizeCanvas(cnv) {
        console.log('resizing');
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
}

function spawnStars(ctx) {
    const GLIMMER_SIZE = 2;
    const GLIMMER_PERIOD = 310;
    const MAX_STATIC_SIZE = 8;
    const MAX_GLIMMERING_SIZE = 6;

    let iid = null;
    let staticStack = randomizeStars(70, MAX_STATIC_SIZE);
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
    
    
    function randomizeStars(num, maxSize) {
        const stack = [];
        for (let i = 0; i < num; i++) {
            stack.push([
                {
                    x: Math.random() * ctx.canvas.width,
                    y: Math.random() * ctx.canvas.height
                },
                Math.ceil(Math.random() * maxSize + 1)
            ]);
        }

        return stack;
    };
    
    function runner (glimmrSize, glimmerPeriod) {
        iid = setInterval(() => {
            resetCanvas(ctx);
            staticStack.forEach((s) => star(ctx, s[0], s[1]));
            glimmerStack.forEach((s) =>
                    star(ctx, s[0], Math.ceil(Math.random() * GLIMMER_SIZE + s[1]))
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
