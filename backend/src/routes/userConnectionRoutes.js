import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { UserConnectionController } from '../controllers/UserConnectionController.js';

const router = Router();
const userConnectionController = new UserConnectionController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// POST /api/user-connections - Criar uma nova solicitação de conexão
router.post('/', 
  userConnectionController.validateCreateConnection(),
  userConnectionController.createConnection.bind(userConnectionController)
);

// GET /api/user-connections/received - Buscar conexões recebidas
router.get('/received', 
  userConnectionController.getReceivedConnections.bind(userConnectionController)
);

// GET /api/user-connections/sent - Buscar conexões enviadas
router.get('/sent', 
  userConnectionController.getSentConnections.bind(userConnectionController)
);

// GET /api/user-connections/accepted - Buscar conexões aceitas (amigos)
router.get('/accepted', 
  userConnectionController.getAcceptedConnections.bind(userConnectionController)
);

// GET /api/user-connections/stats - Obter estatísticas de conexões
router.get('/stats', 
  userConnectionController.getConnectionStats.bind(userConnectionController)
);

// GET /api/user-connections/status/:userId - Verificar status de conexão com um usuário
router.get('/status/:userId', 
  userConnectionController.getConnectionStatus.bind(userConnectionController)
);

// PUT /api/user-connections/:connectionId/accept - Aceitar uma conexão
router.put('/:connectionId/accept', 
  userConnectionController.acceptConnection.bind(userConnectionController)
);

// PUT /api/user-connections/:connectionId/reject - Rejeitar uma conexão
router.put('/:connectionId/reject', 
  userConnectionController.rejectConnection.bind(userConnectionController)
);

// PUT /api/user-connections/:connectionId/block - Bloquear uma conexão
router.put('/:connectionId/block', 
  userConnectionController.blockConnection.bind(userConnectionController)
);

// DELETE /api/user-connections/:connectionId - Deletar uma conexão
router.delete('/:connectionId', 
  userConnectionController.deleteConnection.bind(userConnectionController)
);

export default router;
