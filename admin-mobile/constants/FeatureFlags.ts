export const FeatureFlags = {
  DISABLE_AUTH: true, // Set to true to disable authentication
} as const;

// Type for the feature flags
export type FeatureFlags = typeof FeatureFlags; 