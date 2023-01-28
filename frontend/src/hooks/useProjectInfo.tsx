import { useEffect, useState } from 'react';
import api from '../api/api';

const useProjectInfo = () => {
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const { pathname } = window.location;
    const subs = pathname.split('/');
    const projectId = subs[subs.findIndex((p) => p === 'project') + 1];

    // TODO: new project info api to get name
    api.getProjects().then((data) => {
      const detail = data.filter((p) => p.id === projectId).at(0);
      if (detail) {
        setProjectId(projectId);
        setProjectName(detail.name);
      }
    });
  }, []);

  return { projectId, projectName };
};

export default useProjectInfo;
