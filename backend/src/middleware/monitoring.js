import monitoringService from '../config/monitoring.js';

/**
 * Middleware de monitoramento para Express
 * Rastreia requisições HTTP, erros e métricas de performance
 */

/**
 * Middleware para rastrear requisições HTTP
 */
export const monitoringMiddleware = (req, res, next) => {
  return monitoringService.requestTrackingMiddleware()(req, res, next);
};

/**
 * Middleware para rastrear erros
 */
export const errorTrackingMiddleware = (err, req, res, next) => {
  // Rastrear exceção
  monitoringService.trackException(err, {
    method: req.method,
    path: req.path,
    status_code: res.statusCode || 500,
    user_id: req.user?.userId || 'anonymous'
  });

  // Rastrear métrica de erro
  monitoringService.trackMetric('http_error', 1, {
    method: req.method,
    path: req.path,
    error_type: err.name || 'Error',
    status_code: (res.statusCode || 500).toString()
  });

  next(err);
};

/**
 * Helper para rastrear operações assíncronas
 */
export const trackOperation = async (operationName, operation, properties = {}) => {
  return monitoringService.startTrace(operationName, async () => {
    const startTime = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      monitoringService.trackMetric(`${operationName}.success`, duration, properties);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      monitoringService.trackMetric(`${operationName}.error`, duration, {
        ...properties,
        error_type: error.name
      });
      monitoringService.trackException(error, {
        operation: operationName,
        ...properties
      });
      throw error;
    }
  });
};

