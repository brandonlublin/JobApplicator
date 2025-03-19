import { useState } from 'react';
import axios from 'axios';
import styles from './Modal.module.css';
import JobForm from '../JobForm/JobForm';

const Modal = ({ isOpen, onClose, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add a Job</h2>
        <JobForm onSubmit={onApply} onClose={onClose}/>
        <button type="button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Modal;
