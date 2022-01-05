import gulp from 'gulp';
import del from 'del';
import GulpConfig from './gulp.config';

const gulpConfig = GulpConfig();

/**
 * @task clean
 * Cleans the build and temp directories
 */
gulp.task("clean", () => {
    return del([gulpConfig.tmp, gulpConfig.build], { dot: true })
})