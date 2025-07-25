import React, { createContext, useContext, useState, useEffect } from 'react';
import { pipelineAPI } from '../services/api';

const PipelineContext = createContext();

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};

export const PipelineProvider = ({ children }) => {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineIndex, setSelectedPipelineIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pipelines from backend
  const fetchPipelines = async () => {
    try {
      setIsLoading(true);
      const response = await pipelineAPI.getAll();
      if (response.data && response.data.pipelines) {
        const formattedPipelines = response.data.pipelines.map(p => ({
          id: p.id,
          name: p.name,
          stages: p.stages.map(s => s.label),
          isDefault: p.isDefault
        }));
        setPipelines(formattedPipelines);
        
        // Set default pipeline
        const defaultIndex = formattedPipelines.findIndex(p => p.isDefault);
        if (defaultIndex !== -1) {
          setSelectedPipelineIndex(defaultIndex);
        }
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update pipelines
  const updatePipelines = (newPipelines) => {
    setPipelines(newPipelines);
  };

  // Add new pipeline
  const addPipeline = (pipeline) => {
    setPipelines(prev => [...prev, pipeline]);
  };

  // Update specific pipeline
  const updatePipeline = (index, updatedPipeline) => {
    setPipelines(prev => prev.map((p, i) => i === index ? updatedPipeline : p));
  };

  // Delete pipeline
  const deletePipeline = (index) => {
    setPipelines(prev => prev.filter((_, i) => i !== index));
  };

  // Get current pipeline stages for Automate
  const getCurrentPipelineStages = () => {
    if (pipelines.length === 0 || selectedPipelineIndex >= pipelines.length) {
      return [];
    }
    return pipelines[selectedPipelineIndex].stages.map((stage, index) => ({
      key: stage.toLowerCase().replace(/ /g, ''),
      label: stage,
      hint: null,
      isDefault: index === 0, // First stage is default
      hints: { beginner: "", intermediate: "", expert: "" }
    }));
  };

  // Initial fetch
  useEffect(() => {
    fetchPipelines();
  }, []);

  const value = {
    pipelines,
    selectedPipelineIndex,
    isLoading,
    setSelectedPipelineIndex,
    updatePipelines,
    addPipeline,
    updatePipeline,
    deletePipeline,
    fetchPipelines,
    getCurrentPipelineStages
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}; 