const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
    username : {
        type : String,
        trim : true,
        lowercase : true,
        unique : true,
        required : true,
        minlength : [4,'Username must contain atleast 4 characters'],
        maxlength : [30,'Username must not exceed 30 characters']
    },
    
    email : {
        type : String,
        trim: true,
        lowercase : true,
        unique : true,
        required : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Email must be valid']
    },

    password : {
        type : String,
        required : true
    },

    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    }

},{timestamps : true});

const User=mongoose.model('User',userSchema);

const refreshTokenSchema=new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    tokenHash : {
        type : String,
        required : true,
        unique : true
    },
    revoked : {
        type : Boolean,
        default : false
    },
    expiresAt : {
        type : Date,
        index : {expires : 0},
        required : true
    },
    absoluteExpiresAt : {
        type : Date,
        required : true,
    }
},{timestamps : true});

const RefreshToken=mongoose.model('RefreshToken',refreshTokenSchema);

const watchList=new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    itemId : {
        type : String,
        required : true,
    },
    media_type : {
        type : String,
        enum : ['tv','movie'],
        required : true
    }
},{timestamps : true});

watchList.index({userId : 1,itemId : 1,media_type : 1},{unique : true});

const WatchList=mongoose.model('watchList',watchList);

module.exports={RefreshToken,User,WatchList};

