/**
 * Inspiration by
 *   http://stackoverflow.com/questions/19671543/js-canvas-implementation-of-julia-set
 *
 * @date 2016-03-05
 **/

var Complex = function( re, im ) {
    this.re = re;
    this.im = im;
    this.abs = function() { return Math.sqrt( Math.pow(this.re,2) + Math.pow(this.im,2) ); };
    this.toString = function() { return "{ re : " + this.re + ", im : " + this.im + " }"; };
}

function clear(ctx,width,height) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,width,height);
}

function drawPoint(ctx, pos){
    ctx.fillRect(pos.re, pos.im, 1, 1);  // there is no drawpoint in JS, so I simulate it
}

function cartesian2complex(x, y, width, R){   // transformation from canvas coordinates to XY plane
    var m = R / width;
    var x1 = m * (2 * x - width);
    var y2 = m * (width - 2 * y);
    return new Complex(x1,y2); //[x1, y2];
}

function f(z, c){  // calculate the value of the function with complex arguments.
    //return [z[0]*z[0] - z[1] * z[1] + c[0], 2 * z[0] * z[1] + c[1]];
    return new Complex( Math.pow(z.re,2) - Math.pow(z.im,2) + c.re,
			2 * z.re * z.im + c.im
		      );
}

function init(){
    var height = 640;
    var width  = 640;
    //c = new Complex(-1,0),  // all complex number are in the form of [x, y] which means x + i*y
    //var c = new Complex(-0.75,0.11);  // all complex number are in the form of [x, y] which means x + i*y
    var c = new Complex( document.getElementById("re").value*1, 
			 document.getElementById("im").value*1 
		       );
    var iterations = document.getElementById("iterations").value*1; // 10
    document.getElementById("display_re").innerHTML = c.re;
    document.getElementById("display_im").innerHTML = c.im;
    document.getElementById("display_iterations").innerHTML = iterations;
    console.debug( "c=" + c );
    var R = (1 + Math.sqrt(1+4*c.abs())) / 2; //(1 + Math.sqrt(1+4*abs(c))) / 2,
    var z;

    var ctx = document.getElementById('myCanvas').getContext("2d");
    clear(ctx,width,height);
    ctx.fillStyle = "#000000";

    var flag;
    for( var x = 0; x < width; x++ ) {
        for( var y = 0; y < height; y++ ){  // for every point in the canvas plane
            flag = true;
            //z = conversion(x, y, width, R);  // convert it to XY plane
	    z = cartesian2complex(x,y,width,R);  // convert it to XY plane
            for( var i = 0; i < iterations; i++ ) { // I know I can change it to while and remove this flag.
                z = f(z, c);
                //if (abs(z) > R) {  // if during every one of the iterations we have value bigger then R, do not draw this point.
		if (z.abs() > R) {  // if during every one of the iterations we have value bigger then R, do not draw this point.
                    flag = false;
                    break;
                }
            }
            // if the
            if( flag ) 
		drawPoint( ctx, new Complex(x,y) );
        }
    }
}

function changeRe(amount) {
    var elem = document.getElementById("re");
    elem.value = Math.min( Math.max( elem.min*1, elem.value*1+amount ), elem.max*1 );
    init();
}

function changeIm(amount) {
    var elem = document.getElementById("im");
    elem.value = Math.min( Math.max( elem.min*1, elem.value*1+amount ), elem.max*1 );
    init();
}

function changeIter(amount) {
    var elem = document.getElementById("iterations");
    elem.value = Math.min( Math.max( elem.min*1, elem.value*1+amount ), elem.max*1 );
    init();
}
