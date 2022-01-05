import gulp from 'gulp';
import del from 'del';
import GulpConfig from './gulp.config';
import debounce from 'gulp-debounce';
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import rename from 'gulp-rename';
import chalk from 'chalk';
import BrowserSync from 'browser-sync';

const browserSync = BrowserSync.create();
const gulpConfig = GulpConfig();
const isProduction = env === "production"

/**
 * @task clean
 * Cleans the build and temp directories
 */
gulp.task("clean", () => {
    return del([gulpConfig.tmp, gulpConfig.build], { dot: true })
})

/**
 * @task styles
 * Compiles all css
 */
gulp.task("styles", gulp.series("styles:production", "styles:development"))

/**
 * @task styles:production
 * Compiles the production-ready CSS to project folder
 * and streams it if its a production server environment
 */
gulp.task("styles:production",()=>{
    const task = gulp
                    .src(gulpConfig.styles.src)
                    .pipe(debounce({wait: 1000}))
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(
                        postcss({ env: "production" }).on("error", (err)=>{
                            log(err, err.toString(), "PostCSS")
                        })
                    )
                    .pipe(sourcemaps.write("."))
                    .pipe(
                        rename((path)=>{
                            path.dirname = "/"
                            if(path.extname.indexOf(".map") < 0) path.extname = ".min.css"
                            return path
                        })
                    )
                    .pipe(gulp.dest(gulpConfig.styles.dest))
    if(isProduction){
        task.pipe(browserSync.stream())
    }
    return task
})


/**
 * Logs errors and messages to the
 * console
 *
 * @param {Error} err
 * @param {String} log
 * @param {String} name
 */
function log(err, log, name) {
  const messages = log.replace(/^,|,$/g, "").split("\n") // Get rid leading/trailing commas
  const spacer = " ".repeat(name.length + 2) // Indent additional lines

  if (err) {
    console.log("\u0007")
    browserSync.notify(err.message)
  }

  messages.forEach((message, i) => {
    if (i === 0) {
      console.log(chalk`[{blue ${name}}]`, message)
    } else {
      console.log(spacer, message)
    }
  })
}