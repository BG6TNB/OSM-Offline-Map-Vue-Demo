# OSM Offline Map Vue Demo

本项目是一个在前端使用 OSM 离线地图的演示项目，仅用作学习，请勿在生产环境中使用 OSM 地图，除非你了解其中的法律问题。

本人不承担任何法律责任和可能出现的任何问题，一切后果由使用者自行承担。

## 技术栈

- Vue 3
- Vite
- [pmtiles CLI](https://docs.protomaps.com/pmtiles/cli) 一个简洁的命令行工具，用于提取 PMTiles 文件
- [PMTiles](https://docs.protomaps.com/pmtiles/) - OSM 离线地图，开源的单文件地图格式，使用 HTTP 206 请求
- [Basemaps Assets](https://github.com/protomaps/basemaps-assets) - 渲染 PMTiles 底图需要用到的字体和精灵图
- [Protomaps Basemaps](https://github.com/protomaps/basemaps) - PMTiles 底图 style 生成器
- [MapLibre GL JS](https://maplibre.org/) - 地图渲染库，支持自定义样式和交互功能

## 准备离线地图

首先安装 `pmtiles CLI`，然后使用它提取 PMTiles 文件，放入 `/public` 目录下。

``` bash
pmtiles extract https://build.protomaps.com/20250219.pmtiles planet_z6.pmtiles --maxzoom=6
```

你可能注意到了 `20250219.pmtiles` 这是个日期，代表着撰写本文时最新的地图数据，所以这条命令可能会过期，可以查看这里获取最新的 PMTiles 文件：[maps.protomaps.com/builds](https://maps.protomaps.com/builds/)

提取时可以使用 [BoundingBox](https://boundingbox.klokantech.com/) 工具获取边界，然后指定提取范围：

``` bash
pmtiles extract https://build.protomaps.com/20250219.pmtiles my_area.pmtiles --bbox=4.742883,51.830755,5.552837,52.256198
```

如果你需要混合不同区域的精度，可以先使用 `--maxzoom` 6-8 来获取全球数据，然后使用 `--bbox` 来指定精细化提取的区域，之后使用 [Tippecanoe](https://github.com/felt/tippecanoe) 工具内置的 [tile-join](https://github.com/felt/tippecanoe?tab=readme-ov-file#tile-join) 工具来合并文件，例如：

``` bash
tile-join -o merged.pmtiles a.pmtiles b.pmtiles c.pmtiles
```

## 准备 MapLibre 样式

首先从 [basemaps-assets](https://github.com/protomaps/basemaps-assets) 下载资源，然后将 `fonts` 和 `sprites` 拷贝到 `/public` 目录下即可。

参考链接：[Basemaps for MapLibre](https://docs.protomaps.com/basemaps/maplibre)

## 代码准备

依赖安装

``` bash
npm install @protomaps/basemaps
npm install maplibre-gl
npm install pmtiles
```

`main.js` 中添加 `maplibre-gl` 库的样式以及添加对 `PMTiles` 协议的支持。

``` js
import './assets/main.css'
import 'maplibre-gl/dist/maplibre-gl.css'

import { createApp } from 'vue'
import App from './App.vue'
import maplibregl from 'maplibre-gl'
import { Protocol } from "pmtiles"

const protocol = new Protocol()
maplibregl.addProtocol("pmtiles", protocol.tile)

createApp(App).mount('#app')
```

然后就可以参考在 `App.vue` 中的代码配置地图了。

``` vue
<template>
    <div id="map"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import maplibregl, { FullscreenControl, GlobeControl, TerrainControl, GeolocateControl, NavigationControl, ScaleControl } from 'maplibre-gl'
import { layers, namedFlavor } from '@protomaps/basemaps'

onMounted(() => {
    const map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            glyphs: location.origin + '/fonts/{fontstack}/{range}.pbf',
            sprite: location.origin + '/sprites/v4/light',
            sources: {
                protomaps: {
                    type: 'vector',
                    url: `pmtiles://${location.origin}/planet_z6.pmtiles`,
                    attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
                }
            },
            layers: layers('protomaps', namedFlavor('light'), { lang: 'en' })
        }
    })

    // 全屏按钮
    map.addControl(new FullscreenControl())
    // 球形视图按钮
    map.addControl(new GlobeControl())
    // 地形切换控件（ 需要 sources 支持 ）
    map.addControl(new TerrainControl())
    // 地理定位控件
    map.addControl(new GeolocateControl())
    // 导航控件
    map.addControl(new NavigationControl())
    // 比例尺
    map.addControl(new ScaleControl())
})
</script>

<style scoped>
#map {
    width: 100vw;
    position: fixed;
    top: 0;
    bottom: 0;
}
</style>
```
