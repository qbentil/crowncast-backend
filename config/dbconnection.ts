import mongoose from 'mongoose'

// Fix deprecation warning
mongoose.set("strictQuery", false);

const MONGO_URI = () => {
    if (process.env.NODE_ENV === 'development') {
        return process.env.DEV_MONGODB_URI
    } else if (process.env.NODE_ENV === 'production') {
        return process.env.PROD_MONGODB_URI
    } else if (process.env.NODE_ENV === 'test') {
        return process.env.TEST_MONGODB_URI
    } else {
        return process.env.DEV_MONGODB_URI
    }
}
const DBCONNECT = async () => {
    const URI = MONGO_URI() as string
    try {
        mongoose.connect(
            URI,
            {
                autoIndex: true,
            })
        console.log('DB CONNECTED')
    } catch (error) {
        console.log(error)
        throw new Error('Error connecting to database')
    }
}

export default DBCONNECT