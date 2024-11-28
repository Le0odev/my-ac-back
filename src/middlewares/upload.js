const multer = require("multer");
const path = require("path");

// Caminho absoluto para o diretório de uploads
const uploadDir = path.join(__dirname, "uploads", "avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Usando o caminho absoluto
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtro de tipo de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de arquivo inválido. Apenas JPEG, PNG e JPG são permitidos."));
  }
};

// Instância do Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
