/**
 *  glTF component and primitive compatibility for aframe 0.3.0.
 *   
 * NorybiaK
 * v0.3.0
 */
 
//Lets allow older version of Three.js to work with the latest GLTFLoader.
THREE.FileLoader = THREE.FileLoader || THREE.XHRLoader;

/**
 * glTF model system.
 */
 
AFRAME.registerSystem('gltf-model', {
  init: function () {
    this.models = [];
  },
   
  /**
   * Registers a glTF asset.
   * @param {object} gltf Asset containing a scene and (optional) animations and cameras.
   */
  registerModel: function (gltf) {
    this.models.push(gltf);
  },

  /**
   * Unregisters a glTF asset.
   * @param  {object} gltf Asset containing a scene and (optional) animations and cameras.
   */
  unregisterModel: function (gltf) {
    var models = this.models;
    var index = models.indexOf(gltf);
    if (index >= 0) {
      models.splice(index, 1);
    }
  }
});

/**
 * glTF model loader.
 */
 
AFRAME.registerComponent('gltf-model', {
  schema: { type: 'string' },

  init: function () {
    this.model = null;
    this.loader = new THREE.GLTFLoader();
	this.loader.setCrossOrigin('anonymous');
  },

  update: function () {
    var self = this;
    var el = this.el;
    var src = this.data;
	
    if (!src) { return; }

    this.remove();
    this.loader.load(src, function gltfLoaded (gltfModel) {
      self.model = gltfModel.scene;
      self.system.registerModel(self.model);
      el.setObject3D('mesh', self.model);
      el.emit('model-loaded', {format: 'gltf', model: self.model});
	  
    });
  },

  remove: function () {
    if (!this.model) { return; }
    this.el.removeObject3D('mesh');
    this.system.unregisterModel(this.model);
  }
});

/**
 * glTF model primitive.
 */
 
