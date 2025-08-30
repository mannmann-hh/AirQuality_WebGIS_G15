// -------------------- Base Map --------------------
let overlayLayers = new ol.layer.Group({
  title: "Overlay Layers",
  layers: []  // 后面你会往这里加 PM10, PM2.5, NO2 等 WMS 图层
});
 
let osm = new ol.layer.Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
});

  
  let esriImagery = new ol.layer.Tile({
    title: "ESRI Satellite Imagery",
    type: "base",
    visible: false,
    source: new ol.source.XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attributions: 'Tiles © Esri'
    })
  });
  
  let esriTopo = new ol.layer.Tile({
    title: "ESRI World Topo",
    type: "base",
    visible: false,
    source: new ol.source.XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attributions: 'Tiles © Esri'
    })
  });
  
  let openTopo = new ol.layer.Tile({
    title: "OpenTopoMap",
    type: "base",
    visible: false,
    source: new ol.source.XYZ({
      url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attributions: '© OpenTopoMap contributors'
    })
  });
  
  let cartoLight = new ol.layer.Tile({
    title: "Carto Light",
    type: "base",
    visible: false,
    source: new ol.source.XYZ({
      url: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      attributions: '© Carto'
    })
  });
  
  let cartoDark = new ol.layer.Tile({
    title: "Carto Dark",
    type: "base",
    visible: false,
    source: new ol.source.XYZ({
      url: "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      attributions: '© Carto'
    })
  });
  
 
  
  let basemapLayers = new ol.layer.Group({
    title: "Base Maps",
    layers: [osm, esriImagery, esriTopo, openTopo, cartoLight, cartoDark]
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
    ["NO₂ CAMS 2022–12", "gisgeoserver_15:Turkey_CAMS_no2_2022_12"],
    ["PM2.5 CAMS 2022–12", "gisgeoserver_15:Turkey_CAMS_pm2p5_2022_12"],
    ["LC Reclassified 2022", "gisgeoserver_15:Turkey_LC_reclassified_2022"],
    ["Average NO₂ 2022", "gisgeoserver_15:Turkey_average_NO2_2022"],
    ["Average PM2.5 2022", "gisgeoserver_15:Turkey_average_pm2p5_2022"],
    ["NO₂ 2017–2021 AAD 2022", "gisgeoserver_15:Turkey_no2_2017-2021_AAD_map_2022"],
    ["NO₂ 2020 Bivariate", "gisgeoserver_15:Turkey_no2_2020_bivariate"],
    ["NO₂ Concentration 2020", "gisgeoserver_15:Turkey_no2_concentration_map_2020"],
    ["NO₂ Zonal Statistics (Mean & Max, 2013–2022)", "gisgeoserver_15:Turkey_no2_zonal_statistics_2013-2022"],
    ["PM2.5 2017–2021 AAD 2022", "gisgeoserver_15:Turkey_pm2p5_2017-2021_ADD_map_2022"],
    ["PM2.5 2020 Bivariate", "gisgeoserver_15:Turkey_pm2p5_bivariate"],
    ["PM2.5 Concentration 2020", "gisgeoserver_15:Turkey_pm2p5_concentration_map_2020"],
    ["PM2.5 Zonal Statistics (Mean & Max, 2013–2022)", "gisgeoserver_15:Turkey_pm2p5_zonal_statistics_2013-2022"],
    ["PM10 CAMS 2022–12", "gisgeoserver_15:Turkey_CAMS_pm10_2022_12"],
    ["Average PM10 2022", "gisgeoserver_15:Turkey_average_pm10_2022"],
    ["PM10 2017–2021 AAD 2022", "gisgeoserver_15:Turkey_pm10_2017-2021_AAD_map_2022"],
    ["PM10 2020 Bivariate", "gisgeoserver_15:Turkey_pm10_2020_bivariate"],
    ["PM10 Concentration 2020", "gisgeoserver_15:Turkey_pm10_concentration_map_2022"],
    ["PM10 Zonal Statistics (Mean & Max, 2013–2022)", "gisgeoserver_15:Turkey_pm10_zonal_statistics_2013-2022"],
];


let mainLegendLayer = null;

wmsLayers.forEach(([title, layerName]) => {
    const layer = createWMSLayer(title, layerName);
    overlayLayers.getLayers().push(layer);
   
    layer.on('change:visible', () => {
        if (layer.getVisible()) {
            updateLegend(layer);
        } else {
            clearLegend();
        }
    });
    
});


const fullScreenControl = new ol.control.FullScreen({
  className: 'custom-fullscreen',
  label: '⛶',
  tipLabel: 'Toggle Fullscreen',
  source: 'fullscreen-container'
});


map.addControl(fullScreenControl);

// -------------------- Custom Legends --------------------
const customLegends = {
    "PM10 Zonal Statistics (Mean & Max, 2013–2022)": [
      { color: "#66c2a4", label: "Average & Maximum PM10 concentration (2013–2022)" }
    ],
  
    "PM2.5 Zonal Statistics (Mean & Max, 2013–2022)": [
      { color: "#66c2a4", label: "Average & Maximum PM2.5 concentration (2013–2022)" }
    ],
  
    "NO₂ Zonal Statistics (Mean & Max, 2013–2022)": [
      { color: "#66c2a4", label: "Average & Maximum NO₂ concentration (2013–2022)" }
    ],

    
        "PM10 Concentration 2020": [
          { color: "#984ea3", label: "≤ -10 µg/m³" },      // 紫
          { color: "#4daf4a", label: "-10 – -4 µg/m³" },   // 绿
          { color: "#e41a1c", label: "-4 – 0 µg/m³" },     // 红
          { color: "#377eb8", label: "0 – 4 µg/m³" },      // 蓝
          { color: "#ffff99", label: "4 – 10 µg/m³" },     // 浅黄
          { color: "#a65628", label: "> 10 µg/m³" }        // 棕色（补充 >10 ）
        ],

      "PM2.5 Concentration 2020": [
  { color: "#f7fcf5", label: "5 < PM2.5 ≤ 10 µg/m³" },   // 白色
  { color: "#bae4b3", label: "10 < PM2.5 ≤ 20 µg/m³" },  // 浅绿色
  { color: "#238b45", label: "20 < PM2.5 ≤ 25 µg/m³" },  // 绿色
  { color: "#00441b", label: "PM2.5 > 25 µg/m³" }        // 深绿色
],

"NO₂ Concentration 2020": [
  { color: "#fee5d9", label: "NO₂ ≤ 10 µg/m³" },       // 浅粉
  { color: "#a1d99b", label: "10 < NO₂ ≤ 25 µg/m³" },  // 浅绿
  { color: "#00441b", label: "25 < NO₂ ≤ 40 µg/m³" }   // 深绿
],

"PM10 2020 Bivariate": [
  { image: "assets/images/legend_bivariate_5x5.png", label: "Population vs PM10 Concentration" }
],

"PM2.5 2020 Bivariate": [
  { image: "assets/images/legend_bivariate_5x5.png", label: "Population vs PM2.5 Concentration" }
],

"NO₂ 2020 Bivariate": [
  { image: "assets/images/legend_bivariate_5x5.png", label: "Population vs NO₂ Concentration" }
],
"PM10 2017–2021 AAD 2022": [
  { title: "2022 Annual Average Difference from the 2017–2021 mean" },
  { color: "#2166ac", label: "≤ -10 µg/m³" },
  { color: "#67a9cf", label: "-10 < value ≤ -4 µg/m³" },
  { color: "#d9ef8b", label: "-4 < value ≤ 0 µg/m³" },
  { color: "#fee08b", label: "0 < value ≤ 4 µg/m³" },
  { color: "#fdae61", label: "4 < value ≤ 10 µg/m³" },
  { color: "#d7191c", label: "> 10 µg/m³" }
],
"PM2.5 2017–2021 AAD 2022": [
  { title: "2022 Annual Average Difference from the 2017–2021 mean" },
  { color: "#2166ac", label: "≤ -3 µg/m³" },
  { color: "#67a9cf", label: "-3 < value ≤ -1.5 µg/m³" },
  { color: "#d9ef8b", label: "-1.5 < value ≤ 0 µg/m³" },
  { color: "#fee08b", label: "0 < value ≤ 1.5 µg/m³" },
  { color: "#fdae61", label: "1.5 < value ≤ 3 µg/m³" },
  { color: "#d7191c", label: "> 3 µg/m³" }
],
"NO₂ 2017–2021 AAD 2022": [
  { title: "2022 Annual Average Difference from the 2017–2021 mean" },
  { color: "#2166ac", label: "≤ -5 µg/m³" },
  { color: "#67a9cf", label: "-5 < value ≤ -2 µg/m³" },
  { color: "#d9ef8b", label: "-2 < value ≤ 0 µg/m³" },
  { color: "#fee08b", label: "0 < value ≤ 2 µg/m³" },
  { color: "#fdae61", label: "2 < value ≤ 5 µg/m³" },
  { color: "#d7191c", label: "> 5 µg/m³" }
],

"Average PM10 2022": [
  { title: "Average pollutant maps for 2022" },
  { color: "#542788", label: "11 – 43 µg/m³" },   // 深紫
  { color: "#2b83ba", label: "43 – 75 µg/m³" },   // 蓝色
  { color: "#abdda4", label: "75 – 107 µg/m³" },  // 绿色
  { color: "#fdae61", label: "107 – 139 µg/m³" }, // 橙色
  { color: "#d7191c", label: "> 139 µg/m³" }      // 红色
],

"Average PM2.5 2022": [
  { title: "Average pollutant maps for 2022" },
  { color: "#542788", label: "11 – 23µg/m³" },   // 深紫
  { color: "#2b83ba", label: "23 – 45 µg/m³" },   // 蓝色
  { color: "#abdda4", label: "45 – 67 µg/m³" },  // 绿色
  { color: "#fdae61", label: "67 – 80 µg/m³" }, // 橙色
  { color: "#d7191c", label: "> 90 µg/m³" }      // 红色
],


"Average NO₂ 2022": [
  { title: "Average pollutant maps for each year, with a focus on 2022" },
  { color: "#08306b", label: "0 – 5 µg/m³" },     // 深蓝
  { color: "#2171b5", label: "5 – 10 µg/m³" },   // 蓝色
  { color: "#6baed6", label: "10 – 15 µg/m³" },  // 浅蓝
  { color: "#bdbdbd", label: "15 – 20 µg/m³" },  // 灰色
  { color: "#fdae61", label: "20 – 25 µg/m³" },  // 橙黄
  { color: "#ffff33", label: "25 – 35 µg/m³" }   // 黄色
],

"PM10 CAMS 2022–12": [
  { title: "CAMS Modeled PM10 Concentration (Dec 2022)" },
  { color: "#d73027", label: "10 – 27 µg/m³" },   // 红
  { color: "#fc8d59", label: "27 – 43 µg/m³" },   // 橙
  { color: "#fee08b", label: "43 – 60 µg/m³" },   // 黄
  { color: "#d9ef8b", label: "60 – 77 µg/m³" },   // 黄绿
  { color: "#91cf60", label: "77 – 94 µg/m³" },   // 绿
  { color: "#1a9850", label: "94 – 110 µg/m³" },  // 深绿
  { color: "#4575b4", label: "110 – 139 µg/m³" }  // 蓝
],

"PM2.5 CAMS 2022–12": [
  { title: "CAMS Modeled PM2.5 Concentration (Dec 2022)" },
  { color: "#d73027", label: "6 – 29 µg/m³" },    // 红
  { color: "#fc8d59", label: "29 – 52 µg/m³" },   // 橙
  { color: "#fee08b", label: "52 – 74 µg/m³" },   // 黄
  { color: "#91cf60", label: "74 – 97 µg/m³" },   // 绿
  { color: "#4575b4", label: "> 97 µg/m³" }       // 蓝
],
"NO₂ CAMS 2022–12": [
  { title: "CAMS Modeled NO₂ Concentration (Dec 2022)" },
  { color: "#d73027", label: "0 – 13 µg/m³" },    // 红
  { color: "#fc8d59", label: "13 – 25 µg/m³" },   // 橙
  { color: "#fee08b", label: "25 – 37 µg/m³" },   // 黄
  { color: "#91cf60", label: "37 – 50 µg/m³" },   // 绿
  { color: "#4575b4", label: "> 50 µg/m³" }       // 蓝
],

"LC Reclassified 2022": [
  { title: "Land Cover Reclassified 2022 (IPCC Categories)" },
  { color: "#1ac9d6", label: "1. Agriculture" },   // 青色
  { color: "#d73027", label: "2. Forest" }, // 红色
  { color: "#4575b4", label: "3. Grassland " }, // 蓝色
  { color: "#984ea3", label: "4. Wetland" },          // 紫色
  { color: "#4daf4a", label: "5. Settlement" },       // 绿色
  { color: "#ffff99", label: "6. Other" } // 黄色
]






      
  };
  
  

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
    const title = layer.get('title');
    const container = document.getElementById('legend-content');
    container.innerHTML = ''; // 清空旧图例

    const label = document.createElement('div');
    label.textContent = title;
    label.style.fontWeight = 'bold';
    label.style.margin = '8px 0 4px';
    container.appendChild(label);

    if (customLegends[title]) {
        customLegends[title].forEach(item => {
            // 如果是图片型 legend
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.label || title + " legend";
                img.style.maxWidth = '100%';
                img.style.border = '1px solid #ccc';
                img.style.borderRadius = '6px';
                img.style.marginBottom = '10px';
                container.appendChild(img);

                if (item.label) {
                    const caption = document.createElement('div');
                    caption.textContent = item.label;
                    caption.style.fontSize = '0.85rem';
                    caption.style.marginTop = '4px';
                    container.appendChild(caption);
                }
            } else {
                // 普通颜色方块型 legend
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.marginBottom = '4px';

                const colorBox = document.createElement('div');
                colorBox.style.width = '20px';
                colorBox.style.height = '20px';
                colorBox.style.background = item.color;
                colorBox.style.border = '1px solid #ccc';
                colorBox.style.marginRight = '8px';

                const text = document.createElement('span');
                text.textContent = item.label;

                row.appendChild(colorBox);
                row.appendChild(text);
                container.appendChild(row);
            }
        });
    } else {
        const noLegend = document.createElement('div');
        noLegend.textContent = "No legend available";
        noLegend.style.fontStyle = 'italic';
        container.appendChild(noLegend);
    }
}




function clearLegend() {
    const container = document.getElementById('legend-content');
    container.innerHTML = ''; // 移除所有图例
}
