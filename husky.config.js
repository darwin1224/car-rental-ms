module.exports = {
  hooks: {
    'pre-commit': 'yarn format && yarn lint',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
