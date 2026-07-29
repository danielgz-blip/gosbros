"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Department = 'architecture' | 'design';

type DepartmentContextType = {
  department: Department;
  setDepartment: (dept: Department) => void;
};

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const [department, setDepartmentState] = useState<Department>('architecture');

  useEffect(() => {
    const saved = localStorage.getItem('gosbros-dept') as Department;
    if (saved === 'architecture' || saved === 'design') {
      setDepartmentState(saved);
    }
  }, []);

  const setDepartment = (dept: Department) => {
    setDepartmentState(dept);
    localStorage.setItem('gosbros-dept', dept);
  };

  return (
    <DepartmentContext.Provider value={{ department, setDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
}
