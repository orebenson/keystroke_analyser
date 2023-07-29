import './styles.css';
import MainForm from './MainForm';

function App() {
  
  
  
  return (
    <div className="App">

      <header>  
        <h1>Keystrokes</h1>
      </header>

      <main>
        <p>This is the description of the keystroke app</p>
        <p>Enter 10 or more training samples before using a classifier</p>

        <MainForm />
      </main>

      <footer>
        <span>Ore Benson @ 2023</span>
      </footer>

    </div>
  );
}

export default App;
