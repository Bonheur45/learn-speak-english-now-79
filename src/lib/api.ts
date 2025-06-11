import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        // Use a fresh axios call without interceptors to avoid sending the expired access token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { access_token } = refreshResponse.data;
        localStorage.setItem('access_token', access_token);
        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh fails, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const payload = new URLSearchParams();
    payload.append('username', username);
    payload.append('password', password);
    payload.append('grant_type', 'password');

    const response = await api.post('/api/v1/auth/login', payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    username: string;
  }) => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    await api.post('/api/v1/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },
};

// Students API
export const studentsApi = {
  getStudents: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/students/', { params: { skip, limit } });
    return response.data;
  },

  getStudent: async (studentId: string) => {
    const response = await api.get(`/api/v1/students/${studentId}`);
    return response.data;
  },

  createStudent: async (studentData: any) => {
    const response = await api.post('/api/v1/students/', studentData);
    return response.data;
  },

  updateStudent: async (studentId: string, studentData: any) => {
    const response = await api.put(`/api/v1/students/${studentId}`, studentData);
    return response.data;
  },

  deleteStudent: async (studentId: string) => {
    const response = await api.delete(`/api/v1/students/${studentId}`);
    return response.data;
  },
};

// Curriculum API
export const curriculumApi = {
  getCurriculumTemplates: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/curriculum/', { params: { skip, limit } });
    return response.data;
  },

  getCurriculumTemplate: async (curriculumId: string) => {
    const response = await api.get(`/api/v1/curriculum/${curriculumId}`);
    return response.data;
  },

  createCurriculumTemplate: async (curriculumData: any) => {
    const response = await api.post('/api/v1/curriculum/', curriculumData);
    return response.data;
  },

  updateCurriculumTemplate: async (curriculumId: string, curriculumData: any) => {
    const response = await api.put(`/api/v1/curriculum/${curriculumId}`, curriculumData);
    return response.data;
  },

  deleteCurriculumTemplate: async (curriculumId: string) => {
    const response = await api.delete(`/api/v1/curriculum/${curriculumId}`);
    return response.data;
  },
};

// Cohorts API
export const cohortsApi = {
  getCohorts: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/cohorts/', { params: { skip, limit } });
    return response.data;
  },

  getCohort: async (cohortId: string) => {
    const response = await api.get(`/api/v1/cohorts/${cohortId}`);
    return response.data;
  },

  createCohort: async (cohortData: any) => {
    const response = await api.post('/api/v1/cohorts/', cohortData);
    return response.data;
  },

  updateCohort: async (cohortId: string, cohortData: any) => {
    const response = await api.put(`/api/v1/cohorts/${cohortId}`, cohortData);
    return response.data;
  },

  deleteCohort: async (cohortId: string) => {
    const response = await api.delete(`/api/v1/cohorts/${cohortId}`);
    return response.data;
  },
};

// Enrollments API
export const enrollmentsApi = {
  getEnrollments: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/enrollments/', { params: { skip, limit } });
    return response.data;
  },

  getEnrollment: async (enrollmentId: string) => {
    const response = await api.get(`/api/v1/enrollments/${enrollmentId}`);
    return response.data;
  },

  createEnrollment: async (enrollmentData: any) => {
    const response = await api.post('/api/v1/enrollments/', enrollmentData);
    return response.data;
  },

  updateEnrollment: async (enrollmentId: string, enrollmentData: any) => {
    const response = await api.put(`/api/v1/enrollments/${enrollmentId}`, enrollmentData);
    return response.data;
  },

  deleteEnrollment: async (enrollmentId: string) => {
    const response = await api.delete(`/api/v1/enrollments/${enrollmentId}`);
    return response.data;
  },
};

