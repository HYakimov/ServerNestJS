import React, { useEffect, useState } from 'react';
import '../styles/FormComponent.css';
import { FormData } from '../App';

interface FormComponentProps {
  editFormData?: FormData | null;
  refreshTableOnSubmit: () => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ editFormData, refreshTableOnSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: '',
    score: '',
    id: ''
  });

  useEffect(() => {
    if (editFormData) {
      setFormData(editFormData);
    }
  }, [editFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({ firstName: '', lastName: '', age: '', score: '', id: '' });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.id != '') {
      await updateData();
    } else {
      await submitNewData();
    }
    setFormData({ firstName: '', lastName: '', age: '', score: '', id: '' });
    refreshTableOnSubmit();
  }

  const updateData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/data/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const submitNewData = async () => {
    try {
      const response = await fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <h2>Form</h2>
      </div>
      <div>
        <label className="label">First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label className="label">Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label className="label">Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label className="label">Score:</label>
        <input type="number" name="score" value={formData.score} onChange={handleChange} required className="input" />
      </div>
      <div className='btn-container'>
        <button type="submit" className="button">Submit</button>
        <button className="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default FormComponent;