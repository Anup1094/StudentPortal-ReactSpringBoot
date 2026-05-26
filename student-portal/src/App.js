import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [marks, setMarks] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch('http://localhost:8080/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  const addStudent = () => {
    if (!name || !email || !course || !marks) {
      alert('Please fill all fields!');
      return;
    }

    if (editId) {
      fetch(`http://localhost:8080/students/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, course, marks: parseFloat(marks) })
      }).then(() => {
        fetchStudents();
        setName(''); setEmail(''); setCourse(''); setMarks('');
        setEditId(null);
      });
    } else {
      fetch('http://localhost:8080/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, course, marks:  parseFloat(marks) })
      }).then(() => {
        fetchStudents();
        setName(''); setEmail(''); setCourse(''); setMarks('');
      });
    }
  };

  const deleteStudent = (id) => {
    fetch(`http://localhost:8080/students/${id}`, {
      method: 'DELETE'
    }).then(() => fetchStudents());
  };

  const editStudent = (s) => {
    setEditId(s.id);
    setName(s.name);
    setEmail(s.email);
    setCourse(s.course);
    setMarks(s.marks);
  };

  return (
    <div className="App">
      <h1>Student Management Portal</h1>

      <div className="form">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Course" value={course} onChange={e => setCourse(e.target.value)} />
        <input placeholder="Marks" value={marks} onChange={e => setMarks(e.target.value)} />
        <button onClick={addStudent}>{editId ? 'Update Student' : 'Add Student'}</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Marks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>{s.marks}</td>
              <td>
                <button className="edit-btn" onClick={() => editStudent(s)}>Edit</button>
                <button onClick={() => deleteStudent(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

