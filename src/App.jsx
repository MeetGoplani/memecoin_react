import { useState } from 'react';
import './App.css';

function App() {
  const [selectedChain, setSelectedChain] = useState('Solana');
  const [selectedDex, setSelectedDex] = useState('Raydium');
  const [tokenInfo, setTokenInfo] = useState({
    symbol: '',
    name: '',
    description: '',
    websiteUrl: '',
    twitterUrl: '',
    telegramUrl: '',
    discordUrl: ''
  });
  const [iconPreview, setIconPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleTokenInfoChange = (e) => {
    const { id, value } = e.target;
    setTokenInfo(prev => ({
      ...prev,
      [id.replace('-', '')]: value
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'icon') setIconPreview(reader.result);
        else setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeChange = (mode) => {
    setIsDarkMode(mode === 'dark');
    document.body.className = mode === 'dark' ? 'dark-mode' : '';
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="index.html"><img src="logo.png" alt="Logo" className="logo" /></a>
          <div className="dropdown">
            <button className="dropbtn">Trade</button>
            <div className="dropdown-content">
              <a href="#">Option 1</a>
              <a href="#">Option 2</a>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropbtn">Explore</button>
            <div className="dropdown-content">
              <a href="#">Option 1</a>
              <a href="#">Option 2</a>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropbtn">Pool</button>
            <div className="dropdown-content">
              <a href="#">Option 1</a>
              <a href="#">Option 2</a>
            </div>
          </div>
        </div>
        <div className="navbar-center">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
        <div className="navbar-right">
          <div className="dropdown">
            <button className="dropbtn">Theme</button>
            <div className="dropdown-content">
              <a href="#" onClick={() => handleThemeChange('light')}>Light Mode</a>
              <a href="#" onClick={() => handleThemeChange('dark')}>Dark Mode</a>
            </div>
          </div>
          <button id="uniswap-wallet-btn" className="wallet-button">
            Connect Uniswap Wallet
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="header">
          Launch your token on <span className="highlight"></span>
        </div>
        <div className="subtext">Takes just a few seconds</div>

        <div className="section-title">Choose a Chain</div>
        <div className="box" id="chain-box">
          {['Solana', 'Base', 'Abstract', 'Berachain'].map(chain => (
            <div
              key={chain}
              className={`option ${selectedChain === chain ? 'selected' : ''}`}
              onClick={() => setSelectedChain(chain)}
            >
              {chain}
            </div>
          ))}
        </div>

        <div className="section-title">Choose a DEX</div>
        <div className="box" id="dex-box">
          <div
            className={`option ${selectedDex === 'Raydium' ? 'selected' : ''}`}
            onClick={() => setSelectedDex('Raydium')}
          >
            Raydium<br /><small>Get 2 SOL when your token migrates</small>
          </div>
          <div
            className={`option ${selectedDex === 'Meteora' ? 'selected' : ''}`}
            onClick={() => setSelectedDex('Meteora')}
          >
            Meteora<br />
            <small>
              AirLock! Top 50 holders get LP rewards daily!
              <a href="#" style={{ color: 'yellow' }}>More &gt;</a>
            </small>
          </div>
        </div>

        <div className="section-title">Token Information</div>
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="token-symbol">Token Symbol *</label>
            <input
              type="text"
              id="token-symbol"
              value={tokenInfo.symbol}
              onChange={handleTokenInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="token-name">Token Name *</label>
            <input
              type="text"
              id="token-name"
              value={tokenInfo.name}
              onChange={handleTokenInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={tokenInfo.description}
              onChange={handleTokenInfoChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="website-url">Official Website URL *</label>
            <input
              type="url"
              id="website-url"
              placeholder="https://example.com"
              value={tokenInfo.websiteUrl}
              onChange={handleTokenInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="twitter-url">Twitter URL *</label>
            <input
              type="url"
              id="twitter-url"
              placeholder="https://twitter.com/example"
              value={tokenInfo.twitterUrl}
              onChange={handleTokenInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telegram-url">Telegram URL *</label>
            <input
              type="url"
              id="telegram-url"
              placeholder="https://t.me/example"
              value={tokenInfo.telegramUrl}
              onChange={handleTokenInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="discord-url">Discord URL</label>
            <input
              type="url"
              id="discord-url"
              placeholder="https://discord.com/invite/example"
              value={tokenInfo.discordUrl}
              onChange={handleTokenInfoChange}
            />
          </div>
        </div>

        <div className="section-title">Upload Icon & Banner</div>
        <div className="upload-container">
          <div className="upload-box">
            <label>Icon <span className="required">*</span></label>
            <div className="upload-area" id="icon-upload">
              {iconPreview && <img src={iconPreview} alt="Icon Preview" />}
              <span>📷 Upload</span>
              <input
                type="file"
                id="icon-input"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'icon')}
              />
            </div>
          </div>
          <div className="upload-box">
            <label>Banner</label>
            <div className="upload-area" id="banner-upload">
              {bannerPreview && <img src={bannerPreview} alt="Banner Preview" />}
              <span>📷 Upload</span>
              <input
                type="file"
                id="banner-input"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'banner')}
              />
            </div>
          </div>
        </div>

        <button id="create-contract-btn" className="create-contract-button">
          Create Contract
        </button>
      </div>
    </div>
  );
}

export default App;