import React, { useEffect, useState } from 'react';
import './style.css';
import { FaUser } from 'react-icons/fa';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [newCliente, setNewCliente] = useState({
    documentoCliente: '',
    nombreCompleto: '',
    celular: '',
    fechaNacimiento: ''
  });
  const [editingCliente, setEditingCliente] = useState(null);

  // Obtener clientes
  const getClientes = async () => {
    try {
      const response = await fetch('/api/clientes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Error al cargar los clientes');
    }
  };

  // Agregar o editar cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingCliente ? 'PUT' : 'POST';
      const endpoint = editingCliente ? `/api/clientes/${editingCliente._id}` : '/api/clientes';

      await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCliente)
      });

      setEditingCliente(null);
      getClientes();
      setNewCliente({ documentoCliente: '', nombreCompleto: '', celular: '', fechaNacimiento: '' });
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar el cliente');
    }
  };

  // Editar cliente
  const editCliente = (cliente) => {
    setNewCliente(cliente);
    setEditingCliente(cliente);
  };

  // Eliminar cliente
  const deleteCliente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await fetch(`/api/clientes/${id}`, {
          method: 'DELETE'
        });
        getClientes();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  useEffect(() => {
    getClientes();
  }, []);

  return (
    <div className="container">
      <h1>
        <FaUser className="icon" />
        Clientes
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Documento"
          value={newCliente.documentoCliente}
          onChange={(e) => setNewCliente({ ...newCliente, documentoCliente: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Nombre Completo"
          value={newCliente.nombreCompleto}
          onChange={(e) => setNewCliente({ ...newCliente, nombreCompleto: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Celular"
          value={newCliente.celular}
          onChange={(e) => setNewCliente({ ...newCliente, celular: e.target.value })}
          required
        />
        <input
          type="date"
          value={newCliente.fechaNacimiento}
          onChange={(e) => setNewCliente({ ...newCliente, fechaNacimiento: e.target.value })}
          required
        />
        <button type="submit">{editingCliente ? 'Actualizar Cliente' : 'Agregar Cliente'}</button>
      </form>

      <ul>
        {clientes.map(cliente => (
          <li key={cliente._id}>
            <strong>Nombre:</strong> {cliente.nombreCompleto} <br />
            <strong>Documento:</strong> {cliente.documentoCliente} <br />
            <strong>Celular:</strong> {cliente.celular} <br />
            <strong>Fecha de Nacimiento:</strong> {new Date(cliente.fechaNacimiento).toLocaleDateString()} <br />
            <div className="button-container">
              <button onClick={() => editCliente(cliente)}>Editar</button>
              <button onClick={() => deleteCliente(cliente._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
