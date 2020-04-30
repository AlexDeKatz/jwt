const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const config = {
    'secret': 'my-secret-key'
};

let errorMethod1 = () => {
    let err = new Error("You dont have permission to access this page")
    err.status = 403
    throw err
}

let authendicate = {}

authendicate.validate = (req, res, next) => {
    if (req.connection.userGroups.length) {
        let userName = req.connection.user.split("\\")[1]
        let hasheduserName = bcrypt.hashSync(userName, 8);
        var token = jwt.sign({ id: hasheduserName }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        if (req.connection.userGroups.indexOf("ITLINFOSYS\\ETA_Educators") != -1) {
            // using temp user name
            res.send({ access: ["Trainee"], isAuthenticated: true, userName: userName, auth: true, token: token })
        } else if (req.connection.userGroups.indexOf('ITLINFOSYS\\Infosys-TRPU') != -1 || req.connection.userGroups.indexOf('ITLINFOSYS\\Mysore-TRPU') != -1) {
            res.send({ access: ["Trainee"], isAuthenticated: true, userName: userName, auth: true, token: token })
        } else {
            errorMethod1()
        }
    } else {
        errorMethod1()
    }
}

authendicate.getUserInfo = (req, res, next) => {
    var nodeSSPI = require('node-sspi')
    var nodeSSPIObj = new nodeSSPI({
        retrieveGroups: true,
        authoritative: true,
        perRequestAuth: true
    })
    nodeSSPIObj.authenticate(req, res, function (err) {
        res.finished || next()
    })
}


authendicate.requestValidity = (req, res, next) => {
    let token = req.headers['authorization'] || req.headers['Authorization'];
    if (!token) return res.status(401).send("You don't have permission to access this page");
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(401).send("You don't have permission to access this page");
        next()
    });
}

module.exports = authendicate