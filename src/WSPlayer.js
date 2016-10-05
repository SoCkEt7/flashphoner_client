//LICENSE! This Code can be used and executed as a part of Flashphoner Web Call Server platform and having an appropriate Web Call Server license. You shall not use this code separately from Web Call Server platform. Contacts: http://flashphoner.com, support@flashphoner.com.
var requestAnimFrame=(function(){return function(callback){window.setTimeout(callback,33.333333333333336);};})();function WSPlayer(canvas,A7){this.canvas=canvas;this.f=N.Aa;this.AZ=false;this.A7=A7;}WSPlayer.prototype.init=function(K,audioContext){this.K=K;this.l();try{this.T=new AudioPlayer(audioContext);}catch(e){wsLogger.error("Failed to init audio player "+e);return;}try{this.M=new VideoRenderer(this.canvas,false,"yuv");this.M.init();}catch(e){wsLogger.error("Failed to init video renderer "+e);return;}try{if(this.j){this.j.terminate();}this.j=new Worker(K.receiverPath);wsLogger.debug("create new worker "+K.receiverPath);this.j.addEventListener("message",(function(e){switch(e.data.message){case"connection":if(e.data.status=="failed"||e.data.status=="closed"){this.stop();this.AZ=false;}this.play(K.streamId);break;case"AVData":var C;if(e.data.audioLength>0){this.BU=true;for(C=0;C<e.data.audio.length;C++){this.T.B9(e.data.audio[C]);}}if(e.data.videoLength>0){this.BN=true;for(C=0;C<e.data.video.length;C++){this.AC.push(e.data.video[C]);}this.B2=e.data.videoLength/e.data.video.length;}var B0=this.T.BA();if(this.AC.length>0){if(this.f==N.AX){if(this.M.AT){this.R.length=0;this.q.length=0;while(this.AC.length>0){if(this.AC[0].ts<B0+50){this.AA();}else{break;}}}else if(this.q.length<2){this.AA();}}else{while(this.AA()){}}}this.j.postMessage({message:"ack",data:{seq:e.data.seq,time:Date.now(),audioReceivedLength:e.data.audioLength,videoReceivedLength:e.data.videoLength,audioCurrentTime:B0,audioBufferTimeLength:this.T.getBufferTimeLength(),videoBufferTimeLength:(this.AC.length+this.q.length+this.R.length)*this.B2}});break;default:wsLogger.error("Unknown request");}}).bind(this),false);var conf={};conf.audioChunkLength=this.T.internalBufferSize;conf.audioContextSampleRate=this.T.O.sampleRate;conf.videoWidth=K.videoWidth;conf.videoHeight=K.videoHeight;conf.urlWsServer=K.urlWsServer;conf.token=K.token;conf.audioBufferWaitFor=K.audioBufferWaitFor;conf.videoBufferWaitFor=K.videoBufferWaitFor;conf.dropDelayMultiplier=K.dropDelayMultiplier;this.j.postMessage({message:"init",data:conf});}catch(e){wsLogger.error("Failed to init stream receiver "+e);return;}try{if(this.AL){this.AL.terminate();}this.AL=new Worker(K.decoderPath);wsLogger.debug("create new worker "+K.decoderPath);this.AL.onmessage=(function(e){if(this.q.length==0){wsLogger.warn("No timestamp available for decoded picture, discarding");return;}e.data.sync=this.q.shift();this.R.push(e.data);if(this.f!=N.AX){if(this.R.length<5){if(this.R.length>1&&this.T.Z.length>0){if(this.T.Z[0].sync>this.R[0].sync){this.R[0]=null;this.R.shift();}}this.AA();}else{this.f=N.AX;this.T.start();requestAnimFrame(this.A9.bind(this));}}else{if(this.q.length<2){this.AA();}}}).bind(this);this.AL.postMessage({message:"init",width:K.videoWidth,height:K.videoHeight,outputGl:true});}catch(e){wsLogger.error("Failed to init video decoder "+e);return;}this.CH=0;this.CO=0;this.BI=0;this.DC=false;this.DA=0;this.AZ=true;};WSPlayer.prototype.l=function(){this.BU=false;this.BN=false;if(this.AC){this.AC.length=0;}else{this.AC=[];}if(this.q){this.q.length=0;}else{this.q=[];}if(this.R){this.R.length=0;}else{this.R=[];}this.Be=false;};WSPlayer.prototype.AA=function(){if(this.AC.length>0){if(this.Be||this.AC[0].kframe){this.Be=true;if(!this.M.AT){this.q.push(this.AC[0].ts);}this.AL.postMessage({message:"decode",skip:this.M.AT,data:this.AC[0].payload},[this.AC[0].payload.buffer]);this.AC[0]=null;this.AC.shift();return true;}this.AC[0]=null;this.AC.shift();}};WSPlayer.prototype.play=function(streamId){if(!this.AZ){wsLogger.error("Can't play stream, player not initialized!");return;}this.l();this.j.postMessage({message:"play"});this.stream=streamId;this.unmute();this.f=N.BY;};WSPlayer.prototype.pause=function(){this.mute();this.j.postMessage({message:"pause"});this.f=N.CR;};WSPlayer.prototype.mute=function(){if(this.T){this.T.mute(true);}if(this.M){this.M.mute(true);}};WSPlayer.prototype.unmute=function(){if(this.T){this.T.mute(false);}if(this.M){this.M.mute(false);}};WSPlayer.prototype.resume=function(){this.l();this.f=N.BY;this.j.postMessage({message:"resume"});this.unmute();};WSPlayer.prototype.setVolume=function(volume){this.T.setVolume(volume);};WSPlayer.prototype.getVolume=function(){return this.T.getVolume();};WSPlayer.prototype.stop=function(){this.f=N.Aa;if(this.j){this.j.postMessage({message:"stop"});}if(this.T){this.T.stop();}if(this.M){this.M.stop();}this.CH=0;this.CO=0;this.BI=0;};WSPlayer.prototype.A9=function(CQ){if(this.f!=N.AX){return;}if(this.R.length>0){var Af=this.T.BA();if(Af==-1){requestAnimFrame(this.A9.bind(this));return;}wsLogger.trace("requestVideoFrameCallback, audio player time "+Af+" callback timestamp "+CQ);if(Af-this.R[0].sync>100&&this.R.length>1){this.R.shift();}if(this.R[0].sync<=Af){this.M.CT(this.R.shift());this.BI++;if(this.BI==1){var event={status:"PLAYING",info:"FIRST_FRAME_RENDERED"};this.A7(event);}}}if(this.q.length<3){this.AA();}requestAnimFrame(this.A9.bind(this));};WSPlayer.prototype.DN=function(message){if(this.Bb){if(Date.now()-this.Bb<1000){return;}}var event={status:"PLAYBACK_PROBLEM",info:message};this.A7(event);this.Bb=Date.now();};WSPlayer.prototype.Bv=function(text){var U=this.M.V;if(U){var textSize=U.measureText(text);U.fillStyle="white";var rectHeight=30;U.fillRect(0,this.canvas.height/2-rectHeight/2,this.canvas.width,rectHeight);U.fillStyle="black";U.font="30pt";U.textAlign="center";U.fillText(text,this.canvas.width/2,this.canvas.height/2);}else{}};WSPlayer.prototype.DB=function(text){var U=this.M.V;if(U){U.fillStyle="red";U.font="40pt";U.fillText(text,20,this.canvas.height-20);}else{}};WSPlayer.prototype.initLogger=function(verbosity){this.verbosity=verbosity||0;var G=this;if(window.wsLogger==undefined){window.wsLogger={log:function(){if(G.verbosity>=2){window.console.log.apply(window.console,arguments);}},warn:function(){if(G.verbosity>=1){window.console.warn.apply(window.console,arguments);}},error:function(){if(G.verbosity>=0){window.console.error.apply(window.console,arguments);}},debug:function(){if(G.verbosity>=3){window.console.log.apply(window.console,arguments);}},trace:function(){if(G.verbosity>=4){window.console.log.apply(window.console,arguments);}}};}if(window.wsLogger.debug==undefined){window.wsLogger.debug=function(){if(G.verbosity>=3){window.console.log.apply(window.console,arguments);}};}if(window.wsLogger.trace==undefined){window.wsLogger.trace=function(){if(G.verbosity>=4){window.console.log.apply(window.console,arguments);}};}};WSPlayer.prototype.getStreamStatistics=function(type){if(type=="audio"){return this.BU;}else if(type=="video"){return this.BN;}};var VideoRenderer=function(canvas,Am,Ak){this.canvas=canvas;this.width=canvas.width;this.height=canvas.height;this.AB=null;this.V=null;this.Am=Am;this.Ak=Ak;this.gl=null;this.program=null;this.buffer=null;this.YTexture=null;this.CBTexture=null;this.CRTexture=null;this.RGBTexture=null;this.AM=null;this.Aq=null;this.AK=null;this.AW=null;this.AT=false;this.CG=["precision mediump float;","uniform sampler2D YTexture;","uniform sampler2D CBTexture;","uniform sampler2D CRTexture;","varying vec2 texCoord;","void main() {","float y = texture2D(YTexture, texCoord).r;","float cr = texture2D(CRTexture, texCoord).r - 0.5;","float cb = texture2D(CBTexture, texCoord).r - 0.5;","gl_FragColor = vec4(","y + 1.4 * cr,","y + -0.343 * cb - 0.711 * cr,","y + 1.765 * cb,","1.0",");","}"].join("\n");this.CI=["attribute vec2 vertex;","varying vec2 texCoord;","void main() {","texCoord = vertex;","gl_Position = vec4((vertex * 2.0 - 1.0) * vec2(1, -1), 0.0, 1.0);","}"].join("\n");this.CL=["attribute vec4 vertex;","varying vec2 tc;","void main(){","gl_Position = vertex;","tc = vertex.xy*0.5+0.5;","}"].join("\n");this.CY=["precision mediump float;","uniform sampler2D RGBTexture;","varying vec2 tc;","void main(){","gl_FragColor = texture2D(RGBTexture, tc);","}"].join("\n");};VideoRenderer.prototype.init=function(){if(!this.Am){try{var gl=this.gl=this.canvas.getContext("webgl")||this.canvas.getContext("experimental-webgl");}catch(e){wsLogger.error("Failed to get webgl context, error "+e);}}if(gl){if(this.Ak=="rgba"){this.CK(gl);}else{this.CN(gl);}}else{this.V=this.canvas.getContext("2d");this.AB=this.Ay;}this.l();};VideoRenderer.prototype.CN=function(gl){this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),gl.STATIC_DRAW);this.program=gl.createProgram();gl.attachShader(this.program,this.compileShader(gl.VERTEX_SHADER,this.CI));gl.attachShader(this.program,this.compileShader(gl.FRAGMENT_SHADER,this.CG));gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS)){wsLogger.error("Failed to init WebGL! Message "+gl.getProgramInfoLog(this.program));this.V=this.canvas.getContext("2d");this.AB=this.Ay;return;}gl.useProgram(this.program);this.YTexture=this.createTexture(0,"YTexture");this.CRTexture=this.createTexture(1,"CRTexture");this.CBTexture=this.createTexture(2,"CBTexture");var vertexAttr=gl.getAttribLocation(this.program,"vertex");gl.enableVertexAttribArray(vertexAttr);gl.vertexAttribPointer(vertexAttr,2,gl.FLOAT,false,0,0);this.AB=this.CJ;};VideoRenderer.prototype.CK=function(gl){this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,1,1,-1,1,-1,-1]),gl.STATIC_DRAW);this.program=gl.createProgram();gl.attachShader(this.program,this.compileShader(gl.VERTEX_SHADER,this.CL));gl.attachShader(this.program,this.compileShader(gl.FRAGMENT_SHADER,this.CY));gl.bindAttribLocation(this.program,0,"vertex");gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS)){wsLogger.error("Failed to init WebGL! Message "+gl.getProgramInfoLog(this.program));this.V=this.canvas.getContext("2d");this.AB=this.Ay;return;}gl.useProgram(this.program);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);this.RGBTexture=this.createTexture(0,"RGBTexture");this.AB=this.CA;};VideoRenderer.prototype.l=function(){this.width=this.canvas.width;this.height=this.canvas.height;this.Aq=parseInt(this.width)+15>>4;this.AK=this.Aq<<4;this.AW=this.Aq<<3;var MaybeClampedUint8Array;if(typeof Uint8ClampedArray!=="undefined"){MaybeClampedUint8Array=Uint8ClampedArray;}else{MaybeClampedUint8Array=Uint8Array;}if(this.V){this.AM=new MaybeClampedUint8Array(this.canvas.width*this.canvas.height*4);for(var C=0,length=this.AM.length;C<length;C++){this.AM[C]=255;}}else if(this.gl){this.gl.viewport(0,0,this.width,this.height);}};VideoRenderer.prototype.stop=function(){if(this.V){var data=this.V.createImageData(this.width,this.height);this.V.putImageData(data,0,0);}else if(this.gl){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);}};VideoRenderer.prototype.createTexture=function(index,name){var gl=this.gl;var BM=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,BM);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(this.program,name),index);return BM;};VideoRenderer.prototype.compileShader=function(type,source){var gl=this.gl;var shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(shader));}return shader;};VideoRenderer.prototype.isUsingWebGL=function(){return(this.gl!==null||this.gl!==undefined)&&(this.V==null||this.V==undefined);};VideoRenderer.prototype.CJ=function(frame){var gl=this.gl;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.YTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,this.AK,this.height,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,frame.y);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.CRTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,this.AW,this.height/2,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,frame.cr);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,this.CBTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,this.AW,this.height/2,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,frame.cb);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);};VideoRenderer.prototype.CA=function(data){var gl=this.gl;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.RGBTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,data.width,data.height,0,gl.RGBA,gl.UNSIGNED_BYTE,data.data);gl.drawArrays(gl.TRIANGLES,0,6);};VideoRenderer.prototype.Ay=function(frame){var data=this.V.createImageData(frame.width,frame.height);if(frame.type=="yuv"){this.By(frame);data.data.set(this.AM);}else{data.data.set(frame.data);}this.V.putImageData(data,0,0);};VideoRenderer.prototype.CT=function(frame){if(!this.AT){if(this.canvas.width!=frame.width||this.canvas.height!=frame.height){wsLogger.log("Changing canvas resolution from "+this.canvas.width+"x"+this.canvas.height+" to "+frame.width+"x"+frame.height);this.canvas.width=frame.width;this.canvas.height=frame.height;this.l();}this.AB(frame);}this.Bl=Date.now();};VideoRenderer.prototype.By=function(frame){var Ae=frame.y;var Bo=frame.cb;var Bn=frame.cr;var W=this.AM;var A4=0;var Av=this.AK;var BK=this.AK+(this.AK-frame.width);var Ah=0;var Bj=this.AW-(frame.width>>1);var p=0;var m=frame.width*4;var Ba=frame.width*4;var B8=frame.width>>1;var rows=frame.height>>1;var y,cb,cr,AO,AR,AP;for(var BH=0;BH<rows;BH++){for(var BQ=0;BQ<B8;BQ++){cb=Bo[Ah];cr=Bn[Ah];Ah++;AO=cr+(cr*103>>8)-179;AR=(cb*88>>8)-44+(cr*183>>8)-91;AP=cb+(cb*198>>8)-227;var A2=Ae[A4++];var Ap=Ae[A4++];W[p]=A2+AO;W[p+1]=A2-AR;W[p+2]=A2+AP;W[p+4]=Ap+AO;W[p+5]=Ap-AR;W[p+6]=Ap+AP;p+=8;var A1=Ae[Av++];var Az=Ae[Av++];W[m]=A1+AO;W[m+1]=A1-AR;W[m+2]=A1+AP;W[m+4]=Az+AO;W[m+5]=Az-AR;W[m+6]=Az+AP;m+=8;}A4+=BK;Av+=BK;p+=Ba;m+=Ba;Ah+=Bj;}};VideoRenderer.prototype.Cz=function(){return this.Bl;};VideoRenderer.prototype.mute=function(mute){if(mute){this.AT=true;}else{this.AT=false;}};function AudioPlayer(audioContext){var G=this;this.l();this.Aw=false;this.O=audioContext;this.o=audioContext.createGain();this.o.connect(audioContext.destination);this.mute(true);wsLogger.log("Sample rate "+this.O.sampleRate);var AN=[];var C;for(C=256;C<=16384;C=C*2){AN.push(C);}var BC=this.O.sampleRate/1;var AV=AN[0];var Ag=Math.abs(BC-AV);for(C=0;C<AN.length;C++){var BL=Math.abs(BC-AN[C]);if(BL<Ag){Ag=BL;AV=AN[C];}}wsLogger.log("Audio node buffer size "+AV);this.internalBufferSize=AV;this.v=this.internalBufferSize/this.O.sampleRate*1000;try{this.O.createScriptProcessor=this.O.createScriptProcessor||this.O.createJavaScriptNode;this.Aj=this.O.createScriptProcessor(this.internalBufferSize,1,1);}catch(e){wsLogger.error("JS Audio Node is not supported in this browser"+e);}this.Aj.onaudioprocess=function(event){var output=event.outputBuffer.getChannelData(0);var C;if(G.Z.length>0){var Al=G.Z.shift();for(C=0;C<output.length;C++){output[C]=Al.payload[C];}if(!G.z){G.BS=Al.sync;}else{G.BS=G.z;}G.z=Al.sync;if(!G.d){G.BW=event.playbackTime*1000;}else{G.BW=G.d;}G.d=event.playbackTime*1000;G.CV=false;}else{for(C=0;C<output.length;C++){output[C]=0;}G.CV=true;if(G.o.gain.value!=0){wsLogger.debug("No audio in audio buffer!");}}};}AudioPlayer.prototype.start=function(){if(!this.Aw){this.Aj.connect(this.o);this.Aw=true;}this.mute(false);};AudioPlayer.prototype.stop=function(){this.Aj.disconnect();this.Aw=false;this.z=undefined;this.d=undefined;this.Z=[];this.mute(true);};AudioPlayer.prototype.l=function(){if(this.Z){this.Z.length=0;}else{this.Z=[];}};AudioPlayer.prototype.C4=function(){this.l();};AudioPlayer.prototype.B9=function(CU){this.Z.push(CU);};AudioPlayer.prototype.Cy=function(){return this.Z.length;};AudioPlayer.prototype.BA=function(){if(this.z&&this.d){var time=this.O.currentTime*1000;if(time>=this.d){if(time-this.d>this.v){wsLogger.debug("No audio! "+(time-this.v-this.d));return this.z+this.v;}return time-this.d+this.z;}else{return time-this.BW+this.BS;}}return-1;};AudioPlayer.prototype.getBufferTimeLength=function(){var CW=this.O.currentTime*1000-this.d;var BZ=this.v-CW;return BZ>0?this.v*this.Z.length+BZ:this.v*this.Z.length;};AudioPlayer.prototype.C1=function(){return this.d;};AudioPlayer.prototype.mute=function(mute){if(mute){wsLogger.log("Audio player mute");this.o.gain.value=0;}else{wsLogger.log("Audio player resume");this.o.gain.value=1;}};AudioPlayer.prototype.setVolume=function(volume){this.o.gain.value=volume/100;};AudioPlayer.prototype.getVolume=function(){return this.o.gain.value*100;};var N=function(){};N.Aa="STOPPED";N.AX="PLAYING";N.CR="PAUSED";N.BY="STARTUP";exports.WSPlayer=WSPlayer;