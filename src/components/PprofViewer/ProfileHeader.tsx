// No direct React import needed - using JSX
import type { ProfileHeaderProps } from './types';
import styles from './PprofViewer.module.css';

export function ProfileHeader({
  sampleTypes,
  selectedSampleType,
  onSampleTypeChange,
  searchValue,
  onSearchChange,
  currentFocus,
  focusStats,
  headerStyle,
  className,
}: ProfileHeaderProps) {
  const isCompact = headerStyle === 'compact';

  const headerClass = isCompact ? styles.headerCompact : styles.header;
  const rowClass = isCompact ? styles.headerRowCompact : styles.headerRow;
  const selectClass = isCompact ? styles.selectCompact : styles.select;
  const inputClass = isCompact ? styles.inputCompact : styles.input;
  const focusInfoClass = isCompact ? styles.focusInfoCompact : styles.focusInfo;
  const focusStatsClass = isCompact ? styles.focusStatsCompact : styles.focusStats;

  return (
    <div className={`${headerClass} ${className || ''}`}>
      <div className={rowClass}>
        <select
          className={selectClass}
          value={selectedSampleType}
          onChange={(e) => onSampleTypeChange(parseInt(e.target.value))}
        >
          {sampleTypes.map((type) => (
            <option key={type.index} value={type.index}>
              {type.typeName} ({type.unitName})
            </option>
          ))}
        </select>
        <input
          type="text"
          className={inputClass}
          placeholder="Filter functions..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className={rowClass}>
        <div className={focusInfoClass} title={currentFocus || 'No function selected'}>
          {currentFocus || 'All functions'}
        </div>
        <div className={focusStatsClass}>
          {focusStats || ''}
        </div>
      </div>
    </div>
  );
}