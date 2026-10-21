const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')


const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    URLEndpoint: process.env.IMAGEKIT_ENDPOINT_URI,
    timeout: 5 * 60 * 1000
})


async function uploadFile(file, fileName) {
    console.log("Image Kit upload started")
    let result
    try {
        result = await imageKit.files.upload({
            file: await toFile(file, fileName),
            fileName: fileName
        })
    } catch (error) {
        console.error("ImageKit upload failed:", error)
        throw error
    }
    console.log('Image Kit upload completed')
    console.log("Uploaded URL", result.url)

    return result
}

module.exports = {
    uploadFile
}