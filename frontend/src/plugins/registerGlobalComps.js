import Vue from 'vue'
import _Ctemplate from '@/components/template'
import { withInstall } from '@/js/with-install.js'

_Ctemplate.name = "Ctemplate"
const Ctemplate = withInstall(_Ctemplate)

const compPlugins = [Ctemplate]

compPlugins.forEach(plugin => Vue.use(plugin))

