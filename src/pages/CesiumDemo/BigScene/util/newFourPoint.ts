export const newFourPoint = {
    "type": "FeatureCollection",
    "name": "newFourPoint",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 1 }, "geometry": { "type": "Point", "coordinates": [121.365755989284201, 31.209051748428221] } },
        { "type": "Feature", "properties": { "id": 2 }, "geometry": { "type": "Point", "coordinates": [121.366380414851032, 31.209805905655672] } }, // 断面
        // { "type": "Feature", "properties": { "id": 3 }, "geometry": { "type": "Point", "coordinates": [121.365179598195141, 31.208571424739056] } }, // 泵闸
        { "type": "Feature", "properties": { "id": 3 }, "geometry": { "type": "Point", "coordinates": [121.37050, 31.216841] } }, // 泵闸
        // { "type": "Feature", "properties": { "id": 4 }, "geometry": { "type": "Point", "coordinates": [121.364879979455293, 31.208458266467884] } }
        { "type": "Feature", "properties": { "id": 4 }, "geometry": { "type": "Point", "coordinates": [121.365748037160984, 31.209247605593807] } }

    ]
}


export const newBuildingLabel = {
    "type": "FeatureCollection",
    "name": "newBuildingLabel",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
        { "type": "Feature", "properties": { "id": 1 }, "geometry": { "type": "Point", "coordinates": [121.365122087479207, 31.209064131502057] } },
        { "type": "Feature", "properties": { "id": 2 }, "geometry": { "type": "Point", "coordinates": [121.36499172616864, 31.209681453134049] } },
        { "type": "Feature", "properties": { "id": 3 }, "geometry": { "type": "Point", "coordinates": [121.365471013781175, 31.20986166221709] } }
    ]
}
