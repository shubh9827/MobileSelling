const multer = require('multer');
const fs = require('fs');
const path = require('path');
const validateData = (schema, inputName = "images", storageDestination = '../../public/images', maxFiles = 3) => (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.startsWith('multipart/form-data')) {
    const resolvedStorageDestination = path.resolve(__dirname, storageDestination);
    if (!fs.existsSync(resolvedStorageDestination)) {
      fs.mkdirSync(resolvedStorageDestination, { recursive: true });
    }
    const storage = multer.diskStorage({
      destination: resolvedStorageDestination,
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      }
    });
    const upload = multer({ storage: storage }).array(inputName, maxFiles);
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while uploading the files.' });
      }
      if (!req.files || req.files.length !== 3) {
        return res.status(400).json({ error: `Exactly 3 images are required.` });
      }
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      req.validatedFiles = req.files;
      req.validatedBody = req.body;
      next();
    });
  } else {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  }
};

module.exports = validateData;