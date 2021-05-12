import * as Cesium from 'cesium';
// const NetCDFReader = require('netcdfjs');

export const DataProcess = (function () {
    let data: any;

    let loadNetCDF = function (filePath: any) {
        return new Promise(function (resolve) {
            let request = new XMLHttpRequest();
            request.open('GET', filePath);
            request.responseType = 'arraybuffer';

            request.onload = function () {
                let arrayToMap = function (array: any) {
                    return array.reduce(function (map: any, object: any) {
                        map[object.name] = object;
                        return map;
                    }, {});
                }

                let NetCDF = new window.netcdfjs(request.response);
                data = {};

                let dimensions = arrayToMap(NetCDF.dimensions);
                data.dimensions = {};
                data.dimensions.lon = dimensions['lon'].size;
                data.dimensions.lat = dimensions['lat'].size;
                data.dimensions.lev = dimensions['lev'].size;

                let variables = arrayToMap(NetCDF.variables);
                let uAttributes = arrayToMap(variables['U'].attributes);
                let vAttributes = arrayToMap(variables['V'].attributes);

                data.lon = {};
                data.lon.array = new Float32Array(NetCDF.getDataVariable('lon').flat());
                data.lon.min = Math.min(...data.lon.array);
                data.lon.max = Math.max(...data.lon.array);

                data.lat = {};
                data.lat.array = new Float32Array(NetCDF.getDataVariable('lat').flat());
                data.lat.min = Math.min(...data.lat.array);
                data.lat.max = Math.max(...data.lat.array);

                data.lev = {};
                data.lev.array = new Float32Array(NetCDF.getDataVariable('lev').flat());
                data.lev.min = Math.min(...data.lev.array);
                data.lev.max = Math.max(...data.lev.array);

                data.U = {};
                data.U.array = new Float32Array(NetCDF.getDataVariable('U').flat());
                data.U.min = uAttributes['min'].value;
                data.U.max = uAttributes['max'].value;

                data.V = {};
                data.V.array = new Float32Array(NetCDF.getDataVariable('V').flat());
                data.V.min = vAttributes['min'].value;
                data.V.max = vAttributes['max'].value;

                resolve(data);
            };

            request.send();
        });
    }

    let loadData = async function () {
        // let ncFilePath = fileOptions.dataDirectory + fileOptions.dataFile;
        // 注意：这个路径是浏览器访问路径，应该在public文件夹下
        let ncFilePath = "./demo.nc";
        await loadNetCDF(ncFilePath);

        return data;
    }

    let randomizeParticles = function (maxParticles: any, viewerParameters: any) {
        let array = new Float32Array(4 * maxParticles);
        for (let i = 0; i < maxParticles; i++) {
            array[4 * i] = Cesium.Math.randomBetween(viewerParameters.lonRange.x, viewerParameters.lonRange.y);
            array[4 * i + 1] = Cesium.Math.randomBetween(viewerParameters.latRange.x, viewerParameters.latRange.y);
            array[4 * i + 2] = Cesium.Math.randomBetween(data.lev.min, data.lev.max);
            array[4 * i + 3] = 0.0;
        }
        return array;
    }

    return {
        loadData: loadData,
        randomizeParticles: randomizeParticles
    };

})();