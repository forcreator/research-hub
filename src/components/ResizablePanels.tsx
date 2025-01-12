import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from 'react-resizable-panels';

interface ResizablePanelsProps {
  children: React.ReactNode[];
}

export function ResizablePanels({ children }: ResizablePanelsProps) {
  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel defaultSize={20} minSize={15}>
        {children[0]}
      </Panel>
      <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-500 transition-colors" />
      <Panel defaultSize={45} minSize={30}>
        {children[1]}
      </Panel>
      <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-500 transition-colors" />
      <Panel defaultSize={35} minSize={25}>
        {children[2]}
      </Panel>
    </PanelGroup>
  );
} 