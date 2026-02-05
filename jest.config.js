module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    // uuid v13+ は ESM のみのため、ts-jest でトランスパイル
    'node_modules/uuid/.+\\.js$': 'ts-jest'
  },
  // uuid v13+ は ESM のみのため、トランスパイル対象に含める
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid)/)'
  ],
  // リモートエンドポイントに対するテストのためにタイムアウト時間を延長
  testTimeout: 60_000,
  // テストの並列実行数を制限
  maxWorkers: '50%',
  // 空のテストスイートを許可（動的テスト生成のため）
  passWithNoTests: true
}
