'use client';

import React, { useRef, useEffect } from 'react';
import { AwsServiceType, AwsPaletteItem } from '@/types/aws';
import { getValidNextTargets } from '@/lib/rules/validTargets';
import { validateAwsConnection } from '@/lib/rules/connectionMatrix';
import { usePlaygroundStore, AppNode, AppEdge } from '@/store/playgroundStore';
import { AwsIcon } from '@/components/icons/AwsIcons';
import { LuX } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  sourceId: string;
  sourceType: AwsServiceType;
  onClose: () => void;
}

export function NodeTailAddMenu({ sourceId, sourceType, onClose }: Props) {
  const validTargets = getValidNextTargets(sourceType);
  const { nodes, edges, setNodes, setEdges, selectNode } = usePlaygroundStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [onClose]);

  const handleSelect = (item: AwsPaletteItem) => {
    const sourceNode = nodes.find((n) => n.id === sourceId);
    if (!sourceNode) return;
    const existingOutEdges = edges.filter((e) => e.source === sourceId);
    const yOffset = (existingOutEdges.length - 0.5) * 80;
    const position = { x: sourceNode.position.x + 260, y: sourceNode.position.y + yOffset };
    const uuid = crypto.randomUUID();
    const newNode: AppNode = {
      id: `${item.type}-${uuid.slice(0, 8)}`,
      type: 'custom',
      position,
      data: { serviceType: item.type, label: item.name, status: 'draft', config: { ...item.defaultConfig, uuid } },
    };
    const validation = validateAwsConnection(sourceType, item.type);
    const newEdge: AppEdge = { id: `e-${sourceId}-${newNode.id}`, source: sourceId, target: newNode.id, type: 'custom', data: validation.defaultData };
    setNodes([...nodes, newNode]); setEdges([...edges, newEdge]); selectNode(newNode.id);
    toast.success('Architecture Branched', { description: `Added ${item.name} and auto-configured connection.` });
    onClose();
  };

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute left-[calc(100%+44px)] top-0 z-[1000] w-56 rounded-lg border border-sky-500/40 bg-[#0f172a] shadow-2xl shadow-black/90 p-1.5 space-y-1 text-xs select-none backdrop-blur-md"
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-2 py-1 text-[10px] text-slate-400 font-mono">
        <span className="uppercase font-semibold tracking-wider text-sky-400">Next Valid AWS Nodes</span>
        <button onClick={onClose} className="p-0.5 hover:text-slate-200 cursor-pointer"><LuX className="w-3 h-3" /></button>
      </div>
      <div className="max-h-60 overflow-y-auto space-y-1">
        {validTargets.map((item) => (
          <button
            key={item.type}
            onClick={() => handleSelect(item)}
            className="flex items-center gap-2.5 w-full p-1.5 rounded hover:bg-slate-800/80 text-left transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded border border-slate-700 bg-slate-900 flex items-center justify-center p-0.5 shrink-0 group-hover:border-sky-500">
              <AwsIcon type={item.type} size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-200 truncate group-hover:text-sky-400">{item.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{item.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
