import { create } from 'zustand';
import { User } from '../types/user';

type AnnotationMode = 'highlight' | 'comment' | 'bookmark' | null;

interface Annotation {
  id: string;
  type: AnnotationMode;
  content: string;
  pageNumber: number;
  position: { x: number; y: number };
  color?: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  currentPDF: string | null;
  setCurrentPDF: (pdf: string | null) => void;
  annotationMode: AnnotationMode;
  setAnnotationMode: (mode: AnnotationMode) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  removeAnnotation: (id: string) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
}

interface Project {
  id: string;
  name: string;
  field: string;
  createdAt: Date;
  userId: string;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  currentPDF: null,
  setCurrentPDF: (pdf) => set({ currentPDF: pdf }),
  annotationMode: null,
  setAnnotationMode: (mode) => set({ annotationMode: mode }),
  annotations: [],
  addAnnotation: (annotation) =>
    set((state) => ({
      annotations: [
        ...state.annotations,
        { ...annotation, id: crypto.randomUUID() },
      ],
    })),
  removeAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
    })),
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
}));