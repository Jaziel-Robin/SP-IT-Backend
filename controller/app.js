//-------------------------------------------
// imports
//-------------------------------------------

const express = require('express');
const app = express();
const user = require('../model/user.js');
const category = require('../model/category.js');
const product = require('../model/product.js');
const review = require('../model/review.js');
const interest = require('../model/interest.js');
const discount = require('../model/discount.js');
const bodyParser = require("body-parser");
var verifyToken = require('../auth/verifyToken.js');
var cors = require('cors');

//-------------------------------------------
// config
//-------------------------------------------
app.options('*', cors());
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const multer = require('multer');
const path = require('path');
const { parse } = require('path/posix');

const storage = multer.diskStorage({
    // destination: './image',
    destination: './public/image',
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1_000_000 } // Below 1 MB (1,000,000 Bytes = 1 MB)
})

//-------------------------------------------
// MF
//-------------------------------------------

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}

//-------------------------------------------
// MF configurations
//-------------------------------------------

app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(errHandler);
app.use('/image', express.static('/image'));
app.use(cors());

//-------------------------------------------
// endpoints
//-------------------------------------------

// Endpoint #1: POST/users/ (Used to add a new user to the database.)
app.post("/users/", function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var contact = req.body.contact;
    var password = req.body.password;
    // var type = req.body.type;
    // var profile_pic_url = req.body.profile_pic_url;

    user.addUser(username, email, contact, password, /*type, profile_pic_url,*/ function (err, result) {
        if (!err) {
            // console.log(result);
            res.status(201).type("json").send({ "userid": result });
        } else if (err.code == 'ER_DUP_ENTRY') {
            res.status(422).send("The new username OR new email provided already exists.");
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Endpoint #2: GET/users/ (Used to get array of all the users in database.)
app.get('/users/', function (req, res) {

    user.getUsers(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Unknown error");
        }
    });

});

// Endpoint #3: GET/users/:id/ (Used to get subset of data of the matching single user)
app.get('/users/:uid', function (req, res) {
    var uid = parseInt(req.params.uid);

    user.getUser(uid, function (err, result) {
        if (!err) {
            if (result[0] == null) {
                res.status(404).send("User not found!");
            } else {
                res.status(200).send(result[0]);
            }
        } else {
            res.status(500).send("Unknown error");
        }
    });

});

// Endpoint #4: PUT/users/:id/ (Used to update a single user. ID and created timestamp should not be updatable.)
app.put("/users/:uid", function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var contact = parseInt(req.body.contact);
    var password = req.body.password;
    var type = req.body.type;
    var profile_pic_url = req.body.profile_pic_url;
    var uid = parseInt(req.params.uid);

    user.updateUser(username, email, contact, password, type, profile_pic_url, uid, function (err, result) {
        if (!err) {
            res.status(204).end();
        } else if (err.code == "ER_DUP_ENTRY") {
            res.status(422).send("The new username OR new email provided already exists.");
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Endpoint #5: POST/category (Used to insert a new category. Category ID should be auto generated.)
app.post("/category", function (req, res) {
    var cat = req.body.category;
    var description = req.body.description;

    category.addCategory(cat, description, function (err, result) {
        if (!err) {
            res.status(204).end();
        } else if (err.code == 'ER_DUP_ENTRY') {
            res.status(422).send("The category name provided already exists.");
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Endpoint #6: GET/category (Used to get all category.)
app.get('/category', function (req, res) {

    category.getCategories(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Unknown error");
        }
    });

});

// Endpoint #7: POST/product/ (Used to add a new product to the database.)
app.post("/product", function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var categoryid = parseInt(req.body.categoryid);
    var brand = req.body.brand;
    var price = req.body.price;

    product.addProduct(name, description, categoryid, brand, price, function (err, result) {
        if (!err) {
            res.status(201).type("json").send({ "productid": result.insertId });
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Endpoint #8: GET/product/:id (Used to get product info with matching product id.)
app.get('/product/:pid', function (req, res) {
    var pid = parseInt(req.params.pid);

    product.getProduct(pid, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Unknown error");
        }
    });

});

// Endpoint #9: DELETE/product/:id (Used to delete a product given its id. The associated reviews related to the product would also be deleted. Idempotent.)
app.delete("/product/:pid/", function (req, res) {
    var pid = parseInt(req.params.pid);

    product.deleteProduct(pid, function (err, result) {
        if (!err) {
            // console.log(result);
            res.status(204).end();
        }
        else {
            console.log(err);
            res.send(500).send("Unknown error");
        }
    })
});

// Endpoint #10: POST/product/:id/review/ (Used to add a review for a product listing. A product can have many reviews.)
app.post("/product/:pid/review/", function (req, res) {
    var pid = parseInt(req.params.pid);
    var userid = parseInt(req.body.userid);
    var rating = parseInt(req.body.rating);
    var productReview = req.body.review;

    review.addReview(userid, pid, rating, productReview, function (err, result) {
        if (!err) {
            res.status(201).type("json").send({ "reviewid": result.insertId });
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Endpoint #11: GET/product/:id/reviews (Used to retrieve all the reviews of a particular product, including the username of the reviewer (tables join required.)
app.get("/product/:pid/reviews", function (req, res) {
    var pid = parseInt(req.params.pid);

    review.getReviews(pid, function (err, result) {
        if (!err) {
            res.status(200).type("json").send(result);
        }
        else {
            res.status(500).send("Unknown error");
        }
    })
});

// Endpoint #12: POST/interest/:userid (Used to add interests in products)
app.post("/interest/:uid", function (req, res) {
    var uid = parseInt(req.params.uid);
    var cids = req.body.categoryids;
    var cidArr = [];
    for (var i = 0; i < cids.length; i += 2) {
        cidArr.push(parseInt(cids[i]));
    }

    interest.addInterest(uid, cidArr, function (err, result) {
        if (!err) {
            res.status(201).end();
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Bonus Feature #1 - Endpoint: POST/upload (For image uploading/storage. Server should only accept jpg or png images below 1 MB.)
app.post("/upload", upload.single('image'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:3000/image/${req.file.filename}`
    });
    let img_url = `http://${req.file.filename}`;
});

// Bonus Feature #1 - Endpoint: GET/product (For retrieval of product listing from the server.)
app.get("/product", function (req, res) {

    product.getProducts(function (err, result) {
        if (!err) {
            res.status(200).type("json").send(result);
        }
        else {
            res.status(500).send("Unknown error");
        }
    })
});

// Bonus Feature #2 - Endpoint: POST/discount/:pid (Used to add discount to discount table for a particular product)
app.post("/discount/:pid", function (req, res) {
    var pid = parseInt(req.params.pid);
    var discounts = parseFloat(req.body.discount);
    var startDate = new Date(req.body.start_date);
    var endDate = new Date(req.body.end_date);

    discount.addDiscount(pid, discounts, startDate, endDate, function (err, result) {
        if (!err) {
            res.status(201).end();
        } else {
            res.status(500).send("Unknown error");
        }
    })
});

// Bonus Feature #2 - Endpoint: DELETE/discount/:pid (Used to delete discount from discount table, of a particular product)
app.delete("/discount/:pid/", function (req, res) {
    var pid = parseInt(req.params.pid);

    discount.deleteDiscount(pid, function (err, result) {
        if (!err) {
            // console.log(result);
            res.status(204).end();
        }
        else {
            console.log(err);
            res.send(500).send("Unknown error");
        }
    })
});

// Bonus Feature #2 - Endpoint: DELETE/discount/:did (Used to delete discount from discount table, of a particular discount id)
app.delete("/discount/:did/", function (req, res) {
    var did = parseInt(req.params.did);

    discount.deleteByDiscountId(did, function (err, result) {
        if (!err) {
            // console.log(result);
            res.status(204).end();
        }
        else {
            console.log(err);
            res.send(500).send("Unknown error");
        }
    })
});

// Bonus Feature #2 - Endpoint: GET/discount/:pid (Used to get information/details from discount table, of a particular product)
app.get("/discount/:pid", function (req, res) {
    var pid = parseInt(req.params.pid);

    discount.getDiscount(pid, function (err, result) {
        if (!err) {
            res.status(200).type("json").send(result);
        }
        else {
            res.status(500).send("Unknown error");
        }
    })
});
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// New Endpoints
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
app.post("/api/login", (req, res) => {
    // return res.status(500).send("error")
    console.log(req.body)
    let data = {
        "username": req.body.username,
        "password": req.body.password
    }
    console.log(data)
    user.loginUser(data.username, data.password, (error, result) => {
        if (!error) {
            if (result == null) {
                let dataJSON = {
                    token: "",
                    UserData: {},
                };

                res.status(200).type("json").send(dataJSON);
            } else {

                // res.send("{\"result\":\"" + result + "\"}");

                let dataJSON = {
                    token: result.f_token,
                    UserData: [{
                        "uid": result.f_userInfo.ci_userid,
                        "username": result.f_userInfo.ci_username,
                        "email": result.f_userInfo.ci_email,
                        "role": result.f_userInfo.ci_role,
                        "pic": result.f_userInfo.ci_pic,
                    }
                    ]
                }
                res.status(200).type('json').send(dataJSON);
                //res.status(200).send(null);
            }
        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    })
})

app.get("/category/:cid", function (req, res) {
    var cid = parseInt(req.params.cid);

    category.getProductByCat(cid, function (err, result) {
        if (!err) {
            if (result != null) {
            res.status(200).type("json").send(result);
            }
            else {
                res.status(404).send("Product(s) Not Found!");
            }
        }
        else {
            res.status(500).send("Unknown Error");
        }
    })
});

app.get("/products/:pBrand", function (req, res) {
    var pBrand = req.params.pBrand;

    product.getProductByBrand(pBrand, function (err, result) {
        if (!err) {
            if (result != null) {
            res.status(200).type("json").send(result);
            }
            else {
                res.status(404).send("Product(s) Not Found!");
            }
        }
        else {
            res.status(500).send("Unknown Error");
        }
    })
});

app.get("/products/brands/:pBrand", function (req, res) {
    var pBrand = req.params.pBrand;

    product.searchProductByBrand(pBrand, function (err, result) {
        if (!err) {
            if (result != null) {
            res.status(200).type("json").send(result);
            }
            else {
                res.status(404).send("Product(s) Not Found!");
            }
        }
        else {
            res.status(500).send("Unknown Error");
        }
    })
});

app.get("/products/product/:pName", function (req, res) {
    var pName = req.params.pName;

    product.searchProductByName(pName, function (err, result) {
        if (!err) {
            if (result != null) {
            res.status(200).type("json").send(result);
            }
            else {
                res.status(404).send("Product(s) Not Found!");
            }
        }
        else {
            res.status(500).send("Unknown Error");
        }
    })
});

// app.get("/category/:cid", (req, res) => {
//     // return res.status(500).send("error")
//     var cid = parseInt(req.params.cid); 
//     category.getProductByCat(cid, (error, result) => {
//         if (!error) {
//             if (result == null) {
//                 let finalResult = {
//                     productInfo: ""
//                 };

//                 res.status(200).type("json").send(finalResult);
//             } else {
//                 res.status(200).type('json').send(finalResult);
//             }
//         } else {
//             res.status(500);
//             res.send(err.statusCode);
//         }
//     })
// })

// app.get('/product/:cid', function (req, res) {
//     var cid = parseInt(req.params.cid);

//     product.getProductByCat(cid, function (err, result) {
//         if (!err) {
//             res.status(200).send(result);
//         } else {
//             res.status(500).send("Unknown error");
//         }
//     });

// });

//-------------------------------------------
// exports
//-------------------------------------------

module.exports = app;
