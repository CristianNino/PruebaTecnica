import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import FinalizarCurso from './Componentes/FinalizarCurso';
import MostrarResultados from './Componentes/MostrarResultados';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar } from 'react-bootstrap';

function App(){
  return (
    <div className="container mt-5 ">
      <div className="text-bg-primary p-3 ">
      <h1 className="text-center mb-4">Instituto</h1>
      <BrowserRouter>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="mb-5">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className=" mr-auto ">
              <Nav.Link as={Link} to="/" className="text-white fs-5 " >Finalizar Curso</Nav.Link>
              <Nav.Link as={Link} to="mostrar/" className="text-white fs-5 " >Mostrar Resultados</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
          <Route index element={<FinalizarCurso />} />
          <Route path="mostrar/" element={<MostrarResultados />} />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
};

export default App;
