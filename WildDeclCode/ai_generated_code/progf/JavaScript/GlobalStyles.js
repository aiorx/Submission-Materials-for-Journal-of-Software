import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary-blue: #007bff;
    --primary-blue-dark: #0056b3;
    --primary-blue-light: #e6f2ff;
    --secondary-green: #28a745;
    --secondary-green-dark: #1e7e34;
    --accent-yellow: #ffc107;
    --accent-red: #dc3545;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --text-light: #f8f9fa;
    --background: #f8f9fa;
    --card-bg: #ffffff;
    --border: #dee2e6;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    --font-h1: 24px;
    --font-h2: 20px;
    --font-body: 16px;
    --font-caption: 14px;
    --font-small: 12px;
    
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --radius-full: 50%;
    
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  
  body {
    background-color: var(--background);
    color: var(--text-primary);
  }
  
  a {
    text-decoration: none;
    color: var(--primary-blue);
  }
  
  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
  }

  .btn-primary {
    background-color: var(--primary-blue);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-blue-dark);
  }
  
  .btn-secondary {
    background-color: var(--text-secondary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-secondary:hover {
    filter: brightness(90%);
  }
  
  .btn-success {
    background-color: var(--secondary-green);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-success:hover {
    background-color: var(--secondary-green-dark);
  }
  
  .btn-danger {
    background-color: var(--accent-red);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-danger:hover {
    filter: brightness(90%);
  }
  
  .card {
    background-color: var(--card-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-sm);
  }

  .status-pill {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: var(--font-small);
    font-weight: 500;
  }

  .status-pending {
    background-color: var(--accent-yellow);
    color: #212529;
  }

  .status-processing {
    background-color: var(--primary-blue);
    color: white;
  }

  .status-delivered {
    background-color: var(--secondary-green);
    color: white;
  }

  .status-cancelled {
    background-color: var(--accent-red);
    color: white;
  }
  
  .form-group {
    margin-bottom: var(--spacing-md);
  }
  
  .form-label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: var(--font-body);
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th, .table td {
    padding: var(--spacing-sm);
    border-bottom: 1px solid var(--border);
    text-align: left;
  }
  
  .table th {
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .table tr:hover {
    background-color: var(--primary-blue-light);
  }

  .icon-button {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .icon-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

// Componentes de estilo reutilizáveis
export const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

export const PrimaryButton = styled(Button)`
  background-color: var(--primary-blue);
  color: white;
  &:hover {
    background-color: var(--primary-blue-dark);
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: white;
  color: var(--primary-blue);
  border: 1px solid var(--primary-blue);
  &:hover {
    background-color: var(--primary-blue-light);
  }
`;

export const DangerButton = styled(Button)`
  background-color: var(--accent-red);
  color: white;
  &:hover {
    filter: brightness(90%);
  }
`;

// Aided with basic GitHub coding tools