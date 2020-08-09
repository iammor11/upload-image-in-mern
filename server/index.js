const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const cors = require('cors')

const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const fullNameRoutes = require('./api/routes/fullName');
const userRoutes = require('./api/routes/user');
const emailRoutes = require('./api/routes/email');

//setup express app
const app = express()

//connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/mor', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
mongoose.Promise = global.Promise;

//check connection
const db = mongoose.connection;
db.once('open', () => {
    // Init stream
    // gfs = Grid(db.db, mongoose.mongo);
    // gfs.collection('uploads/');
    console.log("Connected to mongoDB")
})

//check for DB errors
db.on('error', () => {
    console.log("Get errors while connected to mongoDB");
})

//setup middleware
//app.use(morgan('dev')); //used for console
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true
}))

//setup access-control-allow-origin
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Reequested-With, Content-type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
      }
    next();
})

//Routes which handle request
app.use("/api/names", fullNameRoutes);
app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);

//For 404 - Resource Not Found
app.use((req, res, next) => {
    const error = new Error("Not Found");
    res.status = 404;
    next(error) //when a file is not found instead of sending a 404 response, it instead calls next() to move in to the next middleware
})

//For 500 - Error
app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).json({
        error: {
            message: error.message
        }
    })
})

//Server start
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log("Server has startedd on port" + PORT )
})

// const express = require("express");
// const app = express();

// const crypto = require("crypto");
// const path = require("path");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");

// // Middlewares
// app.use(express.json());
// // DB
// const mongoURI = "mongodb://127.0.0.1:27017/mor";

// // connection
// const conn = mongoose.createConnection(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

//  app.use('/uploads', express.static('uploads'));
// // init gfs
// let gfs;
// conn.once("open", () => {
//   // init stream
//   gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: "uploads/"
//   });
// });

// // Storage
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads"
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// const upload = multer({
//   storage
// });

// // get / page
// app.get("/", (req, res) => {
//   if(!gfs) {
//     console.log("some error occured, check connection to db");
//     res.send("some error occured, check connection to db");
//     process.exit(0);
//   }
//   gfs.find().toArray((err, files) => {
//     // check if files
//     if (!files || files.length === 0) {
//       return res.render("index", {
//         files: false
//       });
//     } else {
//       const f = files
//         .map(file => {
//           if (
//             file.contentType === "image/png" ||
//             file.contentType === "image/jpeg"
//           ) {
//             file.isImage = true;
//           } else {
//             file.isImage = false;
//           }
//           return file;
//         })
//         .sort((a, b) => {
//           return (
//             new Date(b["uploadDate"]).getTime() -
//             new Date(a["uploadDate"]).getTime()
//           );
//         });

//       return res.render("index", {
//         files: f
//       });
//     }

//     // return res.json(files);
//   });
// });

// app.post("/upload", upload.single("file"), (req, res) => {
//   res.json({file : req.file})
//   //res.redirect("/");
// });

// app.get("/files", (req, res) => {
//   gfs.find().toArray((err, files) => {
//     // check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: "no files exist"
//       });
//     }

//     return res.json(files);
//   });
// });

// app.get("/files/:filename", (req, res) => {
//   gfs.find(
//     {
//       filename: req.params.filename
//     },
//     (err, file) => {
//       if (!file) {
//         return res.status(404).json({
//           err: "no files exist"
//         });
//       }

//       return res.json(file);
//     }
//   );
// });

// app.get("/image/:filename", (req, res) => {
//   // console.log('id', req.params.id)
//   const file = gfs
//     .find({
//       filename: req.params.filename
//     })
//     .toArray((err, files) => {
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: "no files exist"
//         });
//       }
//       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//     });
// });

// // files/del/:id
// // Delete chunks from the db
// app.post("/files/del/:id", (req, res) => {
//   gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
//     if (err) return res.status(404).json({ err: err.message });
//     res.redirect("/");
//   });
// });

// const port = 4000;

// app.listen(port, () => {
//   console.log("server started on " + port);
// });