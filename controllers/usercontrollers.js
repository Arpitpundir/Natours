const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');

//const upload = multer({dest: "public/img/users"});

//dest option is used to specify the folder where files would be saved
//multer would return a object in which dest property would be set to given value

//for having full controll on storing files we can use diskStorage, with the help of disk storage
//two options are available filename and destination, destination decides within which folder file would
//be stored and filename specify what would be the filename with which file would be stored

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/img/users");
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });
//when we are doing image preocessing just after getting the image then it is best to store image in memory
const multerStorage = multer.memoryStorage();

const filterObj = (obj, ...allowedFields) => {
    let newObj = {};
    //it is necessary to set it to an object otherwise it would be set to undefined
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

//below function would be used to check whether file should be uploaded or not
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        //cb is a callback function provided by multer of which first argument is error if present other
        //wise it is null
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    console.log(req.file.filename);

    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    console.log(req.file.filename);
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({
            quality: 90
        })
        .toFile(`public/img/users/${req.file.filename}`);

    next()
});
exports.getAllUsers = (req, res, user) => {
    res.status(500).json({
        status: 'failed',
        message: 'bad request'
    });
};
exports.getUser = (req, res, user) => {
    res.status(500).json({
        status: 'failed',
        message: 'bad request'
    });
};
exports.updateMe = catchAsync(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    //if user tries to update password or confirmPassword
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This is not route for updating password. Please use updatePassword route'
            ),
            401
        );
    }
    //Now we will filter the body and only keep the data we want to update in this function

    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) {
        filteredBody.photo = req.file.filename;
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        runValidators: true,
        new: true //will return the modified document
    });
    // console.log(filteredBody);
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});
exports.deleteMe = catchAsync(async (req, res, user) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    });
    res.status(204).json({
        status: 'success',
        data: null
    });
});
exports.addUser = (req, res, user) => {
    res.status(500).json({
        status: 'failed',
        message: 'bad request'
    });
};

exports.deleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
};