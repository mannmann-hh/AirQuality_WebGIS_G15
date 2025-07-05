// -------------------- Base Map --------------------
let osm = new ol.layer.Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
});

let basemapLayers = new ol.layer.Group({
    title: 'Base Maps',
    layers: [osm]
});

let overlayLayers = new ol.layer.Group({
    title: 'Overlay Layers',
    layers: []
});

// -------------------- Map Initialization --------------------
let mapOrigin = ol.proj.fromLonLat([35, 39]);
let zoomLevel = 6;
let map = new ol.Map({
    target: document.getElementById('map'),
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        center: mapOrigin,
        zoom: zoomLevel,
        projection: 'EPSG:3857'
    })
});

// -------------------- Add Controls --------------------
map.addControl(new ol.control.ScaleLine());
// map.addControl(new ol.control.FullScreen());
map.addControl(new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:3857',
    className: 'custom-control',
    placeholder: '0.0000, 0.0000'
}));

var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);



// -------------------- GeoServer WMS Layers --------------------
function createWMSLayer(title, layerName) {
    return new ol.layer.Image({
        title: title,
        source: new ol.source.ImageWMS({
            url: "https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_15/wms",
            params: { 'LAYERS': layerName }
        }),
        visible: false,
        opacity: 0.6
    });
}

const wmsLayers = [
    ["no₂ CAMS 2022-12", "gisgeoserver_15:Turkey_CAMS_no2_2022_12"],
    ["pm2p5 CAMS 2022-12", "gisgeoserver_15:Turkey_CAMS_pm2p5_2022_12"],
    ["LC reclassified 2022", "gisgeoserver_15:Turkey_LC_reclassified_2022"],
    ["average no₂ 2022", "gisgeoserver_15:Turkey_average_NO2_2022"],
    ["average pm2p5 2022", "gisgeoserver_15:Turkey_average_pm2p5_2022"],
    ["no₂ 2017-2021 AAD 2022", "gisgeoserver_15:Turkey_no2_2017-2021_AAD_map_2022"],
    ["no₂ 2020 bivariate", "gisgeoserver_15:Turkey_no2_2020_bivariate"],
    ["no₂ concentration 2020", "gisgeoserver_15:Turkey_no2_concentration_map_2020"],
    ["no₂ zonal statistics 2013-2022", "gisgeoserver_15:Turkey_no2_zonal_statistics_2013-2022"],
    ["pm2p5 2017-2021 ADD 2022", "gisgeoserver_15:Turkey_pm2p5_2017-2021_ADD_map_2022"],
    ["pm2p5 bivariate", "gisgeoserver_15:Turkey_pm2p5_bivariate"],
    ["pm2p5 concentration 2020", "gisgeoserver_15:Turkey_pm2p5_concentration_map_2020"],
    ["pm2p5 zonal statistics 2013-2022", "gisgeoserver_15:Turkey_pm2p5_zonal_statistics_2013-2022"],
    ["pm10 CAMS 2022-12", "gisgeoserver_15:Turkey_CAMS_pm10_2022_12"],
    ["average pm10 2022", "gisgeoserver_15:Turkey_average_pm10_2022"],
    ["pm10 2017-2021 AAD 2022", "gisgeoserver_15:Turkey_pm10_2017-2021_AAD_map_2022"],
    ["pm10 2020 bivariate", "gisgeoserver_15:Turkey_pm10_2020_bivariate"],
    ["pm10 concentration 2020", "gisgeoserver_15:Turkey_pm10_concentration_map_2022"],
    ["pm10 zonal statistics 2013-2022", "gisgeoserver_15:Turkey_pm10_zonal_statistics_2013-2022"],
];

let mainLegendLayer = null;

wmsLayers.forEach(([title, layerName]) => {
    const layer = createWMSLayer(title, layerName);
    overlayLayers.getLayers().push(layer);
   
layer.on('change:visible', () => {
    if (layer.getVisible()) {
        updateLegend(layer);
    }
});

    if (title === "Turkey_pm2p5_concentration_map_2020") {
        layer.setVisible(true);
        mainLegendLayer = layer;
    }
});


const fullScreenControl = new ol.control.FullScreen({
  className: 'custom-fullscreen',
  label: '⛶',
  tipLabel: 'Toggle Fullscreen',
  source: 'fullscreen-container'
});


map.addControl(fullScreenControl);


// -------------------- Legend (only one shown initially) --------------------
if (mainLegendLayer) {
    const source = mainLegendLayer.getSource();
    const legendUrl = source.getLegendUrl();
    const title = mainLegendLayer.get('title');

    const container = document.getElementById('legend-content');
    container.innerHTML = '';

    const block = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = title;
    label.style.fontWeight = 'bold';
    label.style.margin = '8px 0 4px';

    const img = document.createElement('img');
    img.src = legendUrl;
    img.alt = title + ' legend';
    img.style.maxWidth = '100%';
    img.style.border = '1px solid #ccc';
    img.style.borderRadius = '6px';
    img.style.marginBottom = '10px';

    block.appendChild(label);
    block.appendChild(img);
    container.appendChild(block);
}

function updateLegend(layer) {
    const source = layer.getSource();
    const legendUrl = source.getLegendUrl(0, { format: 'image/png' }); // 👈 确保使用 format 参数

    const title = layer.get('title');
    const container = document.getElementById('legend-content');
    container.innerHTML = ''; // 清空旧图例

    const block = document.createElement('div');

    const label = document.createElement('div');
    label.textContent = title;
    label.style.fontWeight = 'bold';
    label.style.margin = '8px 0 4px';

    const img = document.createElement('img');
    img.src = legendUrl;
    img.alt = title + ' legend';
    img.style.maxWidth = '100%';
    img.style.border = '1px solid #ccc';
    img.style.borderRadius = '6px';
    img.style.marginBottom = '10px';

    block.appendChild(label);
    block.appendChild(img);
    container.appendChild(block);
}
