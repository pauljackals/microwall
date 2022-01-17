const isDevelopment = process.env.NODE_ENV!=="production"
if(isDevelopment) {
    const dotenv = await import("dotenv")
    dotenv.config({path: "../.env"})
}
