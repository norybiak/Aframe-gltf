/**
 *  glTF component and primitive compatibility for aframe 0.3.0.
 * 
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