'use client';

import React from 'react';
import { AwsServiceType } from '@/types/aws';
import { LuPlus } from 'react-icons/lu';
import { NodeTailAddMenu } from './NodeTailAddMenu';

interface Props {
  nodeId: string;
  serviceType: AwsServiceType;
  isHovered: boolean;
  showAddMenu: boolean;
  setShowAddMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NodeTailHandle({ nodeId, serviceType, isHovered, showAddMenu, setShowAddMenu }: Props) {
  const isVisible = isHovered || showAddMenu;

  return (
    <>
      {isVisible && (
        <>
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-6 h-[1.5px] bg-sky-500/40 pointer-events-none z-10" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddMenu((prev) => !prev);
            }}
            className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 p-0 m-0 inline-flex items-center justify-center shadow transition-all hover:scale-110 z-30 cursor-pointer nodrag"
            title="Add connected AWS resource"
          >
            <LuPlus className="w-2.5 h-2.5 stroke-[3] shrink-0 block" />
          </button>
        </>
      )}

      {showAddMenu && (
        <NodeTailAddMenu
          sourceId={nodeId}
          sourceType={serviceType}
          onClose={() => setShowAddMenu(false)}
        />
      )}
    </>
  );
}
