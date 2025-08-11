import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db';

const ProjectManager: React.FC = () => {
  const projects = useLiveQuery(() => db.projects.toArray());

  const handleCreateProject = async () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      try {
        // 1. Create folder on file system
        const result = await window.electronAPI.createProjectFolder(projectName);
        if (!result.success) {
          throw new Error(result.error);
        }

        // 2. Add project to database
        await db.projects.add({
          name: projectName,
          createdAt: new Date(),
        });

        alert(`Project "${projectName}" created successfully!`);
      } catch (error) {
        console.error('Failed to create project:', error);
        alert(`Error creating project: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h2>Projects</h2>
      <button onClick={handleCreateProject}>Create New Project</button>
      <ul>
        {projects?.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectManager;