// Assessments API
export const assessmentsApi = {
  getAssessments: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/assessments/', { params: { skip, limit } });
    return response.data;
  },

  getAssessment: async (assessmentId: string) => {
    const response = await api.get(`/api/v1/assessments/${assessmentId}`);
    return response.data;
  },

  createAssessment: async (assessmentData: any) => {
    const response = await api.post('/api/v1/assessments/', assessmentData);
    return response.data;
  },

  updateAssessment: async (assessmentId: string, assessmentData: any) => {
    const response = await api.put(`/api/v1/assessments/${assessmentId}`, assessmentData);
    return response.data;
  },

  deleteAssessment: async (assessmentId: string) => {
    const response = await api.delete(`/api/v1/assessments/${assessmentId}`);
    return response.data;
  },

  submitAssessment: async (assessmentId: string, submissionData: any) => {
    const response = await api.post(`/api/v1/assessments/${assessmentId}/submissions`, submissionData);
    return response.data;
  },
};

// Materials API
export const materialsApi = {
  getMaterials: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/materials/', { params: { skip, limit } });
    return response.data;
  },

  getMaterial: async (materialId: string) => {
    const response = await api.get(`/api/v1/materials/${materialId}`);
    return response.data;
  },

  createMaterial: async (materialData: any) => {
    const response = await api.post('/api/v1/materials/', materialData);
    return response.data;
  },

  updateMaterial: async (materialId: string, materialData: any) => {
    const response = await api.put(`/api/v1/materials/${materialId}`, materialData);
    return response.data;
  },

  deleteMaterial: async (materialId: string) => {
    const response = await api.delete(`/api/v1/materials/${materialId}`);
    return response.data;
  },
};

// Progress API
export const progressApi = {
  getProgress: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/progress/', { params: { skip, limit } });
    return response.data;
  },

  getProgressEntry: async (progressId: string) => {
    const response = await api.get(`/api/v1/progress/${progressId}`);
    return response.data;
  },

  createProgress: async (progressData: any) => {
    const response = await api.post('/api/v1/progress/', progressData);
    return response.data;
  },

  updateProgress: async (progressId: string, progressData: any) => {
    const response = await api.put(`/api/v1/progress/${progressId}`, progressData);
    return response.data;
  },

  deleteProgress: async (progressId: string) => {
    const response = await api.delete(`/api/v1/progress/${progressId}`);
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getAnalytics: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/analytics/', { params: { skip, limit } });
    return response.data;
  },

  getAnalyticsEntry: async (analyticsId: string) => {
    const response = await api.get(`/api/v1/analytics/${analyticsId}`);
    return response.data;
  },

  createAnalytics: async (analyticsData: any) => {
    const response = await api.post('/api/v1/analytics/', analyticsData);
    return response.data;
  },

  updateAnalytics: async (analyticsId: string, analyticsData: any) => {
    const response = await api.put(`/api/v1/analytics/${analyticsId}`, analyticsData);
    return response.data;
  },

  deleteAnalytics: async (analyticsId: string) => {
    const response = await api.delete(`/api/v1/analytics/${analyticsId}`);
    return response.data;
  },

  getCohortPerformance: async (cohortId: string) => {
    const response = await api.get(`/api/v1/analytics/cohorts/${cohortId}/performance`);
    return response.data;
  },

  getStudentPerformance: async (studentId: string) => {
    const response = await api.get(`/api/v1/analytics/students/${studentId}/performance`);
    return response.data;
  },

  getCurriculumPerformance: async (curriculumId: string) => {
    const response = await api.get(`/api/v1/analytics/curriculum/${curriculumId}/performance`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  listUsers: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/users/', { params: { skip, limit } });
    return response.data;
  },

  updateUser: async (userId: string, userData: any) => {
    const response = await api.put(`/api/v1/users/${userId}`, userData);
    return response.data;
  },
};

export default {
  auth: authApi,
  students: studentsApi,
  curriculum: curriculumApi,
  cohorts: cohortsApi,
  enrollments: enrollmentsApi,
  assessments: assessmentsApi,
  materials: materialsApi,
  progress: progressApi,
  analytics: analyticsApi,
  users: usersApi,
}; 