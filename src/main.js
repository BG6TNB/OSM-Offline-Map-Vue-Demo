import './assets/main.css'
import 'maplibre-gl/dist/maplibre-gl.css'

import { createApp } from 'vue'
import App from './App.vue'
import maplibregl from 'maplibre-gl'
import { Protocol } from "pmtiles"

const protocol = new Protocol()
maplibregl.addProtocol("pmtiles", protocol.tile)

createApp(App).mount('#app')
