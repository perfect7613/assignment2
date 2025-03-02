// services/api.js

const API_URL = "http://localhost:8000/api";

export const fetchCandidates = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sort_by", params.sortBy);
  if (params.sortDesc) queryParams.append("sort_desc", params.sortDesc);
  if (params.stage) queryParams.append("stage", params.stage);
  if (params.skip) queryParams.append("skip", params.skip);
  if (params.limit) queryParams.append("limit", params.limit);

  try {
    const response = await fetch(`${API_URL}/candidates/?${queryParams}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    throw error;
  }
};

export const fetchCandidate = async (id) => {
  try {
    const response = await fetch(`${API_URL}/candidates/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch candidate with ID ${id}:`, error);
    throw error;
  }
};

export const createCandidate = async (candidateData) => {
  try {
    const response = await fetch(`${API_URL}/candidates/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidateData),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to create candidate:", error);
    throw error;
  }
};

export const updateCandidate = async (id, candidateData) => {
  try {
    const response = await fetch(`${API_URL}/candidates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidateData),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to update candidate with ID ${id}:`, error);
    throw error;
  }
};

export const advanceCandidateStage = async (id, nextStage) => {
  try {
    const response = await fetch(`${API_URL}/candidates/${id}/next-stage?next_stage=${encodeURIComponent(nextStage)}`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to advance candidate with ID ${id}:`, error);
    throw error;
  }
};

export const rejectCandidate = async (id) => {
  try {
    const response = await fetch(`${API_URL}/candidates/${id}/reject`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to reject candidate with ID ${id}:`, error);
    throw error;
  }
};

export const importCandidates = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/candidates/import/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to import candidates:", error);
    throw error;
  }
};

export const generateCandidatePDF = async (id) => {
  window.open(`${API_URL}/candidates/${id}/pdf`, "_blank");
};