AFRAME.registerPrimitive('a-gltf-model', {
  mappings: {
    src: 'gltf-model'
  }
});
THREE.GLTFLoader=function(){function e(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager}function r(){var e={};return{get:function(r){return e[r]},add:function(r,t){e[r]=t},remove:function(r){delete e[r]},removeAll:function(){e={}},update:function(r,t){for(var n in e){var a=e[n];a.update&&a.update(r,t)}}}}function t(e,r){var t={},n=e.material.uniforms;for(var a in n){var i=n[a];if(i.semantic){var s=i.node,o=e;s&&(o=r[s]),t[a]={semantic:i.semantic,sourceNode:o,targetNode:e,uniform:i}}}this.boundUniforms=t,this._m4=new THREE.Matrix4}function n(e){this.name=d.KHR_MATERIALS_COMMON,this.lights={};var r=e.extensions&&e.extensions[d.KHR_MATERIALS_COMMON]||{},t=r.lights||{};for(var n in t){var a,i=t[n],s=i[i.type],o=(new THREE.Color).fromArray(s.color);switch(i.type){case"directional":a=new THREE.DirectionalLight(o),a.position.set(0,0,1);break;case"point":a=new THREE.PointLight(o);break;case"spot":a=new THREE.SpotLight(o),a.position.set(0,0,1);break;case"ambient":a=new THREE.AmbientLight(o)}a&&(this.lights[n]=a)}}function a(e){this.name=d.KHR_BINARY_GLTF;var r=new DataView(e,0,l),t={magic:o(new Uint8Array(e.slice(0,4))),version:r.getUint32(4,!0),length:r.getUint32(8,!0),contentLength:r.getUint32(12,!0),contentFormat:r.getUint32(16,!0)};for(var n in f){var a=f[n];if(t[n]!==a)throw new Error('Unsupported glTF-Binary header: Expected "%s" to be "%s".',n,a)}var i=new Uint8Array(e,l,t.contentLength);this.header=t,this.content=o(i),this.body=e.slice(l+t.contentLength,t.length)}function i(e,r,t){if(!e)return Promise.resolve();var n,a=[];if("[object Array]"===Object.prototype.toString.call(e)){n=[];for(var i=e.length,s=0;s<i;s++){var o=r.call(t||this,e[s],s);o&&(a.push(o),o instanceof Promise?o.then(function(e,r){n[e]=r}.bind(this,s)):n[s]=o)}}else{n={};for(var c in e)if(e.hasOwnProperty(c)){var o=r.call(t||this,e[c],c);o&&(a.push(o),o instanceof Promise?o.then(function(e,r){n[e]=r}.bind(this,c)):n[c]=o)}}return Promise.all(a).then(function(){return n})}function s(e,r){if("string"!=typeof e||""===e)return"";if(/^(https?:)?\/\//i.test(e))return e;if(/^data:.*,.*$/i.test(e))return e;var t=new URL((r||"")+e,location.href.substring(0,location.href.lastIndexOf("/")+1));return t.toString()}function o(e){for(var r="",t=0;t<e.length;t++)r+=String.fromCharCode(e[t]);return r}function c(){return new THREE.MeshPhongMaterial({color:0,emissive:8947848,specular:0,shininess:0,transparent:!1,depthTest:!0,side:THREE.FrontSide})}function u(e){this.isDeferredShaderMaterial=!0,this.params=e}function E(e,t,n){this.json=e||{},this.extensions=t||{},this.options=n||{},this.cache=new r}e.prototype={constructor:e,load:function(e,r,t,n){var a=this,i=this.path&&"string"==typeof this.path?this.path:THREE.Loader.prototype.extractUrlBase(e),s=new THREE.FileLoader(a.manager);s.setResponseType("arraybuffer"),s.load(e,function(e){a.parse(e,r,i)},t,n)},setCrossOrigin:function(e){this.crossOrigin=e},setPath:function(e){this.path=e},parse:function(e,r,t){var i,s={},c=o(new Uint8Array(e,0,4));c===f.magic?(s[d.KHR_BINARY_GLTF]=new a(e),i=s[d.KHR_BINARY_GLTF].content):i=o(new Uint8Array(e));var u=JSON.parse(i);u.extensionsUsed&&u.extensionsUsed.indexOf(d.KHR_MATERIALS_COMMON)>=0&&(s[d.KHR_MATERIALS_COMMON]=new n(u)),console.time("GLTFLoader");var p=new E(u,s,{path:t||this.path,crossOrigin:this.crossOrigin});p.parse(function(e,t,n,a){console.timeEnd("GLTFLoader");var i={scene:e,scenes:t,cameras:n,animations:a};r(i)})}},e.Shaders={update:function(){console.warn("THREE.GLTFLoader.Shaders has been deprecated, and now updates automatically.")}},t.prototype.update=function(e,r){var t=this.boundUniforms;for(var n in t){var a=t[n];switch(a.semantic){case"MODELVIEW":var i=a.uniform.value;i.multiplyMatrices(r.matrixWorldInverse,a.sourceNode.matrixWorld);break;case"MODELVIEWINVERSETRANSPOSE":var s=a.uniform.value;this._m4.multiplyMatrices(r.matrixWorldInverse,a.sourceNode.matrixWorld),s.getNormalMatrix(this._m4);break;case"PROJECTION":var i=a.uniform.value;i.copy(r.projectionMatrix);break;case"JOINTMATRIX":for(var o=a.uniform.value,c=0;c<o.length;c++)o[c].getInverse(a.sourceNode.matrixWorld).multiply(a.targetNode.skeleton.bones[c].matrixWorld).multiply(a.targetNode.skeleton.boneInverses[c]).multiply(a.targetNode.bindMatrix);break;default:console.warn("Unhandled shader semantic: "+a.semantic)}}},e.Animations={update:function(){console.warn("THREE.GLTFLoader.Animation has been deprecated. Use THREE.AnimationMixer instead.")}};var d={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_MATERIALS_COMMON:"KHR_materials_common"},p="binary_glTF",f={magic:"glTF",version:1,contentFormat:0},l=20;a.prototype.loadShader=function(e,r){var t=r[e.extensions[d.KHR_BINARY_GLTF].bufferView],n=new Uint8Array(t);return o(n)},a.prototype.loadTextureSourceUri=function(e,r){var t=e.extensions[d.KHR_BINARY_GLTF],n=r[t.bufferView],a=o(new Uint8Array(n));return"data:"+t.mimeType+";base64,"+btoa(a)};var h={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,TRIANGLES:4,LINES:1,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123,VERTEX_SHADER:35633,FRAGMENT_SHADER:35632},m=({5126:Number,35675:THREE.Matrix3,35676:THREE.Matrix4,35664:THREE.Vector2,35665:THREE.Vector3,35666:THREE.Vector4,35678:THREE.Texture},{5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array}),T={9728:THREE.NearestFilter,9729:THREE.LinearFilter,9984:THREE.NearestMipMapNearestFilter,9985:THREE.LinearMipMapNearestFilter,9986:THREE.NearestMipMapLinearFilter,9987:THREE.LinearMipMapLinearFilter},R={33071:THREE.ClampToEdgeWrapping,33648:THREE.MirroredRepeatWrapping,10497:THREE.RepeatWrapping},v={6406:THREE.AlphaFormat,6407:THREE.RGBFormat,6408:THREE.RGBAFormat,6409:THREE.LuminanceFormat,6410:THREE.LuminanceAlphaFormat},H={5121:THREE.UnsignedByteType,32819:THREE.UnsignedShort4444Type,32820:THREE.UnsignedShort5551Type,33635:THREE.UnsignedShort565Type},y=({1028:THREE.BackSide,1029:THREE.FrontSide},{512:THREE.NeverDepth,513:THREE.LessDepth,514:THREE.EqualDepth,515:THREE.LessEqualDepth,516:THREE.GreaterEqualDepth,517:THREE.NotEqualDepth,518:THREE.GreaterEqualDepth,519:THREE.AlwaysDepth},{32774:THREE.AddEquation,32778:THREE.SubtractEquation,32779:THREE.ReverseSubtractEquation},{0:THREE.ZeroFactor,1:THREE.OneFactor,768:THREE.SrcColorFactor,769:THREE.OneMinusSrcColorFactor,770:THREE.SrcAlphaFactor,771:THREE.OneMinusSrcAlphaFactor,772:THREE.DstAlphaFactor,773:THREE.OneMinusDstAlphaFactor,774:THREE.DstColorFactor,775:THREE.OneMinusDstColorFactor,776:THREE.SrcAlphaSaturateFactor},{SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16}),A={scale:"scale",translation:"position",rotation:"quaternion"},w={LINEAR:THREE.InterpolateLinear,STEP:THREE.InterpolateDiscrete};return u.prototype.create=function(){var e=THREE.UniformsUtils.clone(this.params.uniforms);for(var r in this.params.uniforms){var t=this.params.uniforms[r];t.value instanceof THREE.Texture&&(e[r].value=t.value,e[r].value.needsUpdate=!0),e[r].semantic=t.semantic,e[r].node=t.node}return this.params.uniforms=e,new THREE.RawShaderMaterial(this.params)},E.prototype._withDependencies=function(e){for(var r={},t=0;t<e.length;t++){var n=e[t],a="load"+n.charAt(0).toUpperCase()+n.slice(1),s=this.cache.get(n);if(void 0!==s)r[n]=s;else if(this[a]){var o=this[a]();this.cache.add(n,o),r[n]=o}}return i(r,function(e){return e})},E.prototype.parse=function(e){var r=this.json;this.cache.removeAll(),this._withDependencies(["scenes","cameras","animations"]).then(function(t){var n=[];for(var a in t.scenes)n.push(t.scenes[a]);var i=void 0!==r.scene?t.scenes[r.scene]:n[0],s=[];for(var a in t.cameras){var o=t.cameras[a];s.push(o)}var c=[];for(var a in t.animations)c.push(t.animations[a]);e(i,n,s,c)})},E.prototype.loadShaders=function(){var e=this.json,r=this.extensions,t=this.options;return this._withDependencies(["bufferViews"]).then(function(n){return i(e.shaders,function(e){return e.extensions&&e.extensions[d.KHR_BINARY_GLTF]?r[d.KHR_BINARY_GLTF].loadShader(e,n.bufferViews):new Promise(function(r){var n=new THREE.FileLoader;n.setResponseType("text"),n.load(s(e.uri,t.path),function(e){r(e)})})})})},E.prototype.loadBuffers=function(){var e=this.json,r=this.extensions,t=this.options;return i(e.buffers,function(e,n){return n===p?r[d.KHR_BINARY_GLTF].body:"arraybuffer"===e.type||void 0===e.type?new Promise(function(r){var n=new THREE.FileLoader;n.setResponseType("arraybuffer"),n.load(s(e.uri,t.path),function(e){r(e)})}):void console.warn("THREE.GLTFLoader: "+e.type+" buffer type is not supported")})},E.prototype.loadBufferViews=function(){var e=this.json;return this._withDependencies(["buffers"]).then(function(r){return i(e.bufferViews,function(e){var t=r.buffers[e.buffer],n=void 0!==e.byteLength?e.byteLength:0;return t.slice(e.byteOffset,e.byteOffset+n)})})},E.prototype.loadAccessors=function(){var e=this.json;return this._withDependencies(["bufferViews"]).then(function(r){return i(e.accessors,function(e){var t=r.bufferViews[e.bufferView],n=y[e.type],a=m[e.componentType],i=a.BYTES_PER_ELEMENT,s=i*n;if(e.byteStride&&e.byteStride!==s){var o=new a(t),c=new THREE.InterleavedBuffer(o,e.byteStride/i);return new THREE.InterleavedBufferAttribute(c,n,e.byteOffset/i)}return o=new a(t,e.byteOffset,e.count*n),new THREE.BufferAttribute(o,n)})})},E.prototype.loadTextures=function(){var e=this.json,r=this.extensions,t=this.options;return this._withDependencies(["bufferViews"]).then(function(n){return i(e.textures,function(a){function i(r){if(r.flipY=!1,void 0!==a.name&&(r.name=a.name),r.format=void 0!==a.format?v[a.format]:THREE.RGBAFormat,void 0!==a.internalFormat&&r.format!==v[a.internalFormat]&&console.warn("THREE.GLTFLoader: Three.js doesn't support texture internalFormat which is different from texture format. internalFormat will be forced to be the same value as format."),r.type=void 0!==a.type?H[a.type]:THREE.UnsignedByteType,a.sampler){var t=e.samplers[a.sampler];r.magFilter=T[t.magFilter]||THREE.LinearFilter,r.minFilter=T[t.minFilter]||THREE.NearestMipMapLinearFilter,r.wrapS=R[t.wrapS]||THREE.RepeatWrapping,r.wrapT=R[t.wrapT]||THREE.RepeatWrapping}}if(a.source)return new Promise(function(o){var c=e.images[a.source],u=c.uri;if(c.extensions&&c.extensions[d.KHR_BINARY_GLTF]&&(u=r[d.KHR_BINARY_GLTF].loadTextureSourceUri(c,n.bufferViews)),altspace&&altspace.inClient)a=new THREE.Texture({src:s(u,t.path)}),i(a),o(a);else{var E=THREE.Loader.Handlers.get(u);null===E&&(E=new THREE.TextureLoader),E.setCrossOrigin(t.crossOrigin),E.load(s(u,t.path),function(e){i(e),o(e)},void 0,function(){o()})}})})})},E.prototype.loadMaterials=function(){var e=this.json;return this._withDependencies(["shaders","textures"]).then(function(r){return i(e.materials,function(e){var t,n,a={},i={};if(e.extensions&&e.extensions[d.KHR_MATERIALS_COMMON]&&(n=e.extensions[d.KHR_MATERIALS_COMMON]),n){var s=["ambient","emission","transparent","transparency","doubleSided"];switch(n.technique){case"BLINN":case"PHONG":t=THREE.MeshPhongMaterial,s.push("diffuse","specular","shininess");break;case"LAMBERT":t=THREE.MeshLambertMaterial,s.push("diffuse");break;case"CONSTANT":default:t=THREE.MeshBasicMaterial}s.forEach(function(e){void 0!==n.values[e]&&(a[e]=n.values[e])}),(n.doubleSided||a.doubleSided)&&(i.side=THREE.DoubleSide),(n.transparent||a.transparent)&&(i.transparent=!0,i.opacity=void 0!==a.transparency?a.transparency:1)}else t=THREE.MeshPhongMaterial,Object.assign(a,e.values);Array.isArray(a.diffuse)?i.color=(new THREE.Color).fromArray(a.diffuse):"string"==typeof a.diffuse&&(i.map=r.textures[a.diffuse]),delete i.diffuse,"string"==typeof a.reflective&&(i.envMap=r.textures[a.reflective]),"string"==typeof a.bump&&(i.bumpMap=r.textures[a.bump]),Array.isArray(a.emission)?t===THREE.MeshBasicMaterial?i.color=(new THREE.Color).fromArray(a.emission):i.emissive=(new THREE.Color).fromArray(a.emission):"string"==typeof a.emission&&(t===THREE.MeshBasicMaterial?i.map=r.textures[a.emission]:i.emissiveMap=r.textures[a.emission]),Array.isArray(a.specular)?i.specular=(new THREE.Color).fromArray(a.specular):"string"==typeof a.specular&&(i.specularMap=r.textures[a.specular]),void 0!==a.shininess&&(i.shininess=a.shininess);var o=new t(i);return void 0!==e.name&&(o.name=e.name),o})})},E.prototype.loadMeshes=function(){var e=this.json;return this._withDependencies(["accessors","materials"]).then(function(r){return i(e.meshes,function(e){var t=new THREE.Group;void 0!==e.name&&(t.name=e.name),e.extras&&(t.userData=e.extras);var n=e.primitives||[];for(var a in n){var i=n[a];if(i.mode===h.TRIANGLES||void 0===i.mode){var s=new THREE.BufferGeometry,o=i.attributes;for(var u in o){var E=o[u];if(!E)return;var d=r.accessors[E];switch(u){case"POSITION":s.addAttribute("position",d);break;case"NORMAL":s.addAttribute("normal",d);break;case"TEXCOORD_0":case"TEXCOORD0":case"TEXCOORD":s.addAttribute("uv",d);break;case"TEXCOORD_1":s.addAttribute("uv2",d);break;case"COLOR_0":case"COLOR0":case"COLOR":s.addAttribute("color",d);break;case"WEIGHT":s.addAttribute("skinWeight",d);break;case"JOINT":s.addAttribute("skinIndex",d)}}i.indices&&s.setIndex(r.accessors[i.indices]);var p=void 0!==r.materials?r.materials[i.material]:c(),f=new THREE.Mesh(s,p);f.castShadow=!0,f.name="0"===a?t.name:t.name+a,i.extras&&(f.userData=i.extras),t.add(f)}else if(i.mode===h.LINES){var s=new THREE.BufferGeometry,o=i.attributes;for(var u in o){var E=o[u];if(!E)return;var d=r.accessors[E];switch(u){case"POSITION":s.addAttribute("position",d);break;case"COLOR_0":case"COLOR0":case"COLOR":s.addAttribute("color",d)}}var f,p=r.materials[i.material];i.indices?(s.setIndex(r.accessors[i.indices]),f=new THREE.LineSegments(s,p)):f=new THREE.Line(s,p),f.name="0"===a?t.name:t.name+a,i.extras&&(f.userData=i.extras),t.add(f)}else console.warn("Only triangular and line primitives are supported")}return t})})},E.prototype.loadCameras=function(){var e=this.json;return i(e.cameras,function(e){if("perspective"==e.type&&e.perspective){var r=e.perspective.yfov,t=void 0!==e.perspective.aspectRatio?e.perspective.aspectRatio:1,n=r*t,a=new THREE.PerspectiveCamera(THREE.Math.radToDeg(n),t,e.perspective.znear||1,e.perspective.zfar||2e6);return void 0!==e.name&&(a.name=e.name),e.extras&&(a.userData=e.extras),a}if("orthographic"==e.type&&e.orthographic){var a=new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,e.orthographic.znear,e.orthographic.zfar);return void 0!==e.name&&(a.name=e.name),e.extras&&(a.userData=e.extras),a}})},E.prototype.loadSkins=function(){var e=this.json;return this._withDependencies(["accessors"]).then(function(r){return i(e.skins,function(e){var t=new THREE.Matrix4;void 0!==e.bindShapeMatrix&&t.fromArray(e.bindShapeMatrix);var n={bindShapeMatrix:t,jointNames:e.jointNames,inverseBindMatrices:r.accessors[e.inverseBindMatrices]};return n})})},E.prototype.loadAnimations=function(){var e=this.json;return this._withDependencies(["accessors","nodes"]).then(function(r){return i(e.animations,function(e,t){var n=[];for(var a in e.channels){var i=e.channels[a],s=e.samplers[i.sampler];if(s){var o=i.target,c=o.id,u=void 0!==e.parameters?e.parameters[s.input]:s.input,E=void 0!==e.parameters?e.parameters[s.output]:s.output,d=r.accessors[u],p=r.accessors[E],f=r.nodes[c];if(f){f.updateMatrix(),f.matrixAutoUpdate=!0;var l=A[o.path]===A.rotation?THREE.QuaternionKeyframeTrack:THREE.VectorKeyframeTrack,h=f.name?f.name:f.uuid,m=void 0!==s.interpolation?w[s.interpolation]:THREE.InterpolateLinear;n.push(new l(h+"."+A[o.path],THREE.AnimationUtils.arraySlice(d.array,0),THREE.AnimationUtils.arraySlice(p.array,0),m))}}}var c=void 0!==e.name?e.name:"animation_"+t;return new THREE.AnimationClip(c,(void 0),n)})})},E.prototype.loadNodes=function(){var e=this.json,r=this.extensions,t=this;return i(e.nodes,function(e){var r,t=new THREE.Matrix4;return e.jointName?(r=new THREE.Bone,r.name=void 0!==e.name?e.name:e.jointName,r.jointName=e.jointName):(r=new THREE.Object3D,void 0!==e.name&&(r.name=e.name)),e.extras&&(r.userData=e.extras),void 0!==e.matrix?(t.fromArray(e.matrix),r.applyMatrix(t)):(void 0!==e.translation&&r.position.fromArray(e.translation),void 0!==e.rotation&&r.quaternion.fromArray(e.rotation),void 0!==e.scale&&r.scale.fromArray(e.scale)),r}).then(function(n){return t._withDependencies(["meshes","skins","cameras"]).then(function(t){return i(n,function(a,i){var s=e.nodes[i];if(void 0!==s.meshes)for(var o in s.meshes){var c=s.meshes[o],u=t.meshes[c];if(void 0!==u)for(var E in u.children){var p,f=u.children[E],l=f.material,h=f.geometry,m=f.userData,T=f.name;switch(l.isDeferredShaderMaterial?l=p=l.create():p=l,f.type){case"LineSegments":f=new THREE.LineSegments(h,p);break;case"LineLoop":f=new THREE.LineLoop(h,p);break;case"Line":f=new THREE.Line(h,p);break;default:f=new THREE.Mesh(h,p)}f.castShadow=!0,f.userData=m,f.name=T;var R;if(s.skin&&(R=t.skins[s.skin]),R){var v=function(e){for(var r=Object.keys(n),t=0,a=r.length;t<a;t++){var i=n[r[t]];if(i.jointName===e)return i}return null},H=h,p=l;p.skinning=!0,f=new THREE.SkinnedMesh(H,p,(!1)),f.castShadow=!0,f.userData=m,f.name=T;for(var y=[],A=[],w=0,M=R.jointNames.length;w<M;w++){var L=R.jointNames[w],b=v(L);if(b){y.push(b);var g=R.inverseBindMatrices.array,O=(new THREE.Matrix4).fromArray(g,16*w);A.push(O)}else console.warn("WARNING: joint: '"+L+"' could not be found")}f.bind(new THREE.Skeleton(y,A,(!1)),R.bindShapeMatrix);var S=function(r,t,a){var i=r[a];if(void 0!==i)for(var s=0,o=i.length;s<o;s++){var c=i[s],u=n[c],E=e.nodes[c];void 0!==u&&u.isBone===!0&&void 0!==E&&(t.add(u),S(E,u,"children"))}};S(s,f,"skeletons")}a.add(f)}else console.warn("GLTFLoader: Couldn't find node \""+c+'".')}if(void 0!==s.camera){var x=t.cameras[s.camera];a.add(x)}if(s.extensions&&s.extensions[d.KHR_MATERIALS_COMMON]&&s.extensions[d.KHR_MATERIALS_COMMON].light){var _=r[d.KHR_MATERIALS_COMMON].lights,N=_[s.extensions[d.KHR_MATERIALS_COMMON].light];a.add(N)}return a})})})},E.prototype.loadScenes=function(){function e(t,n,a){var i=a[t];n.add(i);var s=r.nodes[t];if(s.children)for(var o=s.children,c=0,u=o.length;c<u;c++){var E=o[c];e(E,i,a)}}var r=this.json;return this._withDependencies(["nodes"]).then(function(n){return i(r.scenes,function(r){var a=new THREE.Scene;void 0!==r.name&&(a.name=r.name),r.extras&&(a.userData=r.extras);for(var i=r.nodes||[],s=0,o=i.length;s<o;s++){var c=i[s];e(c,a,n.nodes)}return a.traverse(function(e){e.material&&e.material.isRawShaderMaterial&&(e.gltfShader=new t(e,n.nodes),e.onBeforeRender=function(e,r,t){this.gltfShader.update(r,t)})}),a})})},e}();