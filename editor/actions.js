import { createAliasedAction } from 'electron-redux';

export const importGithubProjects = createAliasedAction(
  'IMPORT_GITHUB_PROJECTS', // unique identifier
  () => ({
    type: 'IMPORT_GITHUB_PROJECTS',
    payload: 'lol',
  })
);
