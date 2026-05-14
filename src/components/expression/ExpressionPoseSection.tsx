/**
 * Eros Status - ExpressionPoseSection Component
 * Combines expression, pose, AI prompt, and generation controls
 * Phase 3.3 - Expression/Pose Section
 */

import { ReactElement, memo, useState, useCallback } from 'react';
import { ExpressionData } from './ExpressionDisplay';
import { PoseData } from './PoseDisplay';
import { AIPromptDisplay } from './AIPromptDisplay';
import { TagBreakdownModal, Tag, TagCategory } from './TagBreakdownModal';
import { GenerateImageButton } from './GenerateImageButton';

export interface ExpressionPoseSectionProps {
    /** Current expression data */
    expression?: ExpressionData;
    /** Expression intensity (0-100) */
    intensity?: number;
    /** Current pose data */
    pose?: PoseData;
    /** Current AI prompt */
    aiPrompt?: string;
    /** Tags associated with current state */
    tags?: string[];
    /** Whether image generation API is available */
    isApiAvailable?: boolean;
    /** Whether image is being generated */
    isGenerating?: boolean;
    /** Generation progress (0-100) */
    progress?: number;
    /** Callback when generate is clicked */
    onGenerate?: () => void;
    /** Callback when tags are modified */
    onTagsChange?: (tags: Tag[]) => void;
    /** Additional CSS class names */
    className?: string;
}

/**
 * Convert string tags to Tag objects with categorization
 */
function categorizeTags(tags: string[]): Tag[] {
    // Define common tag patterns for categorization
    const patterns: Record<TagCategory, RegExp[]> = {
        Character: [
            /^(female|male|person|character|woman|man|girl|boy)/i,
            /(skin|hair|eye|age)/i
        ],
        Expression: [
            /(expression|face|smile|expression)/i,
            /^(happy|sad|angry|aroused|excited|embarrassed)/i
        ],
        Pose: [
            /(pose|posture|position|stance)/i,
            /^(standing|sitting|lying|kneeling)/i
        ],
        Clothing: [
            /(cloth|dress|shirt|pants|outfit|attire)/i,
            /^(naked|nude|clothed|underwear)/i
        ],
        Environment: [
            /(background|setting|location|environment|room)/i,
            /^(indoor|outdoor|bedroom|bathroom)/i
        ],
        Quality: [
            /(quality|resolution|style)/i,
            /^(detailed|high|low|realistic)/i
        ]
    };

    return tags.map(tagName => {
        let category: TagCategory = 'Quality'; // Default category

        for (const [cat, regexes] of Object.entries(patterns)) {
            if (regexes.some(regex => regex.test(tagName))) {
                category = cat as TagCategory;
                break;
            }
        }

        return {
            name: tagName,
            category,
            enabled: true
        };
    });
}

/**
 * ExpressionPoseSection Component
 * Main section combining all expression/pose components
 */
