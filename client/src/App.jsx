import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

import { ThemeProvider } from './components/theme/theme-provider';
import { ModeToggle } from './components/theme/mode-toggle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className='bottom-7 right-7 fixed z-50'>
          <ModeToggle />
        </div>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/home/:email/:content' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;