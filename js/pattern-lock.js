/**
step5
    ���� ������ ó�� �� ���� �ٿ�ε� ó��
    
step4
    ���̾� ��� �߰��ϱ� 
    layer�� ó�������� �����ϸ� �� �� ������ ����?

step3
    ������ ��� ���콺 ��ġ�� �̾��ִ� ���� �׸���

step2
    ���콺 Ŭ�� & �巡�׷� ����

�⺻ ���� �� �����
    Ŭ���� ���� �÷� ���� �� ���� ���� & �ʱ�ȭ

*/
var pointLayer;
var focusLayer;
var lineLayer;

var lineCtx;
var pointCtx;
var focusCtx;

var isPress;

var POINT_COLOR ="rgba(255, 255, 255, 1)";
var FOCUS_COLOR ="rgba(255, 100, 0, 1)";
var LINE_THICKNESS=3;

var dotPoints=[
 {x:50, y:100},
 {x:150, y:100},
 {x:250, y:100},
 {x:50, y:200},
 {x:150, y:200},
 {x:250, y:200},
 {x:50, y:300},
 {x:150, y:300},
 {x:250, y:300},
 {x:50, y:400},
 {x:150, y:400},
 {x:250, y:400}
];   


function drawLockPoint(){
    var dot;
    for( var i=0; i<lockPoints.length; i++){
        dot =lockPoints[i];
        pointCtx.save();
        pointCtx.beginPath();
        pointCtx.fillStyle=dot.color;
        pointCtx.arc( dot.x, dot.y, dot.radius, 0, Math.PI*2);
        pointCtx.fill();
        pointCtx.closePath();
        pointCtx.restore();
        
    }
}


var DOT_RADIUS =5;
function createDot( px, py ){
    var dot={
        x:px, 
        y:py,
        radius:DOT_RADIUS,
        hitRadius:DOT_RADIUS*4,
        hit:false,
        color:POINT_COLOR
    }
    return dot;
}




function onMouseDown_Screen( e ){
    isPress =true;
    clearHistory();
}

function initScreen(){
    pointCtx.clearRect(0, 0, pointLayer.width, pointLayer.height );
    focusCtx.clearRect(0, 0, focusLayer.width, focusLayer.height );
    lineCtx.clearRect(0, 0, lineLayer.width, lineLayer.height );
}

function getDotHitTest( mx, my ){
    var hitDot =false;
    for( var i=0; i<lockPoints.length; i++ ){
        var p = lockPoints[i];
        if(p.hit)continue;
        if( mx >= (p.x-p.hitRadius) && mx <= (p.x+p.hitRadius) &&
            my >= (p.y-p.hitRadius) && my <= (p.y+p.hitRadius) ){
                touchPoints.push(p);
                p.hit   =true;
                p.color =FOCUS_COLOR;
                hitDot  =true;
            }
    }
    return hitDot;
}


function drawTouchPointDeco(){
    var touchPoint;
    for( var i=0; i<touchPoints.length; i++ ){
        touchPoint = touchPoints[i];                
        focusCtx.save();
        focusCtx.beginPath();
        focusCtx.fillStyle='rgba(255, 180, 0, 0.2)';
        focusCtx.arc( touchPoint.x, touchPoint.y, touchPoint.hitRadius, 0, Math.PI*2);
        focusCtx.fill();
        focusCtx.closePath();
        focusCtx.restore();
    }
}


function initLockPointState(){
     for( var i=0; i<lockPoints.length; i++ ){
        var p = lockPoints[i];                
        p.hit=false;
        p.color =POINT_COLOR;
    }
    touchPoints=[];
}

function drawPatternLine(){

    var hitDot;
    var prevDot;
    for( var i=0; i<touchPoints.length; i++ ) {

        hitDot  = touchPoints[i];
        focusCtx.save();
        if( prevDot ){
            focusCtx.beginPath();
            focusCtx.strokeStyle = FOCUS_COLOR;
            focusCtx.lineWidth   = LINE_THICKNESS;
            focusCtx.moveTo( prevDot.x, prevDot.y );
            focusCtx.lineTo( hitDot.x, hitDot.y );
            focusCtx.stroke();
            focusCtx.closePath();
        }
        focusCtx.restore();
        prevDot = hitDot;
        
    }

}

function drawCurrentLine(mx, my){
    var focus = touchPoints[touchPoints.length-1];
    lineCtx.save();
    lineCtx.beginPath();
    lineCtx.strokeStyle = "rgba( 255, 255, 255, 0.5)";
    lineCtx.lineWidth   = LINE_THICKNESS;
    lineCtx.moveTo( focus.x, focus.y );
    lineCtx.lineTo( mx, my );
    lineCtx.stroke();
    lineCtx.closePath();
    lineCtx.restore();
}


var touchPoints=[];
var lockPoints=[];
for( var i=0; i<dotPoints.length; i++ ){
    var p = dotPoints[i];
    lockPoints.push(createDot( p.x, p.y ));
}



function onMouseMove_Screen( e ){
    if( isPress ){
       var hit = getDotHitTest( e.clientX, e.clientY );
        initScreen();
        drawLockPoint()
        drawPatternLine();
    }

    if( touchPoints.length> 0 ){
        drawCurrentLine( e.clientX, e.clientY );
        drawTouchPointDeco();
    }

}

var snapshotData;
function onMouseUp_Screen( e ){
    isPress = false;
    snapshotData = createSnapshotData();
    initLockPointState();
    initScreen();
    drawLockPoint();
}


function createSnapshotData(){
    var snapshotCanvas  =document.getElementById("snapshot-layer");
    var snapCtx         =snapshotCanvas.getContext("2d");
    snapCtx.save();
    snapCtx.drawImage( pointLayer, 0, 0, 320, 480 );
    snapCtx.drawImage( focusLayer, 0, 0, 320, 480 );
    //snapCtx.drawImage( lineLayer, 0, 0, 320, 480 );
    var snapData        =snapshotCanvas.toDataURL("image/jpeg", 0.7);
    snapCtx.restore();

    return snapData;
}

function clearHistory(){
    var snapshotCanvas  =document.getElementById("snapshot-layer");
    var snapCtx         =snapshotCanvas.getContext("2d");
    snapCtx.fillStyle='rgba(0, 0, 0, 1)';
    snapCtx.fillRect( 0, 0,snapshotCanvas.width,  snapshotCanvas.height );
    snapCtx.fill();
}


function downloadFile(){
    if(snapshotData){
        console.log("snapshotData", snapshotData);
        this.href=snapshotData;
    }
}

      
function addEvent(evnt, elem, func) {
    if (elem.addEventListener)  // W3C DOM
      elem.addEventListener(evnt,func,false);
    else if (elem.attachEvent) { // IE DOM
      elem.attachEvent("on"+evnt, func);
    }
    else { // No much to do
      elem[evnt] = func;
    }
}



function initApp(){

    pointLayer  =document.getElementById("point-layer");
    focusLayer  =document.getElementById("focus-layer");
    lineLayer   =document.getElementById("line-layer");

    lineCtx     =lineLayer.getContext("2d");
    pointCtx    =pointLayer.getContext("2d");
    focusCtx    =focusLayer.getContext("2d");

    console.log("lineCtx", lineCtx );
    console.log("pointCtx", pointCtx );
    console.log("focusCtx", focusCtx );

    drawLockPoint();

    addEvent( "mousedown", lineLayer, onMouseDown_Screen );
    addEvent( "mousemove", document, onMouseMove_Screen );
    addEvent( "mouseup", document, onMouseUp_Screen );
    addEvent( "click", document.getElementById("download"), downloadFile );

}
