/**
 * Eros Status - Components Index
 * Export all core components for easy importing
 * Phase 3 - Game-like UI (floating windows, RPG panels)
 */

// Layout Components
export { ErosStatusApp, ErosStatusCompact } from './layout/ErosStatusApp';
export { GamePanel, GamePanelSection } from './layout/GamePanel';

// Status Components
export { StatusPanel } from './status/StatusPanel';
export { CompactStatusDisplay, CompactStatusInline } from './status/CompactStatusDisplay';
export { ProgressBar, CompactProgressBar } from './status/ProgressBar';

// Terminal Components - Phase 2.3 (legacy)
export { SummaryTerminal, SummaryTerminalCompact } from './terminal/SummaryTerminal';
export { TerminalFrame, TerminalFrameInline } from './terminal/TerminalFrame';

// Common Components
export { SlideOutPanel, SlideOutPanelSection, SlideOutPanelDivider } from './common/SlideOutPanel';
export { FloatingWindow, FloatingWindowInline } from './common/FloatingWindow';
export { StatCard, StatCardCompact, StatCardRow } from './common/StatCard';

// Navigation Components - Phase 2.2
export { CategoryTabs, CategoryTabsCompact, DEFAULT_CATEGORY_GROUPS } from './navigation/CategoryTabs';
export { CategoryButton, CategoryButtonGroup } from './navigation/CategoryButton';

// Detail Components - Phase 3.1
export { EnhancedCategoryDetail, createEnhancedCategoryData } from './detail/EnhancedCategoryDetail';
export { StateDisplayField } from './detail/StateDisplayField';
export { ExplanationField } from './detail/ExplanationField';
export { CharacterVoiceField, MultipleVoiceField } from './detail/CharacterVoiceField';
export { HistoryField, CompactHistoryField } from './detail/HistoryField';

// Types
export type { ErosStatusAppProps } from './layout/ErosStatusApp';
export type { GamePanelProps } from './layout/GamePanel';
export type { StatusPanelProps } from './status/StatusPanel';
export type { CompactStatusDisplayProps } from './status/CompactStatusDisplay';
export type { ProgressBarProps } from './status/ProgressBar';
export type { SlideOutPanelProps } from './common/SlideOutPanel';
export type { FloatingWindowProps } from './common/FloatingWindow';
export type { StatCardProps } from './common/StatCard';
export type { CategoryTabsProps, CategoryGroup } from './navigation/CategoryTabs';
export type { CategoryButtonProps } from './navigation/CategoryButton';
export type { SummaryTerminalProps } from './terminal/SummaryTerminal';
export type { TerminalFrameProps } from './terminal/TerminalFrame';

// Detail Types - Phase 3.1
export type { EnhancedCategoryDetailProps } from './detail/EnhancedCategoryDetail';
export type { StateDisplayFieldProps } from './detail/StateDisplayField';
export type { ExplanationFieldProps } from './detail/ExplanationField';
export type { CharacterVoiceFieldProps, MultipleVoiceFieldProps } from './detail/CharacterVoiceField';
export type { HistoryFieldProps, CompactHistoryFieldProps } from './detail/HistoryField';