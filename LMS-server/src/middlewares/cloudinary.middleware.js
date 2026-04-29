let cloudinary = require('cloudinary').v2


const cloudinaryImageUpload = async (req, res, next) => {

    if (!req.file) {
        return next()
    }



    try {

        // Configuration
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET   // Click 'View API Keys' above to copy your API secret
        });


        console.log(req.file);


        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                req.file.path,
                {
                    resource_type: 'auto', // Auto detects the file type (image, video, etc.)
                    public_id: `${req.headers['x-organization-id']}/${'testing'}/${req.file.filename.split('.')[0]}`,     // You can customize this
                }
            )

        console.log(uploadResult)

        req.profilePicture = uploadResult.url

        console.log(req.profilePicture);

        // // Optimize delivery by resizing and applying auto-format and auto-quality
        // const optimizeUrl = cloudinary.url('shoes', {
        //     fetch_format: 'auto',
        //     quality: 'auto'
        // });



        // // Transform the image: auto-crop to square aspect_ratio
        // const autoCropUrl = cloudinary.url('shoes', {
        //     crop: 'auto',
        //     gravity: 'auto',
        //     width: 500,
        //     height: 500,
        // });




        next()
    } catch (error) {

        console.log(error);


    }
}

module.exports = cloudinaryImageUpload;