import minimist from 'minimist'
import esbuild from 'esbuild'
import { rimraf } from 'rimraf'
import fs from 'node:fs'
import { exit } from 'node:process'

let argv = minimist(process.argv.slice(2))

await rimraf('dist')

/** @type esbuild.BuildOptions */
const devConfig = {
  sourcemap: 'linked',
}

/** @type esbuild.BuildOptions */
const prodConfig = {
  minify: true,
}

/** @type esbuild.BuildContext<BuildOptions> */
esbuild
  .context({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    format: 'esm',
    define: {
      VERSION: JSON.stringify(process.env.npm_package_version),
      DEVELOP: JSON.stringify(!!argv.dev),
    },

    metafile: argv.meta,
    ...(argv.dev ? devConfig : prodConfig),
  })
  .then((ctx) => {
    if (argv.watch) {
      ctx.watch()
    } else {
      ctx.rebuild().then((res) => {
        if (argv.meta)
          fs.writeFileSync('dist/meta.json', JSON.stringify(res.metafile))
        exit(0)
      })
    }
  })
