import './styles.css';
import MainForm from './MainForm';

function App() {
  
  
  
  return (
    <div className="App">

      <header>  
        <h1>Keystroke Authoriser</h1>
      </header>
      <div className='main-container'>
        <main>
          <h1>Keystroke Biometrics and Classifier Testing</h1>

          <h2>How it Works:</h2>
          <p>This platform offers a unique opportunity to explore the world of keystroke dynamics and machine learning classifiers. Here's how you can make the most out of your experience:</p>
          <ol>
            <li>Enter a username and a secure password</li>
            <li>Select 'train' and enter 10 or more training samples before testing a classifier. As you type, your keystroke data will be analyzed, providing insights into your typing habits, helping build an understanding of your unique typing style.</li>
            <li>Once completed, select a classifier and submit a test sample. Your input will be processed, and you will be able to see whether you have been accurately classified, with an accuracy score for that classifier.</li>
            <li>Enter more training data to increase the accuracy of the classifier.</li>
          </ol>
          <div className='experiment'>
            <MainForm />
          </div>
        </main>
      </div>

      <footer>
        <span>Ore Benson @ 2023</span>
      </footer>

    </div>
  );
}

export default App;
