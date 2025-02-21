/*
This is the file that handles how the graph is displayed from the inputted job titles
*/

import React, { useCallback, useLayoutEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const CareerPathVisual = ({ pathResult, pathType }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const edgeArrowSize = 15;
  
  const isCountType = pathType === 'count';
  const unitLabel = isCountType ? 'people' : 'months';

  const processPathData = useCallback(() => {
    if (!pathResult) return { nodes: [], edges: [] };

    const uniqueNodes = new Map();
    const processedEdges = [];
    const nodesByLevel = new Map(); // Track nodes at each level

    const pathTotals = pathResult.map(path => ({
      total: path.segments.reduce((sum, segment) => sum + segment.relationship.value, 0),
      segments: path.segments.map(segment => 
        `${segment.start.title} → ${segment.end.title} (${segment.relationship.value} ${unitLabel})`
      )
    }));

    // First, identify all nodes and their levels
    const startJob = pathResult[0].start.title;
    const endJob = pathResult[0].end.title;
    
    // Initialize level tracking
    pathResult.forEach(path => {
      let currentLevel = 0;
      
      // Add start node
      if (!nodesByLevel.has(currentLevel)) {
        nodesByLevel.set(currentLevel, new Set());
      }
      nodesByLevel.get(currentLevel).add(path.start.title);
      
      // Process intermediate nodes
      path.segments.forEach((segment, index) => {
        currentLevel = index + 1;
        if (!nodesByLevel.has(currentLevel)) {
          nodesByLevel.set(currentLevel, new Set());
        }
        nodesByLevel.get(currentLevel).add(segment.end.title);
      });
    });

    // Calculate positions based on level information
    const xSpacing = 250;
    const ySpacing = 120; // Increased spacing between nodes

    // Function to position nodes at each level
    const getNodePosition = (nodeTitle, level) => {
      const nodesAtLevel = Array.from(nodesByLevel.get(level));
      const nodeIndex = nodesAtLevel.indexOf(nodeTitle);
      const totalNodesAtLevel = nodesAtLevel.length;
      
      // Center the nodes vertically
      const totalHeight = (totalNodesAtLevel - 1) * ySpacing;
      const startY = -totalHeight / 2;
      
      return {
        x: level * xSpacing,
        y: startY + (nodeIndex * ySpacing)
      };
    };

    // Create nodes with calculated positions
    pathResult.forEach((path) => {
      let level = 0;
      
      // Process start node
      if (!uniqueNodes.has(path.start.title)) {
        uniqueNodes.set(path.start.title, {
          id: path.start.title,
          position: getNodePosition(path.start.title, level),
          data: { label: path.start.title },
          className: `rounded-full px-4 py-2 text-center font-medium border-2 bg-blue-200 border-blue-400`,
        });
      }

      // Process all segments
      path.segments.forEach((segment) => {
        level++;
        
        if (!uniqueNodes.has(segment.end.title)) {
          const nodeStyle = segment.end.title === endJob 
            ? 'bg-red-200 border-red-400'
            : 'bg-yellow-200 border-yellow-400';

          uniqueNodes.set(segment.end.title, {
            id: segment.end.title,
            position: getNodePosition(segment.end.title, level),
            data: { label: segment.end.title },
            className: `rounded-full px-4 py-2 text-center font-medium border-2 ${nodeStyle}`,
          });
        }

        // Create edge
        processedEdges.push({
          id: `${path.start.title}-${segment.end.title}-${level}`,
          source: level === 1 ? path.start.title : path.segments[level-2].end.title,
          target: segment.end.title,
          label: `${segment.relationship.value} ${unitLabel}`,
          type: 'default',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: edgeArrowSize,
            height: edgeArrowSize,
          },
          className: 'text-gray-600',
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        });
      });
    });

    return {
      nodes: Array.from(uniqueNodes.values()),
      edges: processedEdges,
      pathTotals,
    };
  }, [pathResult, pathType, unitLabel]);

  useLayoutEffect(() => {
    const { nodes: newNodes, edges: newEdges } = processPathData();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [pathResult, processPathData, setNodes, setEdges]);

  const { pathTotals } = processPathData();

  if (!pathResult) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {pathTotals.map((path, index) => (
          <div key={index} className="text-gray-700 leading-relaxed">
            • <strong>Path {index + 1}:</strong><span className="ml-2">{path.total} {unitLabel} total</span>
          </div>
        ))}
      </div>

      <div className="h-[600px] w-full bg-white rounded-lg border border-gray-200"> {/* Increased height */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
          className="bg-white"
          defaultViewport={{ zoom: 1 }}
        >
          <Background color="#f1f5f9" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CareerPathVisual;