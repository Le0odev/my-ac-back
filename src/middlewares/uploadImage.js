const multer = require('multer');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../config/firebase');

// Configuração do Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limite de 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Envie apenas imagens.'));
    }
  },
});

// Middleware para upload no Firebase Storage
const uploadToFirebase = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${req.file.originalname}`;
    const fileRef = ref(storage, `prestadores/${fileName}`);

    // Upload do arquivo para o Firebase Storage
    const snapshot = await uploadBytes(fileRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    // Obtém a URL do arquivo
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Adiciona a URL ao req.body
    req.body.avatarUrl = downloadURL;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload: upload.single('avatar'),
  uploadToFirebase
};
