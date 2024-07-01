import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/pdf");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, `${uniqueSuffix}_${file.originalname}`);
    },
  });
  
  
export const uploads = multer({ storage: storage });
