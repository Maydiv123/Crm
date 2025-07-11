import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/pipeline - fetch pipeline config
router.get('/', async (req, res) => {
  try {
    // Get the default pipeline with all its stages and hints
    const [pipelines] = await pool.execute(`
      SELECT p.id, p.name, p.description, p.is_default 
      FROM pipelines p 
      WHERE p.is_default = TRUE 
      ORDER BY p.id DESC 
      LIMIT 1
    `);

    if (pipelines.length === 0) {
      return res.json({ columns: [] });
    }

    const pipelineId = pipelines[0].id;

    // Get all stages for this pipeline
    const [stages] = await pool.execute(`
      SELECT ps.id, ps.stage_key, ps.stage_name, ps.stage_order, ps.is_default, ps.is_custom
      FROM pipeline_stages ps 
      WHERE ps.pipeline_id = ? 
      ORDER BY ps.stage_order
    `, [pipelineId]);

    // Get all hints for each stage
    const columns = [];
    for (const stage of stages) {
      const [hints] = await pool.execute(`
        SELECT ph.hint_type, ph.hint_text
        FROM pipeline_hints ph 
        WHERE ph.stage_id = ?
      `, [stage.id]);

      const hintsObj = {};
      hints.forEach(hint => {
        hintsObj[hint.hint_type] = hint.hint_text;
      });

      columns.push({
        key: stage.stage_key,
        label: stage.stage_name,
        hint: hintsObj.beginner || hintsObj.intermediate || hintsObj.expert || null,
        isDefault: stage.is_default,
        hints: hintsObj
      });
    }

    res.json({ columns });
  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/pipeline - save/update pipeline config
router.post('/', async (req, res) => {
  try {
    const { columns } = req.body;
    
    // Get or create default pipeline
    let [pipelines] = await pool.execute(`
      SELECT id FROM pipelines WHERE is_default = TRUE LIMIT 1
    `);
    
    let pipelineId;
    if (pipelines.length === 0) {
      const [result] = await pool.execute(`
        INSERT INTO pipelines (name, description, is_default, created_by) 
        VALUES ('Sales Pipeline', 'Default sales pipeline', TRUE, 1)
      `);
      pipelineId = result.insertId;
    } else {
      pipelineId = pipelines[0].id;
    }

    // Clear existing stages for this pipeline
    await pool.execute('DELETE FROM pipeline_stages WHERE pipeline_id = ?', [pipelineId]);

    // Insert new stages
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const [stageResult] = await pool.execute(`
        INSERT INTO pipeline_stages (pipeline_id, stage_key, stage_name, stage_order, is_default, is_custom) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        pipelineId,
        column.key,
        column.label,
        i + 1,
        column.isDefault || false,
        !column.isDefault
      ]);

      const stageId = stageResult.insertId;

      // Insert hints for this stage
      if (column.hints) {
        const hintTypes = ['beginner', 'intermediate', 'expert'];
        for (const hintType of hintTypes) {
          if (column.hints[hintType]) {
            await pool.execute(`
              INSERT INTO pipeline_hints (stage_id, hint_type, hint_text) 
              VALUES (?, ?, ?)
            `, [stageId, hintType, column.hints[hintType]]);
          }
        }
      }
    }

    res.json({ message: 'Pipeline saved!' });
  } catch (error) {
    console.error('Save pipeline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/pipeline/all - fetch all pipelines with their stages
router.get('/all', async (req, res) => {
  try {
    const [pipelines] = await pool.execute(`SELECT id, name, description, is_default FROM pipelines`);
    const result = [];
    for (const pipeline of pipelines) {
      const [stages] = await pool.execute(`
        SELECT id, stage_key, stage_name, stage_order, is_default, is_custom
        FROM pipeline_stages
        WHERE pipeline_id = ?
        ORDER BY stage_order
      `, [pipeline.id]);
      result.push({
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        isDefault: pipeline.is_default,
        stages: stages.map(s => ({
          id: s.id,
          key: s.stage_key,
          label: s.stage_name,
          order: s.stage_order,
          isDefault: s.is_default,
          isCustom: s.is_custom
        }))
      });
    }
    res.json({ pipelines: result });
  } catch (error) {
    console.error('Get all pipelines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/pipeline/all - create a new pipeline with name and stages
router.post('/all', async (req, res) => {
  try {
    const { name, stages } = req.body;
    if (!name || !Array.isArray(stages) || stages.length === 0) {
      return res.status(400).json({ message: 'Name and stages are required' });
    }
    const [result] = await pool.execute(`
      INSERT INTO pipelines (name, is_default, created_by) VALUES (?, FALSE, 1)
    `, [name]);
    const pipelineId = result.insertId;
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      await pool.execute(`
        INSERT INTO pipeline_stages (pipeline_id, stage_key, stage_name, stage_order, is_default, is_custom)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        pipelineId,
        stage.key || stage.label.toLowerCase().replace(/ /g, ''),
        stage.label,
        i + 1,
        stage.isDefault || false,
        !stage.isDefault
      ]);
    }
    res.json({ message: 'Pipeline created!' });
  } catch (error) {
    console.error('Create pipeline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/pipeline/:id - get specific pipeline
router.get('/:id', async (req, res) => {
  try {
    const pipelineId = req.params.id;
    
    const [pipelines] = await pool.execute(`
      SELECT p.id, p.name, p.description, p.is_default 
      FROM pipelines p 
      WHERE p.id = ?
    `, [pipelineId]);

    if (pipelines.length === 0) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    // Get all stages for this pipeline
    const [stages] = await pool.execute(`
      SELECT ps.id, ps.stage_key, ps.stage_name, ps.stage_order, ps.is_default, ps.is_custom
      FROM pipeline_stages ps 
      WHERE ps.pipeline_id = ? 
      ORDER BY ps.stage_order
    `, [pipelineId]);

    // Get all hints for each stage
    const columns = [];
    for (const stage of stages) {
      const [hints] = await pool.execute(`
        SELECT ph.hint_type, ph.hint_text
        FROM pipeline_hints ph 
        WHERE ph.stage_id = ?
      `, [stage.id]);

      const hintsObj = {};
      hints.forEach(hint => {
        hintsObj[hint.hint_type] = hint.hint_text;
      });

      columns.push({
        key: stage.stage_key,
        label: stage.stage_name,
        hint: hintsObj.beginner || hintsObj.intermediate || hintsObj.expert || null,
        isDefault: stage.is_default,
        hints: hintsObj
      });
    }

    res.json({ 
      id: pipelines[0].id,
      name: pipelines[0].name,
      description: pipelines[0].description,
      isDefault: pipelines[0].is_default,
      columns 
    });
  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/pipeline/:id - rename a pipeline
router.put('/:id', async (req, res) => {
  try {
    const pipelineId = req.params.id;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    await pool.execute('UPDATE pipelines SET name = ? WHERE id = ?', [name, pipelineId]);
    res.json({ message: 'Pipeline renamed!' });
  } catch (error) {
    console.error('Rename pipeline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/pipeline/:id - delete a pipeline and its stages/hints
router.delete('/:id', async (req, res) => {
  try {
    const pipelineId = req.params.id;
    // Delete all stages (and cascade to hints)
    await pool.execute('DELETE FROM pipeline_stages WHERE pipeline_id = ?', [pipelineId]);
    // Delete the pipeline
    await pool.execute('DELETE FROM pipelines WHERE id = ?', [pipelineId]);
    res.json({ message: 'Pipeline deleted!' });
  } catch (error) {
    console.error('Delete pipeline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 