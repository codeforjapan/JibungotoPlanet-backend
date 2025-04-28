module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  // リモートエンドポイントに対するテストのためにタイムアウト時間を延長
  testTimeout: 30000,
  // テストの並列実行数を制限
  maxWorkers: '50%'
}
