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