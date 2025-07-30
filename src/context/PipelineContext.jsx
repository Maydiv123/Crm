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
      console.log('=== fetchPipelines started ===');
      console.log('Fetching pipelines from backend...');
      const response = await pipelineAPI.getAll();
      console.log('Backend response:', response);
      
      if (response.data && response.data.pipelines) {
        console.log('Raw pipeline data from backend:', response.data.pipelines);
        const formattedPipelines = response.data.pipelines.map(p => ({
          id: p.id,
          name: p.name,
          stages: p.stages.map(s => s.label),
          isDefault: p.isDefault
        }));
        console.log('Formatted pipelines:', formattedPipelines);
        console.log('Setting pipelines state to:', formattedPipelines);
        setPipelines(formattedPipelines);
        
        // Set default pipeline
        const defaultIndex = formattedPipelines.findIndex(p => p.isDefault);
        if (defaultIndex !== -1) {
          setSelectedPipelineIndex(defaultIndex);
        }
        console.log('=== fetchPipelines completed successfully ===');
      } else {
        console.log('No pipeline data in response');
        // Set default pipeline if no data from backend
        setPipelines([{
          id: 1,
          name: 'Sales Pipeline',
          stages: ['Initial Contact', 'Discussions', 'Decision Making', 'Contract Discussion', 'Deal - won', 'Deal - lost'],
          isDefault: true
        }]);
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      // Set default pipeline on error
      setPipelines([{
        id: 1,
        name: 'Sales Pipeline',
        stages: ['Initial Contact', 'Discussions', 'Decision Making', 'Contract Discussion', 'Deal - won', 'Deal - lost'],
        isDefault: true
      }]);
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

  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}; 