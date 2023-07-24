import styles from './stickyBottomModal.module.css';

export default function StickyBottomModal({children}) {
  return(
    <div className={styles.modalBottom}>
          {children}
    </div>
  )
};
