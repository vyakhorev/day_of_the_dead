var Services = {
    getSceneService: function () {
        return this.scene_service;
    },

    setSceneService: function (service) {
        this.scene_service = service;
    },

    getPrefabService: function () {
        return this.prefab_service;
    },

    setPrefabService: function (service) {
        this.prefab_service = service;
    }


};

export {Services}
