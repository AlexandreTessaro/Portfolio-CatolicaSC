# Web Aplicação de Divulgação e Colaboração de Startups

**Alexandre Tessaro Vieira**  
Engenharia de Software  
01/01/2025

---

## Resumo

Este documento descreve o desenvolvimento de uma aplicação cujo objetivo é conectar ideias a pessoas para a criação de startups. A aplicação permitirá a divulgação de ideias de projeto e facilitará a formação de equipes, criando uma ponte entre ideias e pessoas. Pretende-se utilizar tecnologias modernas como React, Node.js e PostgreSQL, obedecendo às práticas de desenvolvimento ágil, integração e entrega contínuas (CI/CD) e princípios de Clean Code. O projeto visa fomentar um ecossistema de inovação, incentivando a colaboração e a estruturação de times.

---

## 1. Introdução

### Contexto

O ambiente de inovação e startups é cada vez mais dinâmico e competitivo. No ambiente corporativo, a busca por bons parceiros é essencial para o desenvolvimento e a consolidação de novas empresas. No entanto, ainda não existe nenhuma plataforma dedicada exclusivamente a promover a conexão entre pessoas e ideias.

### Justificativa

Facilitar a conexão entre projetos e pessoas é fundamental para fomentar a inovação tecnológica. Portanto, criar uma plataforma que centralize essas conexões gera um ecossistema empreendedor para projetos que talvez jamais fossem viabilizados.

### Objetivos

- **Objetivo Principal**: Desenvolver uma aplicação web que permita a divulgação de projetos, conectando quem a idealizou com pessoas interessadas em participar do desenvolvimento, promovendo assim a formação de equipes.
- **Objetivos Secundários**: Implementar boas práticas de engenharia de software ao longo do desenvolvimento, incluindo integração e entregas contínuas (CI/CD), Test-Driven Development (TDD), princípios do Clean Code e os fundamentos do SOLID.

---

## 2. Descrição do Projeto

### Tema do Projeto

O projeto propõe o desenvolvimento de uma plataforma voltada à colaboração e divulgação de iniciativas no ecossistema de startups. A aplicação contará com funcionalidades como:

- Perfis públicos dos projetos, com informações sobre descrição, objetivo e status atual.
- Sistema de matchmaking para conectar pessoas com ideias a outras interessadas em participar do desenvolvimento.
- Ferramenta de divulgação para facilitar a formação de equipes com talentos alinhados às necessidades de cada projeto.

### Problemas a Resolver

- Dificuldade enfrentada por criadores de ideias para encontrar pessoas interessadas e dispostas a contribuir com seus projetos.
- Obstáculos na formação de equipes qualificadas e multidisciplinares.
- Falta de uma plataforma centralizada para divulgar e acompanhar protótipos e informações sobre projetos em fase inicial.

### Limitações

- Questões jurídicas, como elaboração de contratos ou acordos legais, não serão tratadas nesta versão do projeto.
- A aplicação será focada exclusivamente em ambiente web responsivo; não está prevista a criação de um aplicativo mobile nativo neste estágio.
- Funcionalidades relacionadas a integrações financeiras, como sistemas de pagamento, não estarão disponíveis na primeira versão.

---

## 3. Especificação Técnica

### 3.1 Requisitos de Software

#### Requisitos Funcionais (RF)

- **RF01**: Permitir cadastro, login e autenticação de usuários e projetos.
- **RF02**: Permitir a criação, edição e exclusão de projetos por seus criadores.
- **RF03**: Disponibilizar sistema de busca com filtros avançados para localizar projetos, usuários e oportunidades.
- **RF04**: Implementar sistema de “match” entre criadores de ideias e usuários interessados com base em interesses, habilidades e objetivos.
- **RF05**: Integrar perfis de usuários com APIs externas, como LinkedIn e GitHub.
- **RF06**: Permitir que usuários solicitem participação em projetos e que os criadores possam aceitar ou recusar candidaturas.
- **RF07**: Oferecer área de perfil público para usuários e projetos, com informações detalhadas, histórico e status.
- **RF08**: Notificar os usuários sobre interações relevantes (convites, matches, atualizações de projeto, etc.).
- **RF09**: Disponibilizar painel de administração para moderar conteúdos e gerenciar usuários.
- **RF10**: Suportar comentários ou seções de feedback nos projetos.

#### Requisitos Não Funcionais (RNF)

- **RNF01**: A aplicação deverá ser responsiva, adaptando-se a diferentes tamanhos de tela (desktop, tablet, mobile).
- **RNF02**: Todas as ações críticas (criação, exclusão, alterações de dados) devem ser auditáveis e rastreáveis.
- **RNF03**: O sistema deverá suportar ao menos 1000 usuários simultâneos na fase inicial.
- **RNF04**: A autenticação deverá ser segura, utilizando padrões como OAuth 2.0 ou Firebase Authentication.
- **RNF05**: O código deverá seguir princípios de Clean Code e SOLID, com cobertura de testes automatizados (TDD).
- **RNF06**: O sistema deverá ter tempo de resposta inferior a 2 segundos para as principais interações do usuário.
- **RNF07**: O backend deverá estar preparado para escalabilidade horizontal (ex: uso de containers e orquestração com Docker/Kubernetes).
- **RNF08**: A base de dados deverá ser segura e com backup periódico automatizado.
- **RNF09**: A aplicação deverá ter integração contínua (CI) e entrega contínua (CD) configuradas para facilitar testes e deploys frequentes.

### Representação dos Requisitos (UML)
- **(fazer a poha do UML)**
### Principais Casos de Uso

- **[Usuário] – Cadastrar perfil**  
  Permite que o usuário crie uma conta e preencha suas informações pessoais, profissionais e interesses.

- **[Usuário] – Editar perfil**  
  Permite atualizar informações como nome, habilidades, redes sociais e foto.

- **[Usuário] – Criar projeto**  
  Permite que o usuário crie um novo projeto com título, descrição, objetivos, status atual e tecnologias desejadas.

- **[Usuário] – Editar/Excluir projeto**  
  Permite modificar ou remover projetos que o usuário criou.

- **[Usuário] – Enviar pedido de match**  
  Permite demonstrar interesse em participar de um projeto ou convidar alguém para colaborar.

- **[Usuário] – Responder pedido de match**  
  Aceitar ou recusar convites recebidos.

- **[Sistema] – Mostrar sugestões de projetos e pessoas**  
  Com base em interesses e histórico de navegação do usuário.

- **[Sistema] – Enviar notificações**  
  Notificações automáticas sobre matches, atualizações e mensagens.

- **[Admin] – Moderar usuários e projetos**  
  Acesso a painel administrativo para análise, bloqueio ou remoção de conteúdos ou perfis inadequados.

- **[Usuário] – Visualizar perfil público de projeto/pessoa**  
  Permite ver informações detalhadas de projetos ou usuários, sem necessidade de login completo.

- **[Usuário] – Avaliar experiência (feedback)**  
  Permite dar feedback sobre uma colaboração concluída ou projeto encerrado.

