import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuração de Monitoramento
 * Suporta: Azure Application Insights, Datadog, New Relic
 */

class MonitoringService {
  constructor() {
    this.provider = process.env.MONITORING_PROVIDER || 'none';
    this.client = null;
    this.initialized = false;
  }

  /**
   * Inicializa o serviço de monitoramento baseado no provider configurado
   */
  async initialize() {
    if (this.initialized) return;

    try {
      switch (this.provider.toLowerCase()) {
        case 'applicationinsights':
        case 'azure':
          await this.initializeApplicationInsights();
          break;
        case 'datadog':
          await this.initializeDatadog();
          break;
        case 'newrelic':
          await this.initializeNewRelic();
          break;
        default:
          console.log('📊 Monitoramento desabilitado ou não configurado');
          this.initialized = true;
          return;
      }
      this.initialized = true;
      console.log(`✅ Monitoramento inicializado: ${this.provider}`);
    } catch (error) {
      console.error('❌ Erro ao inicializar monitoramento:', error.message);
      // Não quebrar a aplicação se o monitoramento falhar
      this.initialized = true;
    }
  }

  /**
   * Inicializa Azure Application Insights
   */
  async initializeApplicationInsights() {
    const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    
    if (!connectionString) {
      console.warn('⚠️ APPLICATIONINSIGHTS_CONNECTION_STRING não configurado');
      return;
    }

    try {
      // Azure Application Insights SDK
      let appInsights;
      try {
        appInsights = await import('applicationinsights');
      } catch (importError) {
        console.warn('⚠️ applicationinsights não instalado. Execute: npm install applicationinsights');
        return;
      }
      
      appInsights.setup(connectionString)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(true)
        .start();

      this.client = appInsights.defaultClient;
      if (this.client && this.client.context && this.client.context.keys) {
        this.client.context.tags[this.client.context.keys.cloudRole] = 'startup-collab-backend';
      }
      
      console.log('✅ Azure Application Insights configurado');
    } catch (error) {
      console.error('❌ Erro ao configurar Application Insights:', error.message);
      // Não quebrar a aplicação se falhar
    }
  }

  /**
   * Inicializa Datadog
   */
  async initializeDatadog() {
    const apiKey = process.env.DATADOG_API_KEY;
    const serviceName = process.env.DATADOG_SERVICE_NAME || 'startup-collab-backend';
    const env = process.env.DATADOG_ENV || process.env.NODE_ENV || 'production';

    if (!apiKey) {
      console.warn('⚠️ DATADOG_API_KEY não configurado');
      return;
    }

    try {
      // Datadog APM - deve ser importado no início do arquivo index.js
      // Por enquanto, apenas logamos que precisa ser configurado
      console.log('✅ Datadog configurado (requer import no início do index.js)');
      console.log('📝 Adicione: import "dd-trace/init" no início do index.js');
      console.log('📝 Configure variáveis: DD_SERVICE, DD_ENV, DD_API_KEY');
      
      // Para uso programático, podemos usar depois
      this.client = { 
        dogstatsd: {
          gauge: () => {},
          increment: () => {},
          histogram: () => {}
        }
      };
    } catch (error) {
      console.error('❌ Erro ao configurar Datadog:', error.message);
      // Não quebrar a aplicação se falhar
    }
  }

  /**
   * Inicializa New Relic
   */
  async initializeNewRelic() {
    const licenseKey = process.env.NEW_RELIC_LICENSE_KEY;
    const appName = process.env.NEW_RELIC_APP_NAME || 'startup-collab-backend';

    if (!licenseKey) {
      console.warn('⚠️ NEW_RELIC_LICENSE_KEY não configurado');
      return;
    }

    try {
      // New Relic requer require() ao invés de import
      // Por isso vamos usar uma abordagem diferente
      console.log('✅ New Relic configurado (requer require no início do arquivo)');
      console.log('📝 Adicione require("newrelic") no início do index.js');
    } catch (error) {
      console.error('❌ Erro ao configurar New Relic:', error.message);
      throw error;
    }
  }

