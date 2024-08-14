"use client";

import { useEffect, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { getGraph, GraphNode } from "@/lib/api";
import {
  Background,
  BackgroundVariant,
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
import { Loader2 } from "lucide-react";

interface NodeData extends Record<string, unknown> {
  label: string;
  dependentLibs: string[];
  params: string[];
  responseObject: string;
}

const initialViewport = {
  zoom: 0.7,
  x: 200,
  y: -600,
};

const nodeTypes = {
  custom: CustomNode,
};

// interface FlowChartProps {
//   selectedFlow: string;
// }
const BtnComp = () => {
  return (
    <button className="bg-[#F27400] shadow-sm hover:bg-[#dc7310] text-white py-2 px-4 rounded">
      + Add Methods
    </button>
  );
};

export default function FlowChart() {
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

  const { data: graphData, isLoading } = useQuery({
    queryKey: ["graph"],
    queryFn: () => getGraph(),
  });

  useEffect(() => {
    if (graphData) {
      const newNodes: Node<NodeData>[] = [];
      const newEdges: Edge<any>[] = [];
      const levelWidth = 300;
      const nodeHeight = 200;
      const nodeWidth = 300;
      const verticalSpacing = 100; // Vertical space between nodes

      // const calculateTotalHeight = (node: GraphNode): number => {
      //   if (node.children.length === 0) return nodeHeight;
      //   return node.children.reduce(
      //     (total, child) => total + calculateTotalHeight(child),
      //     0
      //   );
      // };
      const calculateTotalHeight = (node: GraphNode): number => {
        if (node.children.length === 0) return nodeHeight;
        return (
          node.children.reduce(
            (total, child) => total + calculateTotalHeight(child),
            0
          ) +
          (node.children.length - 1) * verticalSpacing
        );
      };

      const processNode = (
        node: GraphNode,
        level: number,
        startY: number
      ): number => {
        const x = level * (levelWidth + nodeWidth);
        const totalHeight = calculateTotalHeight(node);
        const y = startY + totalHeight / 2 - nodeHeight / 2;

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

        let childStartY = startY;
        node.children.forEach((child) => {
          newEdges.push({
            id: `${node.function}-${child.function}`,
            source: node.function,
            target: child.function,
            type: "step",
            markerEnd: {
              type: MarkerType.Arrow,
            },
            style: { stroke: "#7C7C7C", strokeWidth: 3 },
          });
          const childHeight = processNode(child, level + 1, childStartY);
          childStartY += childHeight + verticalSpacing;
        });

        return totalHeight;
      };

      let startY = 0;
      graphData.forEach((rootNode) => {
        const rootHeight = processNode(rootNode, 0, startY);
        startY += rootHeight + verticalSpacing;
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [graphData, setNodes, setEdges]);

  //     const processNode = (
  //       node: GraphNode,
  //       level: number,
  //       index: number,
  //       totalSiblings: number

  //       // parentY: number, //new
  //       // siblingsHeight: number //new
  //     ) => {
  //       const x = level * (levelWidth + nodeWidth);
  //       const y = (index - (totalSiblings - 1) / 2) * nodeHeight * 2;
  //       // const y = parentY + siblingsHeight / 2 + index * (nodeHeight + siblingGap);
  //       newNodes.push({
  //         id: node.function,
  //         type: "custom",
  //         position: { x, y },
  //         data: {
  //           label: node.function,
  //           dependentLibs: node.params
  //             .map((p) => p.type)
  //             .filter((t): t is string => t !== null),
  //           params: node.params.map((p) => p.identifier),
  //           responseObject: node.response_object,
  //         },
  //       });

  //       const totalChildrenHeight = calculateTotalHeight(node); // new

  //       node.children.forEach((child, childIndex) => {
  //         newEdges.push({
  //           id: `${node.function}-${child.function}`,
  //           source: node.function,
  //           target: child.function,
  //           type: "step",
  //           markerEnd: {
  //             type: MarkerType.Arrow,
  //           },
  //           style: { stroke: "#7C7C7C", strokeWidth: 3 },
  //         });
  //         processNode(child, level + 1, childIndex, node.children.length);
  //         // processNode(child, level + 1, childIndex, y - totalChildrenHeight / 2, totalChildrenHeight); //new
  //       });
  //     };

  //     const rootX = 0; // Root nodes start at level 0
  //     const canvasHeight = 100; // Assume a canvas height of 800px for centering
  //     const rootY = canvasHeight / 2; // Center root nodes vertically

  //     graphData.forEach((rootNode, index) => {
  //       processNode(rootNode, 0, index, graphData.length);
  //       //   const rootTotalHeight = calculateTotalHeight(rootNode);
  //       // processNode(rootNode, rootX, index, rootY, rootTotalHeight);
  //     });

  //     setNodes(newNodes);
  //     setEdges(newEdges);
  //   }
  // }, [graphData, setNodes, setEdges]);

  const proOptions = { hideAttribution: true };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-full w-full">
        <Loader2 className="animate-spin size-9 mb-3" />
        <h3>Getting Workflow...</h3>
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
            gap={55}
            style={{ opacity: 0.1 }}
            // color="#181E25"
            color="#FFAD62"
            variant={BackgroundVariant.Lines}
          />
        </ReactFlow>
      </div>
      <Bottombar />
    </div>
  );
}
