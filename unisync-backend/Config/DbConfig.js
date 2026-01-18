import mongoose from "mongoose";

async function Database(dburl) {
    try {
        await mongoose.connect(dburl);
        console.log(`DB connected Successfully!`);
    } catch (error) {
        console.log(`DB not connected ${error.message}`);
    }
}
export default Database;