/**
기울기 m = (y2 - y1) / (x2 - x1)
기울기 공식
    -기울기가 음수이면, 그래프는 왼쪽에서 오른쪽으로 갈수록 내려간다. (\ 형태)
    -기울기가 양수이면, 그래프는 왼쪽에서 오른쪽으로 갈수록 올라간다. (/ 형태)
    -기울기가 0이면, 그래프는 수평이다. (- 형태)
    -기울기 공식 m = (y2 - y1) / (x2 - x1) 에서 제수(x2 - x1)가 0이면,
     기울기는 정의할 수 없고 그래프는 수직선이다.

     점 연결 시 기울기가 같으면 지나간 것으로 간주
     
step5
    패턴 스냅샷 처리 및 파일 다운로드 처리
    
step4
    레이어 요소 추가하기 
    layer별 처리영역을 구분하면 좀 더 수월해 질까?

step3
    마지막 닷과 마우스 위치를 이어주는 라인 그리기

step2
    마우스 클릭 & 드래그로 변경

기본 패턴 점 만들기
    클릭에 따른 컬러 변경 및 라인 연결 & 초기화

*/
(function(){
    var isPress;
    var POINT_COLOR ="rgba(255, 255, 255, 1)";
    var FOCUS_COLOR ="rgba(255, 100, 0, 1)";
    var LINE_THICKNESS=3;
    var POINT_RADIUS =5;  
    
     /**
     ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
        객체 확장 함수
     ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
     */
    function extend(base, sub) {
          // Avoid instantiating the base class just to setup inheritance
          // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
          // for a polyfill
          // Also, do a recursive merge of two prototypes, so we don't overwrite 
          // the existing prototype, but still maintain the inheritance chain
          // Thanks to @ccnokes
          var origProto = sub.prototype;
          sub.prototype = Object.create(base.prototype);
          
          for (var key in origProto)  {
             sub.prototype[key] = origProto[key];
          }
          // Remember the constructor property was set wrong, let's fix it
          sub.prototype.constructor = sub;
          //sub.prototype.super       = base;
          // In ECMAScript5+ (all modern browsers), you can make the constructor property
          // non-enumerable if you define it like this instead
          Object.defineProperty(sub.prototype, 'constructor', { 
            enumerable: false, 
            value: sub 
          });
    }

    function extendOptions( options, base){
        var opt = {};
        for( var prop in base ){
            opt[prop] = options[prop] || base[prop];
        }
        return opt;
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
    
    
    function convertPoint( element, point ){
        var rect = element.getBoundingClientRect();
        return {x:point.x-rect.left, y:point.y-rect.top}
    }
    
    function mobilecheck() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+|android|ipad|playbook|silk|mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check; 
    }
            
    
    var LockPoint =function( px, py ){
         this.x = px || 0;
         this.y = py || 0;
         this.radius    = POINT_RADIUS;
         this.hitRadius = POINT_RADIUS*5;
    };
    
    LockPoint.prototype = {
        
        x:null,
        y:null,
        radius:null,
        hitRadius:null,
        hit:false,
        getColor:function(){
            return (this.hit) ? FOCUS_COLOR : POINT_COLOR;
        }
    
    }
    
    var Layer = function( layerElement ){
        this.canvas     = layerElement;
        this.ctx        = this.canvas.getContext('2d');
        this.items      = [];
    }
    
    Layer.prototype ={
        canvas:null,
        ctx:null,
        items:null,
        
        render:function(){
            // override
        },
        reset:function(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        
        destory:function(){
            
        },
        
        setItems: function( objItems ){
            this.items = objItems;
        },
        
        getItems: function(){
            return this.items;
        },
        
        appendItem:function(objItem){
            this.items.push(objItem);
        },
        
        removeItem:function( objItem ){
            var o;
            for( var i=0; i<this.items.length; i++ ){
                o = this.items[i];
                if( o == objItem){
                    this.items.splice(i, 1);
                    return;
                }
            }
        }
    
    };
    
    var FocusLayer  = function( layerElement ){
        Layer.call( this, layerElement );
    };
   
    FocusLayer.prototype = {
        
        appendItem: function( objItem ){
            objItem.hit = true;
            Layer.prototype.appendItem.call( this, objItem );
        },
        
        removeItem: function( objItem ){
            objItem.hit =false;
            Layer.prototype.removeItem.call( this, objItem );
        },
        
        render:function(){
            
            Layer.prototype.reset.call(this);
            
            var point;
            var prevPoint;
            for( var i=0; i < this.items.length; i++ ) {
                
                point = this.items[i];
                
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = point.getColor();
                this.ctx.arc( point.x, point.y, point.radius, 0, Math.PI*2);
                this.ctx.fill();
                this.ctx.closePath();
                
                this.ctx.beginPath();
                this.ctx.fillStyle = 'rgba(255, 180, 0, 0.2)';
                this.ctx.arc( point.x, point.y, point.hitRadius, 0, Math.PI*2);
                this.ctx.fill();
                this.ctx.closePath();
               
               if( prevPoint ){
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = point.getColor();
                    this.ctx.lineWidth   = LINE_THICKNESS;
                    this.ctx.moveTo( prevPoint.x, prevPoint.y );
                    this.ctx.lineTo( point.x, point.y );
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
                
                this.ctx.closePath();
                this.ctx.restore();
                
                prevPoint = point;
                
            }
            
        },
        
        destory:function(){
            while(this.items.length){
                this.removeItem( this.items.shift());
            }
            this.reset();
        }
        
    };
    
    var PointLayer  =function( layerElement ){
        Layer.call( this, layerElement );
    };
    
    PointLayer.prototype = {
        render:function(){
            
            var point;
       
            for( var i=0; i < this.items.length; i++ ) {
                point = this.items[i];
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = point.getColor();
                this.ctx.arc( point.x, point.y, point.radius, 0, Math.PI*2);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.restore();
            }
            
            
             
            
        },
        
        getTouchPoints:function( mx, my ){
            
            var i=0;
            var max = this.items.length;
            var p;
            for( i=0; i<max; i++ ) {
                p = this.items[i];
                if( p.hit ) continue;
                if( mx >= (p.x-p.hitRadius) && mx <= (p.x+p.hitRadius) &&
                    my >= (p.y-p.hitRadius) && my <= (p.y+p.hitRadius) ){
                    return p;
                }
            }
            return null;
        }
        
    };
    
    var LineLayer = function( layerElement ){
        Layer.call( this, layerElement );
    };
    
    LineLayer.prototype={
        
        destory: function(){
             while(this.items.length){
                this.removeItem( this.items.shift());
            }
            this.reset();
        },
        
        render:function() {
            
            Layer.prototype.reset.call(this);
            if( this.items.length > 1 ){
                
                var toPoint     =this.items[0];
                var mousePoint   =this.items[1];
                this.ctx.save();
                
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.lineWidth   = LINE_THICKNESS;
                this.ctx.moveTo( toPoint.x, toPoint.y );
                this.ctx.lineTo( mousePoint.x, mousePoint.y );
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();
                
            }
            
        }
        
    };
    
    
    var SnapShotLayer = function( layerElement ){
         Layer.call( this, layerElement );
    };
    
    SnapShotLayer.prototype ={
        
        reset: function(){
            this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
            this.ctx.fill();
        },
        
        render:function(){
        
            this.ctx.save();
            var layer;
            for( var i=0; i<this.items.length; i++){
                layer   = this.items[i];
                this.ctx.drawImage( layer.canvas, 0, 0, this.canvas.width, this.canvas.height );
            }
            var snapData        =this.canvas.toDataURL("image/jpeg", 0.7);
            this.ctx.restore();
            return snapData;
        
        }
        
    };
    
    
    /* 확장 */
    extend( Layer, FocusLayer );
    extend( Layer, PointLayer );
    extend( Layer, LineLayer );
    extend( Layer, SnapShotLayer );
    
    
    var PatternLock =function( options ){
        var info =extendOptions( options || {} , this.options );
        this.initialize( info );
        this.initializeEvent();
        this.renderPatternPoint();
    };
    
    PatternLock.prototype ={
        container:null,
        focusLayer:null,
        lineLayer:null,
        pointLayer:null,
        snapshotLayer:null,
        snapshotData:null,
        onCreateSnapshot: null,
        
        options:{
            layers:["snapshot-layer", "point-layer", "focus-layer", "line-layer"],
            container:"lock-container",
            points:[
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
            ],
            onCreateSnapshot:null
        },
        
        initialize:function( options ){
            
            
            
            this.container   = document.getElementById( options.container );
            var bounds      = container.getBoundingClientRect();
            var layerNames      = options.layers;
            var layers      =[];
            for( var i=0; i< layerNames.length; i++ ){
                var layerName   = layerNames[i];
                var layer       = document.getElementById(layerName);
                if( !layer ) {
                    layer = document.createElement("canvas");
                    layer.width = bounds.width;
                    layer.height =bounds.height;
                    layer.setAttribute( "id", layerName );
                    this.container.appendChild( layer );
                }                
                 layers.push( layer );
            }
           
           
            this.onCreateSnapshot= options.onCreateSnapshot;
            
            
            this.snapshotLayer   = new SnapShotLayer( layers[0] );
            this.pointLayer      = new PointLayer( layers[1] );
            this.focusLayer      = new FocusLayer( layers[2] );
            this.lineLayer       = new LineLayer( layers[3] );
            
            // snapshot-layer-init
            this.snapshotLayer.appendItem( this.pointLayer );
            this.snapshotLayer.appendItem( this.focusLayer );
           
            // point-layer-init
            var p;
            for( i =0; i<options.points.length; i++){
                p = options.points[i]
                this.pointLayer.appendItem( new LockPoint( p.x, p.y ) );
            }
            
        },
        
        renderPatternPoint:function(){
            this.pointLayer.render();
        },
        
        render : function( ){
            this.focusLayer.render();
            this.lineLayer.render();
        },
        
        onMouseDown_Screen:function( e ){
            e.preventDefault();
            console.log("e", e );
            var mobj = e.touches ? e.touches[0] : e;
            var cp = convertPoint( this.container, {x:mobj.clientX, y:mobj.clientY});
            isPress = true;
            this.snapshotLayer.reset();
        },
        
        onMouseMove_Screen:function( e ){
            
            if( isPress ){
               var mobj = e.touches ? e.touches[0] : e;
               var cp = convertPoint( this.container, {x:mobj.clientX, y:mobj.clientY});
               //var cp = convertPoint( this.container, {x:e.clientX, y:e.clientY});
               var touchCount = this.focusLayer.items.length; 
               var touchPoint = this.pointLayer.getTouchPoints( cp.x, cp.y );
               if( touchPoint ){
                    this.focusLayer.appendItem( touchPoint );
               } 
               
               // focus라인 
               if( this.focusLayer.items.length > 0 ){
                    touchCount =this.focusLayer.items.length;
                    this.lineLayer.setItems([this.focusLayer.items[touchCount-1], cp]);
               }
               
               this.render();
            }
            
        },
        
        onMouseUp_Screen: function( e ){
            isPress = false;
            if( this.focusLayer.items.length > 1  ){
            this.snapshotData = this.snapshotLayer.render();
                if( this.onCreateSnapshot != null ){
                    this.onCreateSnapshot.apply( null );
                }
            }
            
            this.focusLayer.destory();
            this.lineLayer.destory();
            
        },
        
        initializeEvent : function( ){
            var isMobile = mobilecheck();
            var downHandler = isMobile ? "touchstart" : "mousedown";
            var moveHandler = isMobile ? "touchmove" : "mousemove";
            var upHandler = isMobile ? "touchend" : "mouseup";
            addEvent( downHandler,  this.lineLayer.canvas , this.onMouseDown_Screen.bind(this) );
            addEvent( moveHandler, document, this.onMouseMove_Screen.bind(this) );
            addEvent( upHandler, document, this.onMouseUp_Screen.bind(this) );
    
        }
        
    };
    
    window.PatternLock = PatternLock;
    
})();


