"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const ProjectContext = createContext<{
  activeIndex: number;
  selectProject: (index: number) => void;
} | null>(null);

export function ProjectProvider({
  children,
  initialIndex = 0,
}: {
  children: ReactNode;
  initialIndex?: number;
}) {
  const [activeIndex, selectProject] = useState(initialIndex);
  return (
    <ProjectContext.Provider value={{ activeIndex, selectProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProject must be used inside ProjectProvider");
  return context;
}
