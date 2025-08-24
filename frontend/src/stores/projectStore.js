import { create } from 'zustand';

export const useProjectStore = create((set, get) => ({
  // Estado
  projects: [],
  currentProject: null,
  userProjects: [],
  recommendedProjects: [],
  isLoading: false,
  error: null,
  filters: {
    status: '',
    category: '',
    technologies: [],
  },
  pagination: {
    limit: 20,
    offset: 0,
    total: 0,
  },

  // Ações
  setProjects: (projects) => set({ projects }),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setUserProjects: (projects) => set({ userProjects: projects }),
  
  setRecommendedProjects: (projects) => set({ recommendedProjects: projects }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  
  setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),
  
  addProject: (project) => {
    const currentProjects = get().projects;
    set({ projects: [project, ...currentProjects] });
  },
  
  updateProject: (projectId, updates) => {
    const currentProjects = get().projects;
    const updatedProjects = currentProjects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    );
    set({ projects: updatedProjects });
    
    // Atualizar também no currentProject se for o mesmo
    const currentProject = get().currentProject;
    if (currentProject && currentProject.id === projectId) {
      set({ currentProject: { ...currentProject, ...updates } });
    }
  },
  
  removeProject: (projectId) => {
    const currentProjects = get().projects;
    const filteredProjects = currentProjects.filter(project => project.id !== projectId);
    set({ projects: filteredProjects });
    
    // Limpar currentProject se for o mesmo
    const currentProject = get().currentProject;
    if (currentProject && currentProject.id === projectId) {
      set({ currentProject: null });
    }
  },
  
  clearProjects: () => set({ 
    projects: [], 
    currentProject: null, 
    userProjects: [], 
    recommendedProjects: [] 
  }),
  
  clearError: () => set({ error: null }),
  
  // Getters
  getProjects: () => get().projects,
  getCurrentProject: () => get().currentProject,
  getUserProjects: () => get().userProjects,
  getRecommendedProjects: () => get().recommendedProjects,
  getIsLoading: () => get().isLoading,
  getError: () => get().error,
  getFilters: () => get().filters,
  getPagination: () => get().pagination,
}));
