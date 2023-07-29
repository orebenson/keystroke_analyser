import './styles.css';
import MainForm from './MainForm';

function App() {
  
  
  
  return (
    <div className="App">

      <header>  
        <h1>Keystrokes</h1>
      </header>

      <main>
        <h1>Welcome to the Keystroke Biometrics and Classifier Testing Website!</h1>

        <h2>How it Works:</h2>
        <p>This platform offers a unique opportunity to explore the world of keystroke dynamics and machine learning classifiers. Here's how you can make the most out of your experience:</p>
        <p>1. Enter a username and a secure password</p>
        <p>2. Select 'train' and enter 10 or more training samples before testing a classifier. As you type, your keystroke data will be analyzed, providing insights into your typing habits, helping build an understanding of your unique typing style.</p>
        <p>3. Once completed, select a classifier and submit a test sample. Your input will be processed, and you will be able to see whether you have been accurately classified, with an accuracy score for that classifier.</p>
        <p>4. Enter more training data to increase the accuracy of the classifier.</p>
        <MainForm />
      </main>

      <footer>
        <span>Ore Benson @ 2023</span>
      </footer>

    </div>
  );
}

export default App;
