import { useState } from "react";
import '../styles.css';

function PalettePicker() {

  const [selectedPalette, setSelectedPalette] = useState('default');
  const rootElement = document.documentElement;

  const colorPalettes = [
    {
      name: 'Cool Blue',
      value: 'cool-blue',
    },
    {
      name: 'Ocean Breeze',
      value: 'ocean-breeze',
    },
    {
      name: 'Warm Autumn',
      value: 'warm-autumn',
    },
    {
      name: 'Midnight Purple',
      value: 'midnight-purple',
    },
    {
      name: 'Deep Forest',
      value: 'deep-forest',
    },
    {
      name: 'Charcoal Orange',
      value: 'charcoal-orange',
    },
    {
      name: 'Violet Contrast',
      value: 'violet-contrast',
    },
    {
      name: 'Mystic Orchid',
      value: 'mystic-orchid',
    },
    {
      name: 'Cool Aqua',
      value: 'cool-aqua',
    },
    {
      name: 'Golden Sunset',
      value: 'golden-sunset',
    },
    {
      name: 'Stormy Sea',
      value: 'stormy-sea',
    },
  ];
  

  const handlePaletteChange = (event) => {
    const selectedPaletteValue = event.target.value;
    rootElement.setAttribute('data-color-palette', selectedPaletteValue);
    setSelectedPalette(selectedPaletteValue);
  };


  return (
    <div className="PalettePicker">
      <select value={selectedPalette} onChange={handlePaletteChange}>
        {colorPalettes.map((palette) => (
          <option key={palette.value} value={palette.value}>
            {palette.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PalettePicker;
