export default function(env){
    const src = "src/"
    const dest = "hugo/"
    const tmp = ".tmp/"
    const build = "dist"
    const isProduction = process.env.NODE_ENV === 'production'
    return {
        src,
        dest,
        tmp,
        build,
    }
}