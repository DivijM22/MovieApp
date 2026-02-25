const {User,RefreshToken}=require('./models');
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function hash(string)
{
    return crypto.createHash('sha256').update(string).digest('hex');
}

const cookieOptions={
    httpOnly : true,
    secure: false,
    sameSite: 'lax',
    maxAge : 7*24*3600*1000
};

async function registerUser(req,res)
{
    if(!req.body.payload)
        return res.status(400).json({
            success : false,
            message : 'No credentials provided'
        });
    const {username,email,password,role}=req.body.payload;
    if(!username || !email || !password)
        return res.status(400).json({
            success : false,
            message : 'Incomplete credentials!'
        })
    try 
    {
        const check=await User.findOne({$or : [{username},{email}]});
        if(check)
            return res.status(409).json({
                success : false,
                message : 'User already registered'
            });
        
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            username,email,password: hashedPassword,role: role || 'user'
        });
        await newUser.save();
        return res.status(201).json({
            success : true,
            message : 'Successfully registered user'
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'Some error occurred. Please try again.'
        });
    }
}

async function loginUser(req,res)
{
    if(!req.body.payload)
        return res.status(400).json({
            success : false,
            message : 'No credentials provided'
        });
    try 
    {
        const {email,password}=req.body.payload;
        if(!email || !password)
            return res.status(400).json({
                success : false,
                message : 'Incomplete credentials!'
            });
        const user=await User.findOne({email});
        if(!user)
            return res.status(401).json({
                success : false,
                message : "Invalid email or password"
            });
        const passwordMatched=await bcrypt.compare(password,user.password);
        if(!passwordMatched)
            return res.status(401).json({
                success : false,
                message : 'Invalid email or password'
            });
        
        const existingSessions=await RefreshToken.find({userId : user._id, revoked : false}).sort({createdAt : 1});
        if(existingSessions.length>=3)
            await RefreshToken.deleteOne({_id : existingSessions[0]._id});
            
        const payload={
            id : user._id,
            username : user.username,
            role : user.role
        };

        const expiresIn=300;
        const accessToken=jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn});
        const refreshToken=jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn : 7*24*3600});
        const hashedRefreshToken=hash(refreshToken);

        const expiresAt=new Date(Date.now()+7*24*3600*1000);
        const absoluteExpiresAt=new Date(Date.now()+30*24*3600*1000);

        const newRefreshToken=new RefreshToken({
            userId : payload.id,
            tokenHash : hashedRefreshToken,
            expiresAt,
            absoluteExpiresAt
        });

        await newRefreshToken.save();

        res.cookie('refreshToken',refreshToken,cookieOptions);

        return res.status(200).json({
            success : true,
            message : 'Successfully created session',
            accessToken,
            expiresIn
        });

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'Some error occurred. Please try aagin.'
        });
    }
}

async function refreshToken(req,res)
{
    try 
    {
        const {refreshToken}=req.cookies;
        if(!refreshToken)
            return res.status(401).json({
                success : false,
                message : 'Refresh token missing. Please log in.'
            });
        jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
        const hashedToken=hash(refreshToken);
        const refresh_token=await RefreshToken.findOne({tokenHash : hashedToken});
        if(!refresh_token)
        {
            res.clearCookie('refreshToken',{
                httpOnly : true,
                secure : true,
                sameSite : 'strict'
            });
            return res.status(401).json({
                success : false,
                message : 'Invalid or expired session'
            });
        }
        if(refresh_token.revoked)
        {
            await RefreshToken.updateMany({userId : refresh_token.userId},{$set : {revoked : true}});
            return res.status(403).json({
                success : false,
                message : 'Token reuse detected! Revoking all user sessions'
            });
        }
        const user=await User.findOne({_id : refresh_token.userId});
        if(!user)
        {
            await RefreshToken.deleteMany({userId : refresh_token.userId});
            return res.status(401).json({
                success : false,
                message : 'User no longer exists. Please register again.'
            });
        }
        
        if(refresh_token.absoluteExpiresAt<Date.now())
        {
            await RefreshToken.deleteOne({_id : refresh_token._id});
            res.clearCookie('refreshToken',cookieOptions);
            return res.status(401).json({
                success : false,
                message : 'User session expired. Please log in again.'
            });
        }

        const payload={
            id : user._id,
            username : user.username,
            role : user.role
        };

        const expiresIn=300;
        const newAccessToken=jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn});
        const new_refresh_token=jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn : 7*24*3600});
        const hashedRefreshToken=hash(new_refresh_token);
        const expiresAt=new Date(Date.now()+7*24*3600*1000);
        const {absoluteExpiresAt}=refresh_token;
        refresh_token.revoked=true;
        const newRefreshToken=new RefreshToken({
            userId : payload.id,
            tokenHash : hashedRefreshToken,
            expiresAt,
            absoluteExpiresAt
        });

        await refresh_token.save();
        await newRefreshToken.save();

        res.cookie('refreshToken',new_refresh_token,cookieOptions);

        return res.status(200).json({
            success : true,
            message : 'Successfully refresh access token',
            accessToken : newAccessToken,
            expiresIn
        });

    }catch(e){
        return res.status(401).json({
            success : false,
            message : "Expired or invalid token"
        });
    }
}

async function logoutUser(req,res)
{
    try{
        const {refreshToken}=req.cookies;
        if(refreshToken)
        {
            const tokenHash=hash(refreshToken);
            await RefreshToken.deleteOne({tokenHash});
        }
        res.clearCookie('refreshToken',cookieOptions);

        return res.status(200).json({
            success : true,
            message : 'User successfully logged out'
        });

    }catch(err){
        return res.status(500).json({
            success : false,
            message : 'Some error ocurred. Please try again'
        });
    }
}

module.exports={registerUser,loginUser,refreshToken,logoutUser};