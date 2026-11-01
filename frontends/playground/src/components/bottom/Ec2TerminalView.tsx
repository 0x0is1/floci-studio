'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useEc2SessionStore } from '@/store/ec2SessionStore';
import { useTheme } from '@/theme/ThemeProvider';
import { executeEc2Command } from '@/lib/api/flociClient';
import { Ec2TerminalHeader } from './Ec2TerminalHeader';
import { Ec2TerminalInput } from './Ec2TerminalInput';
import { LuPlay } from 'react-icons/lu';

export function Ec2TerminalView() {
  const { nodes, isDeployed, activeProjectId } = usePlaygroundStore();
  const { history, addCommand, clearHistory } = useEc2SessionStore();
  const { tokens } = useTheme();
  const execNodes = nodes.filter((n) => ['ec2', 'ecs'].includes(n.data.serviceType));
  const defaultPort = Number(execNodes[0]?.data?.config?.port) || 8080;

  const [port, setPort] = useState(defaultPort);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeNode = execNodes.find((n) => (n.data.config?.port || 8080) === port) || execNodes[0];
  const isInstanceRunning = Boolean(activeNode?.data?.status === 'running' || isDeployed);
  const ami = activeNode?.data?.config?.ami || activeNode?.data?.config?.image || '';
  const osName = ami.includes('ubuntu') ? 'Ubuntu 24.04 LTS' : ami.includes('debian') ? 'Debian 12' : ami.includes('alpine') ? 'Alpine Linux' : 'Amazon Linux 2023';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length]);

  const handleRun = async () => {
    const cmd = input.trim();
    if (!cmd || !isInstanceRunning) return;
    setInput('');
    const res = await executeEc2Command({ port, command: cmd, projectId: activeProjectId || undefined });
    addCommand({ id: String(Date.now()), prompt: res.prompt || 'container $', command: cmd, output: res.output });
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs transition-colors" style={{ backgroundColor: tokens.trayBg }}>
      <Ec2TerminalHeader
        port={port} setPort={setPort}
        execNodes={execNodes} isRunning={isInstanceRunning} onClear={clearHistory}
      />

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {!isInstanceRunning ? (
          <div className="p-6 text-center text-sm border border-dashed rounded-lg" style={{ borderColor: tokens.border, color: tokens.textMuted }}>
            <LuPlay className="w-6 h-6 mx-auto mb-2" style={{ color: tokens.textMuted }} />
            <p className="font-semibold" style={{ color: tokens.textSecondary }}>Container Offline / Standby</p>
            <p className="text-xs mt-1" style={{ color: tokens.textMuted }}>
              Click &quot;Deploy&quot; in the header to provision resources and connect live interactive terminal session.
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-3 text-xs" style={{ color: tokens.textMuted }}>
            Connected to {osName} runtime on port {port}. Ready for commands (e.g. uname -a, cat /etc/os-release).
          </div>
        ) : (
          history.map((h) => (
            <div key={h.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">{h.prompt}</span>
                <span style={{ color: tokens.textPrimary }}>{h.command}</span>
              </div>
              {h.output && (
                <pre className="p-2 rounded border whitespace-pre-wrap text-[11px]" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textSecondary }}>
                  {h.output}
                </pre>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <Ec2TerminalInput
        input={input} setInput={setInput}
        isInstanceRunning={isInstanceRunning} onRun={handleRun}
      />
    </div>
  );
}
