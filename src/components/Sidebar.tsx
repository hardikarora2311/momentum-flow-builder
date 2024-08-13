"use client";

import {
  getConfiguration,
  getDependencies,
  saveConfiguration,
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface DbConfig {
  username: string;
  password: string;
}

interface SidebarProps {
  selectedFlow: string;
  setSelectedFlow: (flow: string) => void;
}

export default function Sidebar({
  selectedFlow,
  setSelectedFlow,
}: SidebarProps) {
  const queryClient = useQueryClient();
  const { data: dependencies } = useQuery({
    queryKey: ["dependencies"],
    queryFn: () => getDependencies(selectedFlow),
  });

  const { data: configuration, refetch: refConfig } = useQuery({
    queryKey: ["configuration"],
    queryFn: () => getConfiguration(selectedFlow),
  });

  const [entitiesToMock, setEntitiesToMock] = useState<string[]>([]);
  const [isDbMocked, setIsDbMocked] = useState(false);
  const [dbConfig, setDbConfig] = useState<DbConfig>({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (configuration) {
      setEntitiesToMock(configuration.entities_to_mock);
      setIsDbMocked(configuration.is_db_mocked);
      setDbConfig(configuration.db_config);
    }
  }, [configuration]);

  const { mutate: saveMutation } = useMutation({
    mutationFn: saveConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
      alert("Configuration saved successfully!");
    },
  });

  const handleSave = async () => {
    saveMutation({
      flow: selectedFlow,
      entities_to_mock: entitiesToMock,
      is_db_mocked: isDbMocked,
      db_config: dbConfig,
    });
  };

  const flowOptions = [
    "POST /carts/{cart_id}",
    // "GET /carts/{cart_id}",
    // "PUT /carts/{cart_id}",
    // "DELETE /carts/{cart_id}",
  ];

  return (
    <div className="flex flex-col">
      <div className="w-96 bg-[#363636]  p-4 overflow-y-auto py-16">
        <h2 className="text-xl font-semibold mb-4">cart_campaign</h2>
        <div className="mb-4">
          <div className="flex items-center">
            <img src="/info.svg" className="inline mr-3" />
            <p>Last 2 commits scanned</p>
          </div>
          <div className="flex items-center">
            <img src="/info.svg" className="inline mr-3" />
            <p>5 entry points identified</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Selected flow</label>
          <select
            className="w-full bg-[#363636] border border-white p-2 rounded text-white cursor-pointer"
            value={selectedFlow}
            onChange={(e) => {
              setSelectedFlow(e.target.value);
              setTimeout(() => {
                refConfig();
              }, 2500);
            }}
          >
            {flowOptions.map((flow) => (
              <option key={flow} value={flow}>
                {flow}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <h3 className="font-normal mb-2">Dependencies</h3>
          <p className="text-sm mb-2 text-[#B7B7B7] ">
            Select the ones you want to mock
          </p>
          {dependencies &&
            dependencies.map((dep) => (
              <div key={dep} className="flex items-center justify-between mb-4">
                <div>
                  <input
                    type="checkbox"
                    id={dep}
                    checked={entitiesToMock.includes(dep)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEntitiesToMock([...entitiesToMock, dep]);
                      } else {
                        setEntitiesToMock(
                          entitiesToMock.filter((d) => d !== dep)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={dep}>{dep}</label>
                </div>
                <img src="/icon.svg" />
              </div>
            ))}
        </div>
        <div className="mb-4">
          <h3 className="font-normal mb-2">Databases</h3>
          <p className="text-sm mb-2 text-[#B7B7B7]">
            Select if you want to mock databases
          </p>
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              id="mock-db"
              checked={isDbMocked}
              onChange={(e) => setIsDbMocked(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="mock-db">I want to mock databases</label>
          </div>
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              id="no-mock-db"
              checked={!isDbMocked}
              onChange={(e) => setIsDbMocked(false)}
              className="mr-2"
            />
            <label htmlFor="no-mock-db">I don't want to mock databases</label>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-normal mb-4">Database Configurations</h3>
          <div className="relative bg-[#363636] rounded border border-[#FFAD62] mb-7">
            <label
              htmlFor="db-username"
              className="absolute bg-[#363636] -top-3 left-5 text-[#B7B7B7]"
            >
              Database User
            </label>
            <input
              type="text"
              id="db-username"
              value={dbConfig.username}
              disabled={isDbMocked}
              onChange={(e) =>
                setDbConfig({ ...dbConfig, username: e.target.value })
              }
              className="w-full bg-[#363636] p-3 rounded border-none focus-visible:outline-none "
            />
          </div>
          <div className="relative bg-[#363636] rounded border border-[#FFAD62]">
            <label
              htmlFor="db-password"
              className="absolute bg-[#363636] -top-3 left-5 text-[#B7B7B7]"
            >
              Database Password
            </label>
            <input
              type="password"
              id="db-password"
              value={dbConfig.password}
              disabled={isDbMocked}
              onChange={(e) =>
                setDbConfig({ ...dbConfig, password: e.target.value })
              }
              className="w-full bg-[#363636] p-3 rounded border-none focus-visible:outline-none"
            />
          </div>

          {/* <input
            type="text"
            placeholder="Database Hostname"
            value={dbConfig.hostname}
            onChange={(e) =>
              setDbConfig({ ...dbConfig, hostname: e.target.value })
            }
            className="w-full bg-gray-700 p-2 rounded mb-2"
          /> */}
        </div>
      </div>
      <div className="bg-[#363636] flex justify-end p-4 border-t border-[#595858] ">
        <button
          onClick={handleSave}
          className=" bg-[#009FF9] hover:bg-[#29a6ff] text-white py-2 px-5 rounded shadow-md"
        >
          Save
        </button>
      </div>
    </div>
  );
}
