"use client";

import { useMemo } from "react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { getGraph, GraphNode } from "@/lib/api";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  Edge,
  MarkerType,
  Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import CustomNode from "./CustomNode";
import Topbar from "./Topbar";
import Bottombar from "./Bottombar";

interface NodeData extends Record<string, unknown> {
  label: string;
  dependentLibs: string[];
  params: string[];
  responseObject: string;
}

const initialViewport = {
  zoom: 0.7,
  x: 200,
  y: 400,
};

const nodeTypes = {
  custom: CustomNode,
};

interface FlowChartProps {
  selectedFlow: string;
}
const BtnComp = () => {
  return (
    <button className="bg-[#F27400] shadow-sm hover:bg-[#dc7310] text-white py-2 px-4 rounded">
      + Add Methods
    </button>
  );
};

export default function FlowChart({ selectedFlow }: FlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<any>>([]);

  // const onConnect = useCallback((connection: Connection) => {
  //   const edge = {
  //     ...connection,
  //     type: "straight",
  //     id: `${connection.source}-${connection.target}`,
  //   };
  //   setEdges((eds) => addEdge(edge, eds));
  // }, []);

  const { data: graphData } = useQuery({
    queryKey: ["graph"],
    queryFn: () => getGraph(selectedFlow),
  });

  useMemo(() => {
    if (graphData) {
      const newNodes: Node<NodeData>[] = [];
      const newEdges: Edge<any>[] = [];
      const levelWidth = 300;
      const nodeHeight = 200;
      const nodeWidth = 200;

      const processNode = (
        node: GraphNode,
        level: number,
        index: number,
        totalSiblings: number
      ) => {
        const x = level * (levelWidth + nodeWidth);
        const y = (index - (totalSiblings - 1) / 2) * nodeHeight * 1.5;
        newNodes.push({
          id: node.function,
          type: "custom",
          position: { x, y },
          data: {
            label: node.function,
            dependentLibs: node.params
              .map((p) => p.type)
              .filter((t): t is string => t !== null),
            params: node.params.map((p) => p.identifier),
            responseObject: node.response_object,
          },
        });

        node.children.forEach((child, childIndex) => {
          newEdges.push({
            id: `${node.function}-${child.function}`,
            source: node.function,
            target: child.function,
            type: "smoothstep",
            markerEnd: {
              type: MarkerType.Arrow,
            },
            style: { stroke: "#7C7C7C", strokeWidth: 3 },
          });
          processNode(child, level + 1, childIndex, node.children.length);
        });
      };

      graphData.forEach((rootNode, index) => {
        processNode(rootNode, 0, index, graphData.length);
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [graphData, setNodes, setEdges]);

  const proOptions = { hideAttribution: true };

  if (!graphData)
    return (
      <div className="flex justify-center items-center h-full w-full">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col h-screen w-full">
      <Topbar />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          // onConnect={onConnect}
          edges={edges}
          connectionLineType={ConnectionLineType.Straight}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          defaultViewport={initialViewport}
          proOptions={proOptions}
        >
          <Panel position="bottom-left">
            <BtnComp />
          </Panel>
          <Background
            gap={50}
            color="#181E25"
            variant={BackgroundVariant.Lines}
          />
        </ReactFlow>
      </div>
      <Bottombar />
    </div>
  );
}
