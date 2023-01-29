import { useEffect, useState } from 'react';
import api from '../api/api';

const useProjectInfo = () => {
  const { pathname } = window.location;
  const subs = pathname.split('/');
  const projectId = subs[subs.findIndex((p) => p === 'project') + 1];
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    // TODO: new project info api to get name
    api.getProjects().then((data) => {
      const detail = data.filter((p) => p.id === projectId).at(0);
      if (detail) {
        setProjectName(detail.name);
      }
    });
  }, []);

  return { projectId, projectName };
};

export default useProjectInfo;
