import { Handle, Position } from "@xyflow/react";
import React from "react";

interface NodeData extends Record<string, unknown> {
  label: string;
  dependentLibs: string[];
  params: string[];
  responseObject: string;
}

const extractFunName = (path: string) => {
  // Split by ':' to remove the function/method part
  const withoutMethod = path.split(":")[0];

  // Split by '/' and get the last part which is the filename
  const filename = withoutMethod.split("/").pop();

  return filename;
};
const CustomNode = ({ data }: { data: NodeData }) => (
  <div className="bg-[#181E25] rounded-md border border-[#FFAD62] w-96 min-h-44 ">
    <Handle type="source" position={Position.Right} />
    <div className="px-4 py-1 flex justify-between">
      <span>{extractFunName(data.label)}</span>
      <img src="/Group 23.svg" />
    </div>
    <div className="border-b border-[#FFAD62] w-full"></div>
    <div className="flex flex-col justify-evenly h-32 px-4 py-1">
      <span>{extractFunName(data.label)}</span>
      <div className="text-xs flex flex-col text-clip">
        <div className="my-1">
          <span className="text-[#FFAD62]">"DependentLibs"</span> :{" "}
          {data.dependentLibs.join(", ")}
        </div>
        <div className="my-1">
          <span className="text-[#FFAD62]">"Params"</span> :{" "}
          {JSON.stringify(data.params)}
        </div>
        <div className="my-1">
          <span className="text-[#FFAD62]">"ResponseObject"</span> :{" "}
          {data.responseObject == "" ? "null" : data.responseObject}
        </div>
      </div>
    </div>
    <Handle type="target" position={Position.Left} />
  </div>
);

export default CustomNode;
