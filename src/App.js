import React, { useState, createContext, useContext, useMemo, useCallback } from 'react';
import './App.css';

// Create a context to manage the color palette
const ColorContext = createContext();

// Helper function to generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Custom hook: useColorPalette
const useColorPalette = () => {
  const [colors, setColors] = useState(['#ff5733', '#33ff57', '#5733ff']);
  const [selectedColor, setSelectedColor] = useState(null);

  // Using useCallback to memoize the functions
  const addColor = useCallback(() => {
    setColors((prevColors) => [...prevColors, getRandomColor()]);
  }, []);

  const removeColor = useCallback((index) => {
    setColors((prevColors) => prevColors.filter((_, i) => i !== index));
    if (selectedColor === index) {
      setSelectedColor(null);
    } else if (selectedColor > index) {
      setSelectedColor(selectedColor - 1);
    }
  }, [selectedColor]);

  const selectColor = useCallback((index) => {
    setSelectedColor(index);
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    colors,
    selectedColor,
    addColor,
    removeColor,
    selectColor,
  }), [colors, selectedColor, addColor, removeColor, selectColor]);

  return contextValue;
};

// ColorPalette component to display and customize the color palette
const ColorPalette = () => {
  const { colors, selectedColor, selectColor, removeColor } = useContext(ColorContext);

  return (
    <div className="color-palette">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`color-box ${selectedColor === index ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => selectColor(index)}
        >
          <button onClick={(e) => { e.stopPropagation(); removeColor(index); }}>Remove</button>
        </div>
      ))}
    </div>
  );
};

// ColorControls component to add new colors to the palette
const ColorControls = () => {
  const { addColor } = useContext(ColorContext);

  return (
    <div className="color-controls">
      <button onClick={addColor}>Add Color</button>
    </div>
  );
};

// App component using the ColorProvider and rendering ColorPalette and ColorControls
const App = () => {
  // Use the custom hook only once
  const paletteContext = useColorPalette();

  // Display selected color or fallback to default message
  const displayColor = paletteContext.selectedColor !== null 
    ? `Selected Color: ${paletteContext.colors[paletteContext.selectedColor]}` // Shows the hex value of the selected color
    : 'Color Palette Manager';

  return (
    <ColorContext.Provider value={paletteContext}>
      <div className="app">
        <h1>{displayColor}</h1>
        <ColorPalette />
        <ColorControls />
      </div>
    </ColorContext.Provider>
  );
};

export default App;
