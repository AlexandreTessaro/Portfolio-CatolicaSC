const API_BASE_URL = 'http://localhost:5000';

async function testCanRequestParticipation() {
  try {
    console.log('🔍 Testando endpoint canRequestParticipation...\n');

    // 1. Fazer login para obter token
    console.log('1. Fazendo login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teste@startupcollab.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      throw new Error('Login falhou: ' + loginData.message);
    }
    
    const token = loginData.data.accessToken;
    console.log('✅ Login realizado com sucesso\n');

    // 2. Obter lista de projetos
    console.log('2. Obtendo lista de projetos...');
    const projectsResponse = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const projectsData = await projectsResponse.json();
    const projects = projectsData.data;
    console.log(`✅ Encontrados ${projects.length} projetos\n`);

    if (projects.length === 0) {
      console.log('❌ Nenhum projeto encontrado para testar');
      return;
    }

    // 3. Testar canRequestParticipation para cada projeto
    for (const project of projects) {
      console.log(`3. Testando projeto: ${project.title} (ID: ${project.id})`);
      
      try {
        const canRequestResponse = await fetch(
          `${API_BASE_URL}/api/matches/can-request/${project.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const canRequestData = await canRequestResponse.json();
        console.log('✅ Resposta:', canRequestData);
        
        if (canRequestData.data.canRequest) {
          console.log('✅ Usuário pode solicitar participação');
        } else {
          console.log('❌ Usuário não pode solicitar participação:', canRequestData.data.reason);
        }
      } catch (error) {
        console.log('❌ Erro ao testar:', error.message);
      }
      
      console.log('---\n');
    }

    // 4. Testar criação de match se possível
    const firstProject = projects[0];
    console.log(`4. Testando criação de match para projeto: ${firstProject.title}`);
    
    try {
      const canRequestResponse = await fetch(
        `${API_BASE_URL}/api/matches/can-request/${firstProject.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const canRequestData = await canRequestResponse.json();

      if (canRequestData.data.canRequest) {
        const createMatchResponse = await fetch(
          `${API_BASE_URL}/api/matches`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({
              projectId: firstProject.id,
              message: 'Teste de solicitação de participação via script'
            })
          }
        );

        const createMatchData = await createMatchResponse.json();
        console.log('✅ Match criado com sucesso:', createMatchData);
      } else {
        console.log('❌ Não é possível criar match:', canRequestData.data.reason);
      }
    } catch (error) {
      console.log('❌ Erro ao criar match:', error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testCanRequestParticipation();
