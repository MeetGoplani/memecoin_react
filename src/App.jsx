import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { useWeb3Modal } from '@web3modal/wagmi/react'

import './styles.css';

// Form validation schema
const tokenFormSchema = z.object({
  symbol: z.string()
    .min(1, 'Token symbol is required')
    .max(10, 'Token symbol cannot exceed 10 characters'),
  name: z.string()
    .min(1, 'Token name is required')
    .max(50, 'Token name cannot exceed 50 characters'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  websiteUrl: z.string()
    .min(1, 'Website URL is required')
    .url('Invalid website URL')
    .refine(url => {
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        return domain.includes('.');
      } catch {
        return false;
      }
    }, 'Invalid website domain'),
  twitterUrl: z.string()
    .min(1, 'Twitter URL is required')
    .url('Invalid Twitter URL')
    .refine(url => url.includes('twitter.com'), 'Must be a Twitter URL'),
  telegramUrl: z.string()
    .min(1, 'Telegram URL is required')
    .url('Invalid Telegram URL')
    .refine(url => url.includes('t.me'), 'Must be a Telegram URL'),
  discordUrl: z.string()
    .url('Invalid Discord URL')
    .refine(url => url.includes('discord.com') || url === '', 'Must be a Discord URL')
    .optional(),
});

function App() {
  const [selectedChain, setSelectedChain] = useState('mainnet');
  const [selectedDex, setSelectedDex] = useState('Raydium');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [iconPreview, setIconPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const iconPreviewRef = useRef(null);
  const bannerPreviewRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(tokenFormSchema),
    mode: 'onChange',
    defaultValues: {
      symbol: '',
      name: '',
      description: '',
      websiteUrl: '',
      twitterUrl: '',
      telegramUrl: '',
      discordUrl: ''
    }
  });

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }

  const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'icon') {
        setIconPreview(reader.result);
        if (iconPreviewRef.current) {
          iconPreviewRef.current.style.display = 'block';
        }
      } else {
        setBannerPreview(reader.result);
        if (bannerPreviewRef.current) {
          bannerPreviewRef.current.style.display = 'block';
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = (type) => {
    if (type === 'icon' && iconInputRef.current) {
      iconInputRef.current.click();
    } else if (type === 'banner' && bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

  const handleThemeChange = (mode) => {
    setIsDarkMode(mode === 'dark');
    document.body.className = mode === 'dark' ? 'dark-mode' : '';
  };

  // Replace the existing import
// Move this import to the top of the file with other imports

  const { address, isConnected } = useAccount()
  const { connect, isLoading: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  // Update the wallet connection handler
  const handleWalletConnect = async () => {
    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await connect()
      setIsWalletConnected(true)
    } catch (error) {
      console.error("Connection failed", error)
      alert("Failed to connect wallet.")
    }
  }

  const onSubmit = async (data) => {
    if (!isWalletConnected) {
      alert("Please connect your wallet first");
      return;
    }


    console.log("Creating contract with:", {
      chain: selectedChain,
      dex: selectedDex,
      tokenInfo: data,
      iconPreview,
      bannerPreview
    });
  };

  // Keeping the original navigation layout
  // Add this effect to watch form validity and icon
  // Update the useEffect hook
  useEffect(() => {
    const element = document.querySelector('w3m-button');
    if (element) {
      if (!isValid) {
        element.setAttribute('disabled', '');
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.5';
      } else {
        element.removeAttribute('disabled');
        element.style.pointerEvents = 'auto';
        element.style.opacity = '1';
      }
    }
  }, [isValid]);

  // Update the button in renderNavbar
  const renderNavbar = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/"><img src="logo.png" alt="Logo" className="logo" /></a>
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
        <w3m-button
          onClick={handleWalletConnect} 
          balance="show"
          disabled={!isValid}
          className="w3m-button"
        />
      </div>
    </nav>
  );

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      {renderNavbar()}

      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="header">
            Launch your token on <span className="highlight"></span>
          </div>
          <div className="subtext">Takes just a few seconds</div>

          <div className="section-title">Choose a Chain</div>
          <div className="box" id="chain-box">
            {['mainnet', 'Polygon', 'Arbitrum', 'Optimism'].map(chain => (
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
              <label htmlFor="symbol">Token Symbol *</label>
              <input
                id="symbol"
                {...register('symbol')}
                className={errors.symbol ? 'error' : ''}
              />
              {errors.symbol && (
                <div className="error-message">{errors.symbol.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="name">Token Name *</label>
              <input
                id="name"
                {...register('name')}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <div className="error-message">{errors.name.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register('description')}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && (
                <div className="error-message">{errors.description.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="websiteUrl">Official Website URL *</label>
              <input
                id="websiteUrl"
                type="url"
                placeholder="https://example.com"
                {...register('websiteUrl')}
                className={errors.websiteUrl ? 'error' : ''}
              />
              {errors.websiteUrl && (
                <div className="error-message">{errors.websiteUrl.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="twitterUrl">Twitter URL *</label>
              <input
                id="twitterUrl"
                type="url"
                placeholder="https://twitter.com/example"
                {...register('twitterUrl')}
                className={errors.twitterUrl ? 'error' : ''}
              />
              {errors.twitterUrl && (
                <div className="error-message">{errors.twitterUrl.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telegramUrl">Telegram URL *</label>
              <input
                id="telegramUrl"
                type="url"
                placeholder="https://t.me/example"
                {...register('telegramUrl')}
                className={errors.telegramUrl ? 'error' : ''}
              />
              {errors.telegramUrl && (
                <div className="error-message">{errors.telegramUrl.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="discordUrl">Discord URL</label>
              <input
                id="discordUrl"
                type="url"
                placeholder="https://discord.com/invite/example"
                {...register('discordUrl')}
                className={errors.discordUrl ? 'error' : ''}
              />
              {errors.discordUrl && (
                <div className="error-message">{errors.discordUrl.message}</div>
              )}
            </div>
          </div>

          

          <button 
            type="submit"
            className="create-contract-button"
            disabled={!isWalletConnected || !isValid || !iconPreview}
          >
            Create Contract
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;