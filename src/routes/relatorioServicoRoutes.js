const express = require("express")
const router = express.Router()
const RelatorioServicoController = require("../controllers/relatorioServicoController")
const authorize = require("../middlewares/authMiddleware")

// Apenas prestadores ou empresas podem criar relatórios de serviço
router.post("/relatorio-servico", authorize(["prestador", "empresa"]), RelatorioServicoController.create)

// Rota específica para prestadores criarem relatórios
router.post("/relatorio-servico/prestador", authorize(["prestador"]), RelatorioServicoController.createByPrestador)

// Apenas empresas podem listar relatórios de serviço (ou ambos, se aplicável)
router.get("/relatorios-servico", authorize(["prestador", "empresa"]), RelatorioServicoController.list)

// Apenas empresas podem buscar relatório de serviço por ID
router.get("/relatorio-servico/:id", authorize(["prestador", "empresa"]), RelatorioServicoController.getById)

// Apenas prestadores ou empresas podem atualizar relatório de serviço
router.put("/relatorio-servico/:id", authorize(["prestador", "empresa"]), RelatorioServicoController.update)

// Apenas prestadores ou empresas podem excluir relatório de serviço
router.delete("/relatorio-servico/:id", authorize(["prestador", "empresa"]), RelatorioServicoController.delete)

// Rota para listar relatórios por empresa
router.get(
  "/relatorios-servico/empresa/:empresaId",
  authorize(["prestador", "empresa"]), // Permissões necessárias
  RelatorioServicoController.listByEmpresa, // Chama o método que criamos
)

// Rota para listar relatórios por prestador
router.get(
  "/relatorios-servico/prestador/:prestadorId",
  authorize(["prestador", "empresa"]),
  RelatorioServicoController.listByPrestador,
)

module.exports = router

