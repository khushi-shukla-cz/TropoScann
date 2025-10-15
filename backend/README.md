# TropoScan Backend

This is the integrated backend that combines the frontend requirements with the real AI model from mainbackend.

## Features

- **Real PyTorch Model Integration**: Uses the actual U-Net model from mainbackend
- **Graceful Fallback**: Falls back to mock implementation if real model unavailable
- **Full API Compatibility**: Compatible with existing frontend
- **Real Utilities**: Uses mainbackend utilities for mask prediction, overlay generation, and risk scoring

## Setup

1. **Install Dependencies**:
   ```bash
   python setup.py
   ```

2. **Start Server**:
   ```bash
   python app.py
   ```

## API Endpoints

- `GET /api/health` - Server health and model status
- `POST /api/detect` - Upload and analyze satellite images
- `GET /api/sample-images` - List available sample images
- `POST /api/sample/<id>` - Analyze predefined samples
- `GET /api/model-info` - Get detailed model information

## Architecture

```
integrated_backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── setup.py           # Setup and verification script
└── README.md          # This file

Dependencies:
├── mainbackend/       # Real AI model and utilities
│   ├── utils/         # Prediction, overlay, risk utilities
│   ├── model/         # Trained PyTorch U-Net model
│   └── data/          # Sample images
└── frontend/          # React frontend application
```

## Model Integration

The integrated backend:

1. **Loads Real Model**: Attempts to load the PyTorch U-Net from `mainbackend/model/unet_insat.pt`
2. **Uses Real Utilities**: Leverages `predict_mask.py`, `generate_overlay.py`, and `risk_score.py`
3. **Processes Real Samples**: Uses actual sample images from `mainbackend/data/images/`
4. **Fallback Logic**: Provides mock implementation if real model unavailable

## Usage

### From Frontend
The React frontend at `http://localhost:5173` will automatically connect to this backend.

### Direct API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Upload image for detection
curl -X POST -F "image=@satellite_image.jpg" http://localhost:5000/api/detect

# Process sample
curl -X POST http://localhost:5000/api/sample/cyclone
```

## Model Status

The server provides real-time model status:
- ✅ **Real Model**: PyTorch U-Net with trained weights
- 🎭 **Mock Model**: Demonstration implementation

Check `/api/model-info` for current status and configuration.
