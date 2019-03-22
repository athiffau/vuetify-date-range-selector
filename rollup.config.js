import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support

const getBabelOptions = ({ useESModules }) => ({
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
  plugins: [['@babel/transform-runtime', { regenerator: false, useESModules }]],
})

export default {
    input: 'src/wrapper.js', // Path relative to package.json
    plugins: [
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        buble(), // Transpile to ES5
        babel(getBabelOptions({ useESModules: false })),
    ],
};