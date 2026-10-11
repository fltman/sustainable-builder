import { defineConfig } from 'vite';
import { shared } from './vite.config.js';
import { ROOT } from './city.config.mjs';
// A second dev server for recording: no HMR, no file watching, so edits never reload a running film.
export default defineConfig({...shared,server:{host:'127.0.0.1',port:5231,hmr:false,watch:{ignored:['**/*']},fs:{allow:[ROOT]}}});