  /**
   * Registra uma métrica customizada
   */
  trackMetric(name, value, properties = {}) {
    if (!this.initialized || !this.client) return;

    try {
      switch (this.provider.toLowerCase()) {
        case 'applicationinsights':
        case 'azure':
          this.client.trackMetric({
            name: name,
            value: value,
            properties: properties
          });
          break;
        case 'datadog':
          // Datadog usa tags para propriedades
          const tags = Object.entries(properties).map(([k, v]) => `${k}:${v}`);
          this.client.dogstatsd.gauge(name, value, tags);
          break;
      }
    } catch (error) {
      console.error('Erro ao registrar métrica:', error.message);
    }
  }

  /**
   * Registra um evento customizado
   */
  trackEvent(name, properties = {}) {
    if (!this.initialized || !this.client) return;

    try {
      switch (this.provider.toLowerCase()) {
        case 'applicationinsights':
        case 'azure':
          this.client.trackEvent({
            name: name,
            properties: properties
          });
          break;
        case 'datadog':
          const tags = Object.entries(properties).map(([k, v]) => `${k}:${v}`);
          this.client.dogstatsd.increment(name, 1, tags);
          break;
      }
    } catch (error) {
      console.error('Erro ao registrar evento:', error.message);
    }
  }

  /**
   * Registra uma exceção
   */
  trackException(error, properties = {}) {
    if (!this.initialized || !this.client) return;

    try {
      switch (this.provider.toLowerCase()) {
        case 'applicationinsights':
        case 'azure':
          this.client.trackException({
            exception: error,
            properties: properties
          });
          break;
        case 'datadog':
          this.client.dogstatsd.increment('errors', 1, [
            `error_type:${error.name}`,
            `error_message:${error.message}`
          ]);
          break;
      }
    } catch (err) {
      console.error('Erro ao registrar exceção:', err.message);
    }
  }

  /**
   * Inicia um trace customizado
   */
  async startTrace(name, callback) {
    if (!this.initialized || !this.client) {
      return callback();
    }

    try {
      switch (this.provider.toLowerCase()) {
        case 'applicationinsights':
        case 'azure':
          const startTime = Date.now();
          try {
            const result = await callback();
            const duration = Date.now() - startTime;
            this.trackMetric(`${name}.duration`, duration);
            return result;
          } catch (error) {
            const duration = Date.now() - startTime;
            this.trackMetric(`${name}.duration`, duration);
            throw error;
          }
        case 'datadog':
          // Datadog usa auto-instrumentation quando importado corretamente
          // Para traces customizados, usar dd-trace diretamente
          return callback();
        default:
          return callback();
      }
    } catch (error) {
      console.error('Erro ao iniciar trace:', error.message);
      return callback();
    }
  }

  /**
   * Middleware para Express que rastreia requisições HTTP
   */
  requestTrackingMiddleware() {
    return (req, res, next) => {
      if (!this.initialized || !this.client) {
        return next();
      }

      const startTime = Date.now();
      const originalSend = res.send;

      // Rastrear início da requisição
      this.trackEvent('http_request_start', {
        method: req.method,
        path: req.path,
        route: req.route?.path || req.path
      });

      // Interceptar resposta
      res.send = function(body) {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        try {
          // Rastrear métricas
          monitoringService.trackMetric('http_request_duration', duration, {
            method: req.method,
            path: req.path,
            status_code: statusCode.toString()
          });

          monitoringService.trackEvent('http_request_complete', {
            method: req.method,
            path: req.path,
            status_code: statusCode.toString(),
            duration: duration.toString()
          });

          // Rastrear erros
          if (statusCode >= 400) {
            monitoringService.trackEvent('http_request_error', {
              method: req.method,
              path: req.path,
              status_code: statusCode.toString()
            });
          }
        } catch (error) {
          // Não quebrar a resposta se o monitoramento falhar
          console.error('Erro ao rastrear requisição:', error.message);
        }

        return originalSend.call(this, body);
      };

      next();
    };
  }
}

// Singleton
const monitoringService = new MonitoringService();

export default monitoringService;

