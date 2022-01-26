const User = require('../../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { BadRequestError, UnauthenticatedError } = require('../../errors/index');
const { StatusCodes } = require('http-status-codes');


const register = async (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
        throw new BadRequestError('Please provide email password first name and last name')
    }
    const newUser = new User({
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        phoneNumber: req.body.phoneNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    const user = await newUser.save();

    const accessToken = user.createJWT();

    res.status(StatusCodes.OK).json({ _id: user._id, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, accessToken });

}

const login = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== password) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const accessToken = user.createJWT();

    const { firstName, lastName } = user._doc;

    res.status(200).json({ _id, firstName, lastName, email, accessToken }); //TODO CHANGE TO NAME ALONE
}




const googleRegister = async (req, res) => {
    const { tokenId } = req.body;
    await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID })
        .then(response => {
            const payload = response.getPayload();
            const { given_name, email, family_name } = payload;
            User.findOne({ email }).exec(async (err, user) => {
                if (err) {
                    return res.status(400).json({
                        error: "Something went wrong.."
                    })
                }
                else {
                    //LOGIN ALREADY EXISTING USER
                    if (user) {
                        const accessToken = user.createJWT();
                        res.status(201).json({ ...user, accessToken });

                    }
                    //SIGN UP NEW USER WITH THIS EMAIL
                    else {
                        var password = generator.generate({
                            length: 10,
                            numbers: true,
                        });

                        const newUser = new User({
                            email: email,
                            firstName: given_name,
                            lastName: family_name,
                            emailVerified: true,
                            password: 'abc',
                        });
                        try {
                            await newUser.save((err, data) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: 'Something went wrong...',
                                    })
                                }

                                const accessToken = newUser.createJWT();

                                res.status(201).json({ data, accessToken });

                            });
                        }
                        catch (err) {
                            res.status(500).json(err);
                        }
                    }
                }
            });
        })
};


module.exports = {
    googleRegister,
    register,
    login,
}