import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'main.ts',
  output: {
    file: 'main.js',
    format: 'cjs',
    exports: 'default'
  },
  external: ['obsidian'], // Important: don't bundle Obsidian
  plugins: [typescript()]
};
