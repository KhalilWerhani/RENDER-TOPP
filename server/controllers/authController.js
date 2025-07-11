import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken' ;
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_VERIFY_TEMPLATE } from '../config/emailTemplates.js';


export const register = async (req , res)=> {
    const {name , email , password, phone} = req.body ; 
    if ( !name  ||   !email   ||  !password ||  !phone) {
        return res.json ({
            success : false , message : ' Missing Details ' 
        })
    }

    try {
        const existingUser = await userModel.findOne({email})

        if(existingUser) {
            return res.json ({
                success : false , message : " User already exists "
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10)
        const user = new userModel ({name , email , password:hashedPassword , phone}) ;
        await user.save();

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET , {expiresIn: '7d'});

        res.cookie('token' , token , {
            httpOnly : true ,
            secure: process.env.NODE_ENV === 'production' ,
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none' : 'strict' , 
            maxAge : 7 * 24 * 60 * 1000
        });
        //Sending Resistration mail

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject : 'Effectuer votre service avec TOP-JURIDIQUE'  ,
            text : ` Bonjour ${name} ,
            J’ai tenté de vous joindre suite à la création de votre espace sur TOP-JURIDIQUE afin de savoir si nous sommes en adéquation avec votre besoin.
            Votre compte a été créé avec l'email: ${email} `
          //  html : EMAIL_VERIFY_TEMPLATE.replace("{{email}}" , user.email)


            
        }
        await transporter.sendMail(mailOptions);

        return res.json ({ success : true}) ;


    } catch (error) {
        res.json ({success : false , message :  error.message })

}
}

export const login = async (req , res)=> {
    const { email , password} = req.body ; 

        if (!email || !password) {
            return res.json ({
                success : false , message : 'Email and password are required'
            })
        }

        try {
           const user = await userModel.findOne ({email}) 

           if (!user){
            return res.json ({ success : false , message :  'Invalid  Email' })
           }
           const isMatch = await bcrypt.compare(password , user.password)

           if (!isMatch){
            return res.json ({ success : false , message :  'Invalid Password' })
           }

           const token = jwt.sign({id : user._id, role: user.role}, process.env.JWT_SECRET , {expiresIn: '7d'}); //ajout de  role: user.role

            res.cookie('token' , token , {
            httpOnly : true ,
            secure: process.env.NODE_ENV === 'production' ,
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none' : 'strict' , 
            maxAge : 7 * 24 * 60 * 1000
        });
        user.lastLogin = new Date();
        await user.save();
        return res.json ({ success : true, user:{id: user._id,name: user.name,email: user.email,role: user.role}}) ;

        } catch (error) {
            res.json ({success : false , message :  error.message });
    
    }
    }

export const logout = async (req,res)=> {
        try {
            res.clearCookie('token', {
                httpOnly : true ,
                secure: process.env.NODE_EN === 'production' ,
                sameSite: process.env.NODE_EN === 'production' ? 
                'none' : 'strict' , 
            })

            return res.json ({success: true , message: "Logged out"})

        } catch (error) {
            return res.json ({success : false , message: error.message});
        }

    }

    //Send Verification OTP to the User's Email
    // userId getting him from token that is store in cookie / middleware -> cookie -> token -> userId -> req.body

export const sendVerifyOtp = async (req , res)=>{
        try{
            const {userId} = req.body;
            const user = await userModel.findById(userId);
            if(user.isAccountVerified) {
                return res.json({ success: false , message: "Account Already verified"})
            }

            const otp = String(Math.floor(100000 + Math.random()*900000));

            user.verifyOtp = otp ;
            user.verifyExpireAt = Date.now() + 24 * 60 * 60 *1000 ;

            await user.save();

            const mailOption ={
                from : process.env.SENDER_EMAIL,
                to: user.email,
                subject : 'Account Verification OTP'  ,
                text : ` Your OTP is ${otp}. Verify you account using this OTP. `,
               // html : PASSWORD_VERIFY_TEMPLATE.replace("{{otp}}" , otp)
            }
            await transporter.sendMail(mailOption);

            res.json({ success: true , message : 'Verification OTP Sent on Email'})

        } catch (error){
            res.json({ succes : false , message : error.message}) ;
        }
    }

export const verifyEmail = async (req,res) => {
    const {userId , otp} = req.body;

    if (!userId || !otp ) {
        return res.json({ success: false , message: "Missing Details"});
            }

            try {
                const user = await userModel.findById(userId);
                
                if(!user) {
                    return res.json({succes:false , message : 'User not found'});
                }

                if(user.verifyOtp === '' || user.verifyOtp !== otp) {
                    return res.json({succes:false , message : 'Invalid OTP'});
                }

                if( user.verifyExpireAt< Date.now()){
                    return res.json({succes:false , message : 'OTP Expired'});
                }

                user.isAccountVerified= true ;
                user.verifyOtp='';
                user.verifyExpireAt=0;

                await user.save();
                return res.json({succes:true , message : 'Email verified successfully'});

            } catch (error) {
                res.json ({success : false , message :  error.message })
            }

    }

// checking if user authenticated
export const isAuthenticated = async (req,res)=> {
    try{
        return res.json ({succes:true});
    }catch(error) {
        res.json ({succes:false , message: error.message});
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req,res) => {
    const {email} = req.body;

    if(!email){
        return res.json ({succes:false , message : 'Email is required'})
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({succes : false , message: 'User not found'})
        }

        const otp = String(Math.floor(100000 + Math.random()*900000));

            user.resetOtp = otp ;
            user.resetOtpExpireAt = Date.now() + 20 * 60 *1000 ;

            await user.save();

            const mailOption ={
                from : process.env.SENDER_EMAIL,
                to: user.email,
                subject : 'Password Reset OTP'  ,
                text : ` Your OTP for resetting your password is ${otp} Use this OTP to proceed with resetting your password . ` ,
              //  html : PASSWORD_VERIFY_TEMPLATE.replace("{{otp}}" , otp).replace("{{email}}" , user.email)
            }
            await transporter.sendMail(mailOption);

            res.json({ success: true , message : ' OTP Sent to your Email'})

    }catch(error) {
        res.json ({succes:false , message: error.message});
    }
}

//Reset Pass

export const resetPassword = async (req , res) =>{
    const {email, otp ,newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json ({ success: false , message : 'Email , OTP , new password are required' });
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success : false , message: 'User not found'})
        }
        if(user.resetOtp === ""  || user.resetOtp !== otp) {
            return res.json({success : false , message: 'Invalid OTP'})
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json ({ success: false , message : ' OTP Expired ' });

        }
        const hashedPassword = await bcrypt.hash(newPassword , 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt=0 ;

        await user.save();

        return res.json({ success: true , message : ' Password has been reset successfully'})

    }catch(error){
        return res.json ({ success: false , message : error.message });

    }

}






