import BuddyItem from '../BuddyItem';
import styles from './BuddyList.module.scss';

export default function BuddyList({
  buddies = [],
  selectedId,
  onSelect,
  onContextMenu,
  emptyText = 'No contacts yet',
}) {
  if (buddies.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }

  return (
    <div className={styles.list} role="listbox">
      {buddies.map((buddy) => (
        <BuddyItem
          key={buddy.id ?? buddy.name}
          buddy={buddy}
          selected={selectedId === buddy.id}
          onSelect={onSelect}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
}
