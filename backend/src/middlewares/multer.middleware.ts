import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const filename = file.originalname.split(".");
    callback(null, `${filename[0]}_${Date.now()}.${filename.at(-1)}`);
  },
});

export const upload = multer({ storage });
