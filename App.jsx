import React, { useState, useEffect } from 'react';

function ConverterApp() {
 
  const [currencyAmount, setCurrencyAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencyResult, setCurrencyResult] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tempInput, setTempInput] = useState(0);
  const [tempUnit, setTempUnit] = useState('C_TO_F');
  const [tempResult, setTempResult] = useState(32);

 
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        if (!response.ok) throw new Error('Failed to fetch exchange rates.');
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setExchangeRate(rate);
        setCurrencyResult(currencyAmount * rate);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRates();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate) {
      setCurrencyResult(currencyAmount * exchangeRate);
    }
  }, [currencyAmount, exchangeRate]);

  useEffect(() => {
    const input = parseFloat(tempInput);
    if (isNaN(input)) {
      setTempResult('');
      return;
    }
    if (tempUnit === 'C_TO_F') {
      setTempResult((input * 9) / 5 + 32);
    } else {
      setTempResult(((input - 32) * 5) / 9);
    }
  }, [tempInput, tempUnit]);


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      {/* CURRENCY CONVERTER */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginTop: 0 }}>💱 Currency Converter</h2>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input 
            type="number" 
            value={currencyAmount} 
            onChange={(e) => setCurrencyAmount(Number(e.target.value))} 
            style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
          <span style={{ alignSelf: 'center' }}>to</span>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
        {loading ? <p>Loading rates...</p> : <h3 style={{ color: '#2c3e50', margin: 0 }}>{currencyAmount} {fromCurrency} = {currencyResult.toFixed(2)} {toCurrency}</h3>}
      </section>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

      {/* UNIT CONVERTER */}
      <section>
        <h2 style={{ marginTop: 0 }}>🌡️ Temperature Converter</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input 
            type="number" 
            value={tempInput} 
            onChange={(e) => setTempInput(e.target.value)} 
            style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select value={tempUnit} onChange={(e) => setTempUnit(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="C_TO_F">Celsius (°C) to Fahrenheit (°F)</option>
            <option value="F_TO_C">Fahrenheit (°F) to Celsius (°C)</option>
          </select>
        </div>
        <h3 style={{ color: '#27ae60', margin: 0 }}>Result: {tempResult !== '' ? Number(tempResult).toFixed(1) : '0'}{tempUnit === 'C_TO_F' ? ' °F' : ' °C'}</h3>
      </section>

    </div>
  );
}

export default ConverterApp;