export function ExpressionPoseSection({
    expression,
    intensity = 50,
    pose,
    aiPrompt = '',
    tags = [],
    isApiAvailable = true,
    isGenerating = false,
    progress = 0,
    onGenerate,
    onTagsChange,
    className = ''
}: ExpressionPoseSectionProps): ReactElement {
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [localTags, setLocalTags] = useState<Tag[]>(categorizeTags(tags));

    // Update local tags when prop changes
    const syncedTags = useCallback(() => {
        if (tags.length > 0) {
            const categorized = categorizeTags(tags);
            // Preserve enabled states
            setLocalTags(prev => {
                const updated = [...categorized];
                prev.forEach((oldTag, index) => {
                    const newIndex = updated.findIndex(t => t.name === oldTag.name);
                    if (newIndex !== -1) {
                        updated[newIndex].enabled = oldTag.enabled;
                    }
                });
                return updated;
            });
        }
    }, [tags]);

    const handleOpenTagModal = useCallback(() => {
        syncedTags();
        setIsTagModalOpen(true);
    }, [syncedTags]);

    const handleCloseTagModal = useCallback(() => {
        setIsTagModalOpen(false);
    }, []);

    const handleToggleTag = useCallback((tagName: string, enabled: boolean) => {
        setLocalTags(prev => {
            const updated = prev.map(tag =>
                tag.name === tagName ? { ...tag, enabled } : tag
            );
            onTagsChange?.(updated);
            return updated;
        });
    }, [onTagsChange]);

    const handleCopyTags = useCallback(async () => {
        const enabledTags = localTags.filter(t => t.enabled).map(t => t.name);
        try {
            await navigator.clipboard.writeText(enabledTags.join(', '));
        } catch {
            // Fallback
        }
    }, [localTags]);

    const enabledTagCount = localTags.filter(t => t.enabled).length;

    return (
        <div className={`expression-pose-section ${className}`}>
            {/* Section Header */}
            <div className="section-header">
                <h2 className="section-title">Expression & Pose</h2>
                <span className="section-subtitle">AI Image Generation</span>
            </div>

            {/* Main Content Grid */}
            <div className="section-content">
                {/* Left Column - Expression & Pose */}
                <div className="content-left">
                    {/* Expression Display */}
                    {expression && (
                        <div className="expression-section">
                            <ExpressionDisplayWrapper
                                expression={expression}
                                intensity={intensity}
                            />
                        </div>
                    )}

                    {/* Pose Display */}
                    {pose && (
                        <div className="pose-section">
                            <PoseDisplayWrapper pose={pose} />
                        </div>
                    )}
                </div>

                {/* Right Column - AI Prompt & Actions */}
                <div className="content-right">
                    {/* AI Prompt Display */}
                    <div className="prompt-section">
                        <AIPromptDisplay
                            prompt={aiPrompt}
                            tagCount={enabledTagCount}
                            isLoading={isGenerating}
                            onViewTags={handleOpenTagModal}
                        />
                    </div>

                    {/* Generate Image Button */}
                    <div className="actions-section">
                        <GenerateImageButton
                            isApiAvailable={isApiAvailable}
                            isGenerating={isGenerating}
                            progress={progress}
                            onGenerate={onGenerate}
                            onCopyTags={handleCopyTags}
                            onViewTags={handleOpenTagModal}
                            hasTags={tags.length > 0}
                        />
                    </div>
                </div>
            </div>

            {/* Tag Breakdown Modal */}
            <TagBreakdownModal
                tags={localTags}
                isOpen={isTagModalOpen}
                onClose={handleCloseTagModal}
                onToggleTag={handleToggleTag}
            />
        </div>
    );
}

// Internal wrapper components for lazy loading / future enhancement
function ExpressionDisplayWrapper({
    expression,
    intensity
}: {
    expression: ExpressionData;
    intensity: number;
}): ReactElement {
    // Inline ExpressionDisplay for now
    return (
        <div className="expression-display">
            <div className="expression-display-header">
                <span className="expression-label">Expression</span>
            </div>
            <div className="expression-display-content">
                <div className="expression-image-placeholder">
                    <span className="expression-emoji">
                        {expression.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="expression-details">
                    <h3 className="expression-name">{expression.name}</h3>
                    <p className="expression-description">{expression.description}</p>
                    <div className="expression-intensity">
                        <div className="intensity-bar">
                            <div
                                className="intensity-fill"
                                style={{
                                    width: `${intensity}%`,
                                    backgroundColor: intensity > 60 ? 'var(--eros-arousal)' : 'var(--eros-success)'
                                }}
                            />
                        </div>
                        <span className="intensity-value">{intensity}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PoseDisplayWrapper({
    pose
}: {
    pose: PoseData;
}): ReactElement {
    // Inline PoseDisplay for now
    return (
        <div className="pose-display">
            <div className="pose-display-header">
                <span className="pose-label">Pose</span>
            </div>
            <div className="pose-display-content">
                <div className="pose-icon">
                    <span className="pose-emoji">🧍</span>
                </div>
                <div className="pose-details">
                    <h3 className="pose-name">{pose.name}</h3>
                    <p className="pose-description">{pose.description}</p>
                    {pose.modifiers && pose.modifiers.length > 0 && (
                        <div className="pose-modifiers">
                            <div className="modifiers-list">
                                {pose.modifiers.map((mod, i) => (
                                    <span key={i} className="modifier-tag">
                                        {mod.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * ExpressionPoseSection Skeleton - Loading state
 */
export function ExpressionPoseSectionSkeleton({
    className = ''
}: {
    className?: string;
}): ReactElement {
    return (
        <div className={`expression-pose-section-skeleton ${className}`}>
            <div className="skeleton-header" />
            <div className="skeleton-content">
                <div className="skeleton-left">
                    <div className="skeleton-expression" />
                    <div className="skeleton-pose" />
                </div>
                <div className="skeleton-right">
                    <div className="skeleton-prompt" />
                    <div className="skeleton-buttons" />
                </div>
            </div>
        </div>
    );
}

export default ExpressionPoseSection;